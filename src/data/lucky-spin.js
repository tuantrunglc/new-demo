// Dữ liệu mẫu cho tính năng Vòng Quay May Mắn

export const spinRewards = [
  {
    id: 1,
    name: "Voucher 500K",
    color: "#FF6B6B",
    icon: "fas fa-ticket-alt",
    probability: 0.05,
    description: "Voucher 500.000đ cho đơn hàng tiếp theo của bạn!"
  },
  {
    id: 2,
    name: "Miễn phí vận chuyển",
    color: "#4ECDC4",
    icon: "fas fa-truck",
    probability: 0.15,
    description: "Miễn phí vận chuyển cho đơn hàng tiếp theo!"
  },
  {
    id: 3,
    name: "Giảm 10%",
    color: "#FFE66D",
    icon: "fas fa-percent",
    probability: 0.2,
    description: "Giảm 10% cho đơn hàng tiếp theo của bạn!"
  },
  {
    id: 4,
    name: "Không trúng",
    color: "#C7F9CC",
    icon: "fas fa-times-circle",
    probability: 0.25,
    description: "Chúc bạn may mắn lần sau!"
  },
  {
    id: 5,
    name: "Giảm 5%",
    color: "#FF9F1C",
    icon: "fas fa-tag",
    probability: 0.2,
    description: "Giảm 5% cho đơn hàng tiếp theo của bạn!"
  },
  {
    id: 6,
    name: "Mua 1 Tặng 1",
    color: "#A9DEF9",
    icon: "fas fa-gift",
    probability: 0.05,
    description: "Mua một tặng một cho các sản phẩm được chọn!"
  },
  {
    id: 7,
    name: "Hộp Quà Bí Mật",
    color: "#E4C1F9",
    icon: "fas fa-box",
    probability: 0.05,
    description: "Một món quà bất ngờ với đơn hàng tiếp theo của bạn!"
  },
  {
    id: 8,
    name: "Điểm Thưởng",
    color: "#FCF6BD",
    icon: "fas fa-star",
    probability: 0.05,
    description: "100 điểm thưởng được thêm vào tài khoản của bạn!"
  }
];

export const spinHistory = [
  {
    id: 1,
    date: "2023-07-10",
    reward: "Giảm 10%",
    used: true
  },
  {
    id: 2,
    date: "2023-07-08",
    reward: "Miễn phí vận chuyển",
    used: false
  },
  {
    id: 3,
    date: "2023-07-05",
    reward: "Không trúng",
    used: true
  },
  {
    id: 4,
    date: "2023-07-01",
    reward: "Điểm Thưởng",
    used: true
  },
  {
    id: 5,
    date: "2023-06-28",
    reward: "Giảm 5%",
    used: false
  }
];