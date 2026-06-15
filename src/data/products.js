/**
 * products.js — Sprouty Kit & Workshop data
 *
 * CHUNK-15: All prices stored as raw VND integers.
 * Use formatVND(price, locale) / useFormatVND() hook for display.
 * `priceLabel` strings have been REMOVED — generate them at render time.
 *
 * Pricing from CLAUDE.md Section 6.1.
 */

export const KITS = [
  {
    id: "standard-kit",
    name: "Standard Kit",
    subtitle: "Thuần thủ công",
    emoji: "🪴",
    price: 150000,
    originalPrice: 230000,
    discount: "35% off",
    color: "from-orange-400 to-yellow-400",
    contents: ["🪴 Chậu đất nung", "🎨 6 màu acrylic", "🌱 3 loại hạt giống", "🌍 Đất trồng", "📖 Sách hướng dẫn", "📱 App Sprouty"],
    desc: "Bộ khởi đầu hoàn hảo — chậu trắng, hạt giống, đất và phép màu Sprouty!",
    badge: null,
  },
  {
    id: "smart-kit",
    name: "Smart Kit",
    subtitle: "Local IoT · Arduino",
    emoji: "🤖",
    price: 380000,
    originalPrice: 520000,
    discount: "27% off",
    color: "from-green-500 to-teal-500",
    contents: ["📦 Standard Kit đầy đủ", "🔌 Arduino Nano V3", "📺 Màn hình OLED 0.96\"", "💧 Cảm biến độ ẩm đất", "⏰ Module RTC DS3231", "💡 LED RGB WS2812B"],
    desc: "Smart Kit với cảm biến IoT cục bộ — OLED hiển thị biểu cảm cây, LED báo hiệu theo màu!",
    badge: "🔥 Bán chạy",
  },
  {
    id: "advanced-kit",
    name: "Advanced Kit",
    subtitle: "IoT Cloud · ESP32",
    emoji: "☁️",
    price: 550000,
    originalPrice: 720000,
    discount: "24% off",
    color: "from-purple-500 to-indigo-600",
    contents: ["📦 Standard Kit đầy đủ", "⚡ ESP32 4MB Flash (Wi-Fi)", "📺 Màn hình OLED 1.3\"", "💧 Cảm biến điện dung", "🔋 Pin lithium sạc được", "☁️ Đồng bộ Firebase real-time"],
    desc: "Kit cao cấp với ESP32 Wi-Fi — tự động đồng bộ lên cloud, thông báo đến điện thoại phụ huynh!",
    badge: "⭐ VIP",
  },
];

export const WORKSHOPS = [
  {
    id: "basic-workshop",
    name: "Basic Workshop",
    emoji: "🎨",
    price: 220000,
    includes: "Standard Kit + 1 buổi học",
    date: "Thứ 7, 14/06 · 10:00",
    spots: 6,
    color: "bg-orange-50 border-orange-200",
    desc: "Tô màu chậu + trồng cây + setup tài khoản Sprouty. Phù hợp bé 4–10 tuổi và cả gia đình!",
  },
  {
    id: "smart-workshop",
    name: "Smart Kit Workshop",
    emoji: "🔌",
    price: 450000,
    includes: "Smart Kit + 1 buổi học",
    date: "Chủ nhật, 22/06 · 14:00",
    spots: 8,
    color: "bg-green-50 border-green-200",
    desc: "Lắp ráp mạch điện + kết nối cảm biến + trang trí chậu. Dành cho bé 10+ và phụ huynh yêu STEM.",
  },
  {
    id: "advanced-workshop",
    name: "Advanced Workshop",
    subtitle: "STEM",
    emoji: "🚀",
    price: 650000,
    includes: "Advanced Kit + 1 buổi STEM",
    date: "Thứ 7, 28/06 · 11:00",
    spots: 4,
    color: "bg-purple-50 border-purple-200",
    desc: "Lập trình Arduino C++ + kết nối Firebase API. Cho học sinh 10–18 tuổi muốn làm IoT thật sự!",
  },
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 150000,
    period: "một lần",
    features: ["1 Standard Kit", "Cây Kỷ Niệm cơ bản", "10 lá ký ức", "3 Plant Buddies"],
    btn: "Bắt đầu ngay",
    variant: "secondary",
  },
  {
    id: "family",
    name: "Family",
    price: 220000,
    period: "gói workshop",
    features: ["Standard Kit + buổi học", "Cây Kỷ Niệm đầy đủ", "Lá ký ức không giới hạn", "Tất cả Plant Buddies", "AI Caption", "Chia sẻ gia đình"],
    btn: "Giá trị nhất 🌟",
    variant: "primary",
    featured: true,
  },
  {
    id: "vip",
    name: "VIP Garden",
    price: 550000,
    period: "kit cao cấp",
    features: ["Advanced Kit ESP32", "Cây Vàng chói lọi", "Plant Buddies hiếm", "Hiệu ứng theo mùa", "Nhật ký AI hàng tháng", "Hỗ trợ ưu tiên"],
    btn: "Lên VIP ✨",
    variant: "gold",
  },
];

/** VIP Subscription pricing — numeric amounts for formatVND() */
export const VIP_PRICES = {
  monthly: 20000,
  annual: 180000,
};
