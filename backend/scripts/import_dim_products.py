#!/usr/bin/env python3
"""
backend/scripts/import_dim_products.py

Idempotent CSV → DB importer for products and categories.

Usage:
    python backend/scripts/import_dim_products.py --csv /path/to/dim_products.csv
    python backend/scripts/import_dim_products.py --csv dim_products.csv --dry-run
    python backend/scripts/import_dim_products.py --csv dim_products.csv --limit 10 --verbose
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from datetime import datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Ensure the backend package is importable regardless of cwd
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent          # backend/scripts/
BACKEND_DIR = SCRIPT_DIR.parent                        # backend/
PROJECT_DIR = BACKEND_DIR.parent                       # repo root

# Add backend/ to sys.path so `from models import …` works
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app import app                                    # noqa: E402
from models import db, Inventory, Category             # noqa: E402

# ---------------------------------------------------------------------------
# Column-name mapping (case-insensitive detection)
# ---------------------------------------------------------------------------
COLUMN_ALIASES: dict[str, list[str]] = {
    "sku_id":      ["sku_id", "sku", "skuid"],
    "name":        ["name", "product_name", "product", "title"],
    "category":    ["category", "category_name", "cat"],
    "price":       ["price", "unit_price", "selling_price"],
    "quantity":    ["quantity", "qty", "stock"],
    "expiry":      ["expiry", "expiration_date", "exp_date", "expire_date"],
    "description": ["description", "desc"],
    "status":      ["status"],
}


def resolve_columns(header: list[str]) -> dict[str, str | None]:
    """Return {logical_name: actual_csv_column_name} mapping."""
    lower_header = {h.strip().lower(): h.strip() for h in header}
    mapping: dict[str, str | None] = {}
    for logical, aliases in COLUMN_ALIASES.items():
        found = None
        for alias in aliases:
            if alias in lower_header:
                found = lower_header[alias]
                break
        mapping[logical] = found
    return mapping


def parse_date(val: str | None) -> "None | __import__('datetime').date":
    """Parse YYYY-MM-DD; return None on failure or empty."""
    if not val or not val.strip():
        return None
    try:
        return datetime.strptime(val.strip(), "%Y-%m-%d").date()
    except ValueError:
        return None


def safe_float(val: str | None, default: float = 0.0) -> float:
    if val is None or str(val).strip() == "":
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def safe_int(val: str | None, default: int = 0) -> int:
    if val is None or str(val).strip() == "":
        return default
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return default


# ---------------------------------------------------------------------------
# Ensure sku_id column exists in SQLite (ALTER TABLE if needed)
# ---------------------------------------------------------------------------
def ensure_sku_id_column() -> None:
    """Add sku_id column to inventory table if it does not exist yet."""
    inspector = db.inspect(db.engine)
    cols = [c["name"] for c in inspector.get_columns("inventory")]
    if "sku_id" not in cols:
        print("[migrate] Adding sku_id column to inventory table …")
        with db.engine.begin() as conn:
            conn.execute(db.text("ALTER TABLE inventory ADD COLUMN sku_id VARCHAR(20)"))
            conn.execute(db.text("CREATE UNIQUE INDEX IF NOT EXISTS ix_inventory_sku_id ON inventory (sku_id)"))
        print("[migrate] Done.")


# ---------------------------------------------------------------------------
# Core import logic
# ---------------------------------------------------------------------------
def run_import(csv_path: str, *, dry_run: bool = False, limit: int = 0, verbose: bool = False) -> None:
    if not os.path.isfile(csv_path):
        print(f"[error] CSV file not found: {csv_path}")
        sys.exit(1)

    # Read CSV ---------------------------------------------------------------
    with open(csv_path, newline="", encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        if reader.fieldnames is None:
            print("[error] CSV has no header row.")
            sys.exit(1)

        col_map = resolve_columns(list(reader.fieldnames))

        # Validate required columns
        for req in ("sku_id", "name", "category"):
            if col_map[req] is None:
                print(f"[error] Required column '{req}' not found in CSV. Header: {reader.fieldnames}")
                sys.exit(1)

        rows = list(reader)

    print(f"[info] CSV loaded: {len(rows)} rows, columns mapped: { {k: v for k, v in col_map.items() if v} }")

    if limit > 0:
        rows = rows[:limit]
        print(f"[info] --limit applied: processing first {limit} rows")

    # Counters ---------------------------------------------------------------
    stats = {
        "categories_inserted": 0,
        "categories_reused": 0,
        "products_inserted": 0,
        "products_updated": 0,
        "rows_skipped": 0,
        "skip_reasons": [],
    }

    # -- Phase 1: Upsert categories -----------------------------------------
    # Collect unique category names from the CSV
    cat_names: set[str] = set()
    for row in rows:
        raw_cat = (row.get(col_map["category"]) or "").strip()
        if raw_cat:
            cat_names.add(raw_cat)

    # Build a lowercase → Category object cache from DB
    existing_cats: dict[str, Category] = {}
    for cat in Category.query.all():
        existing_cats[cat.name.strip().lower()] = cat

    for cat_name in sorted(cat_names):
        key = cat_name.lower()
        if key in existing_cats:
            # Reactivate soft-deleted category
            cat_obj = existing_cats[key]
            if cat_obj.status == "deleted":
                if not dry_run:
                    cat_obj.status = "active"
                stats["categories_reused"] += 1
                if verbose:
                    print(f"  [cat] reactivated: {cat_name}")
            else:
                stats["categories_reused"] += 1
                if verbose:
                    print(f"  [cat] exists: {cat_name}")
        else:
            if not dry_run:
                new_cat = Category(name=cat_name, description="", status="active")
                db.session.add(new_cat)
                existing_cats[key] = new_cat
            stats["categories_inserted"] += 1
            if verbose:
                print(f"  [cat] INSERT: {cat_name}")

    if not dry_run:
        db.session.flush()  # assign IDs so we can reference them

    # -- Phase 2: Upsert products -------------------------------------------
    # Build lookup caches
    sku_cache: dict[str, Inventory] = {}
    name_cache: dict[str, Inventory] = {}
    for inv in Inventory.query.all():
        if inv.sku_id:
            sku_cache[inv.sku_id.strip().upper()] = inv
        name_cache[inv.name.strip().lower()] = inv

    batch_size = 500
    processed = 0

    for i, row in enumerate(rows):
        sku_raw = (row.get(col_map["sku_id"]) or "").strip()
        name_raw = (row.get(col_map["name"]) or "").strip()
        cat_raw = (row.get(col_map["category"]) or "").strip()

        # Validate required fields
        if not sku_raw or not name_raw or not cat_raw:
            reason = f"row {i+1}: missing"
            missing = []
            if not sku_raw:
                missing.append("sku_id")
            if not name_raw:
                missing.append("name")
            if not cat_raw:
                missing.append("category")
            reason += " " + ",".join(missing)
            stats["rows_skipped"] += 1
            stats["skip_reasons"].append(reason)
            if verbose:
                print(f"  [skip] {reason}")
            continue

        price = safe_float(row.get(col_map["price"]) if col_map["price"] else None)
        quantity = safe_int(row.get(col_map["quantity"]) if col_map["quantity"] else None)
        expiry = parse_date(row.get(col_map["expiry"]) if col_map["expiry"] else None)
        description = (row.get(col_map["description"]) if col_map["description"] else "") or ""
        description = description.strip()
        status_val = (row.get(col_map["status"]) if col_map["status"] else "active") or "active"
        status_val = status_val.strip().lower()
        if status_val not in ("active", "inactive", "deleted"):
            status_val = "active"

        sku_upper = sku_raw.upper()

        # Try to find existing product
        existing: Inventory | None = sku_cache.get(sku_upper)
        if existing is None:
            # Fallback: match by name
            existing = name_cache.get(name_raw.lower())

        if existing is not None:
            # UPDATE existing product
            if not dry_run:
                existing.sku_id = sku_raw
                existing.name = name_raw
                existing.category = cat_raw
                if price > 0:
                    existing.price = price
                if quantity > 0:
                    existing.quantity = quantity
                if expiry is not None:
                    existing.expiry = expiry
                if description:
                    existing.description = description
                existing.status = status_val
            stats["products_updated"] += 1
            if verbose:
                print(f"  [product] UPDATE: {sku_raw} – {name_raw}")
            # Update caches
            sku_cache[sku_upper] = existing
            name_cache[name_raw.lower()] = existing
        else:
            # INSERT new product
            if not dry_run:
                new_inv = Inventory(
                    sku_id=sku_raw,
                    name=name_raw,
                    category=cat_raw,
                    price=price,
                    quantity=quantity,
                    expiry=expiry,
                    description=description,
                    status=status_val,
                )
                db.session.add(new_inv)
                sku_cache[sku_upper] = new_inv
                name_cache[name_raw.lower()] = new_inv
            stats["products_inserted"] += 1
            if verbose:
                print(f"  [product] INSERT: {sku_raw} – {name_raw}")

        processed += 1
        if not dry_run and processed % batch_size == 0:
            db.session.flush()

    # Final commit -----------------------------------------------------------
    if not dry_run:
        db.session.commit()
        print("[info] All changes committed.")
    else:
        print("[info] DRY RUN – no changes written to database.")

    # Summary ----------------------------------------------------------------
    print("\n" + "=" * 55)
    print("  IMPORT SUMMARY")
    print("=" * 55)
    print(f"  Categories inserted : {stats['categories_inserted']}")
    print(f"  Categories reused   : {stats['categories_reused']}")
    print(f"  Products inserted   : {stats['products_inserted']}")
    print(f"  Products updated    : {stats['products_updated']}")
    print(f"  Rows skipped        : {stats['rows_skipped']}")
    if stats["skip_reasons"]:
        print("  Skip reasons:")
        for r in stats["skip_reasons"]:
            print(f"    - {r}")
    print("=" * 55)


# ---------------------------------------------------------------------------
# CLI entrypoint
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import products & categories from dim_products.csv into the backend DB."
    )
    parser.add_argument("--csv", required=True, help="Path to the CSV file")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing to DB")
    parser.add_argument("--limit", type=int, default=0, help="Max rows to process (0 = all)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Print per-row details")
    args = parser.parse_args()

    with app.app_context():
        ensure_sku_id_column()
        run_import(args.csv, dry_run=args.dry_run, limit=args.limit, verbose=args.verbose)


if __name__ == "__main__":
    main()
