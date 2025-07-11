// Sample data for Lucky Spin feature

export const luckySpinItems = [
  {
    id: 1,
    label: "Voucher $2",
    type: "voucher",
    value: 50000,
    probability: 15,
    color: "#FF5733",
    icon: "ticket"
  },
  {
    id: 2,
    label: "Voucher $4",
    type: "voucher",
    value: 100000,
    probability: 10,
    color: "#33FF57",
    icon: "ticket"
  },
  {
    id: 3,
    label: "Voucher $8",
    type: "voucher",
    value: 200000,
    probability: 5,
    color: "#3357FF",
    icon: "ticket"
  },
  {
    id: 4,
    label: "Free Shipping",
    type: "freeship",
    value: 0,
    probability: 20,
    color: "#FF33A8",
    icon: "truck"
  },
  {
    id: 5,
    label: "5% Off",
    type: "discount",
    value: 5,
    probability: 15,
    color: "#33FFF6",
    icon: "percent"
  },
  {
    id: 6,
    label: "10% Off",
    type: "discount",
    value: 10,
    probability: 10,
    color: "#F6FF33",
    icon: "percent"
  },
  {
    id: 7,
    label: "15% Off",
    type: "discount",
    value: 15,
    probability: 5,
    color: "#FF33F6",
    icon: "percent"
  },
  {
    id: 8,
    label: "Better luck next time",
    type: "none",
    value: 0,
    probability: 20,
    color: "#CCCCCC",
    icon: "frown"
  }
];

export const userSpins = [
  {
    userId: 1,
    spinsRemaining: 3,
    history: [
      {
        date: "2023-07-10T10:30:00Z",
        itemId: 4,
        itemLabel: "Free Shipping"
      },
      {
        date: "2023-07-12T15:45:00Z",
        itemId: 8,
        itemLabel: "Better luck next time"
      }
    ]
  },
  {
    userId: 4,
    spinsRemaining: 1,
    history: [
      {
        date: "2023-07-11T09:15:00Z",
        itemId: 5,
        itemLabel: "5% Off"
      }
    ]
  }
];