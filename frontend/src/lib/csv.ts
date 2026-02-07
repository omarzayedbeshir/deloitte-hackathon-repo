// lib/csv.ts

function escapeField(field: string): string {
    const str = String(field);
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

export function exportToCsv(
    filename: string,
    rows: Record<string, unknown>[],
    headers: string[]
): void {
    const headerRow = headers.map(escapeField).join(",");
    const dataRows = rows.map((row) =>
        headers.map((h) => escapeField(String(row[h] ?? ""))).join(",")
    );
    const csvContent = [headerRow, ...dataRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
