export interface OrderHistory {
  id: string;
  date: Date;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  time: string;
}

export const mockOrderHistory: OrderHistory[] = [
  {
    id: "1",
    date: new Date(2023, 0, 7), // 7 January 2023
    items: [
      { name: "Nasgor Biasa", quantity: 1, price: 10000 },
      { name: "Es Teh", quantity: 1, price: 6000 },
      { name: "Kopi", quantity: 1, price: 6000 },
    ],
    totalPrice: 36000,
    time: "16:43",
  },
  {
    id: "2",
    date: new Date(2023, 0, 5), // 5 January 2023
    items: [
      { name: "Kwetiau Goreng", quantity: 2, price: 10000 },
      { name: "Susu", quantity: 1, price: 8000 },
    ],
    totalPrice: 36000,
    time: "16:43",
  },
  {
    id: "3",
    date: new Date(2022, 11, 29), // 29 December 2022
    items: [
      { name: "Nasgor Spesial", quantity: 1, price: 16000 },
      { name: "Es Teh", quantity: 1, price: 6000 },
      { name: "Sirup", quantity: 1, price: 4000 },
    ],
    totalPrice: 36000,
    time: "16:43",
  },
  {
    id: "4",
    date: new Date(2022, 11, 18), // 18 December 2022
    items: [
      { name: "Nasgor Biasa", quantity: 2, price: 10000 },
      { name: "Kopi", quantity: 1, price: 6000 },
    ],
    totalPrice: 36000,
    time: "16:43",
  },
];
