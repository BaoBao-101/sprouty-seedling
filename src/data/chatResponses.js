export function classifyIntent(text) {
  const t = text.toLowerCase();
  const techKeywords = [
    'arduino', 'esp32', 'code', 'lập trình', 'sensor', 'cảm biến',
    'i2c', 'oled', 'firmware', 'wifi', 'serial', 'sketch', 'ws2812',
    'rtc', 'ds3231', 'ssd1306', 'sh1106', 'neopixel', 'bootloader',
    'upload code', 'nạp code', 'compile', 'library', 'thư viện',
  ];
  const purchaseKeywords = [
    'mua', 'giá', 'bao nhiêu', 'price', 'buy', 'order', 'đặt hàng',
    'thanh toán', 'shop', 'bán', 'tiền', 'đồng', 'kit', 'sản phẩm',
  ];
  const careKeywords = [
    'tưới', 'nước', 'chăm', 'cây', 'lá', 'héo', 'sâu', 'đất',
    'water', 'plant', 'care', 'grow', 'trồng', 'mọc', 'giai đoạn',
    'phân', 'bón', 'ánh sáng', 'nắng', 'sun', 'light',
  ];

  if (techKeywords.some(k => t.includes(k))) return 'tech';
  if (purchaseKeywords.some(k => t.includes(k))) return 'purchase';
  if (careKeywords.some(k => t.includes(k))) return 'care';
  return 'general';
}

export const MODE1_RESPONSES = {
  greeting: "Xin chào! 👋 Mình là Sprouty Bot 🌱\nBạn muốn tìm hiểu về kit trồng cây, workshop, hay cần hỗ trợ gì không?",
  general: [
    {
      match: ['sprouty', 'là gì', 'giới thiệu', 'what is', 'app này'],
      response: "Sprouty là bộ kit trồng cây thông minh dành cho gia đình! 🌱 Bạn trồng cây thật, còn app Sprouty giúp lưu giữ mọi kỷ niệm thành một Cây Kỷ Niệm số đẹp lung linh! ✨\n\nKit có từ phiên bản thủ công 150k đến IoT Cloud 550k!",
    },
    {
      match: ['workshop', 'buổi học', 'đăng ký', 'lịch', 'học'],
      response: "Sprouty có 3 loại workshop sắp tới:\n🎨 Basic (220.000đ) — tô màu + trồng cây\n🔌 Smart Kit (450.000đ) — lắp mạch IoT\n🚀 Advanced STEM (650.000đ) — lập trình Arduino\n\nĐặt chỗ ngay trước khi hết!",
      showWorkshops: true,
    },
    {
      match: ['vip', 'premium', 'nâng cấp', 'golden', 'gold'],
      response: "Gói VIP Garden chỉ 20.000đ/tháng! ✨\n🌟 Cây Vàng lung linh\n📚 Plant Buddies hiếm\n🤖 Nhật ký AI hàng tháng\n📊 Đồng bộ cloud real-time\n\nNâng cấp ngay để trải nghiệm magic! 🌟",
    },
    {
      match: ['tính năng', 'feature', 'chức năng', 'làm được gì'],
      response: "App Sprouty có các tính năng:\n🌳 Cây Kỷ Niệm — mỗi lá = 1 ký ức\n🪴 Plant Buddies — thu thập nhân vật cây\n📸 Upload ảnh/video kỷ niệm\n🤖 AI tạo caption tự động\n☁️ Đồng bộ real-time (VIP)\n\nTất cả trong 1 app! 💚",
    },
  ],
  fallback: "Mình chưa hiểu rõ câu hỏi 😊 Bạn có thể hỏi về:\n• Giá và nội dung các kit\n• Lịch workshop\n• Tính năng app Sprouty\n• Gói VIP Garden\n\nMình sẵn sàng tư vấn! 🌱",
};

export const MODE2_RESPONSES = {
  care: [
    {
      match: ['tưới', 'nước', 'water', 'khô', 'moisture', 'ẩm', 'drought'],
      response: "💧 Bí quyết tưới cây:\nChờ lớp đất trên mặt hơi khô tay trước khi tưới lại. Với cà chua và ớt, tưới sâu 2–3 lần/tuần là đủ. Đừng để đất quá ướt nhé — dễ thối rễ lắm! 🌱\n\nNếu có kit cảm biến, đèn LED đỏ blink = cây đang khát! 🔴",
    },
    {
      match: ['héo', 'vàng lá', 'lá vàng', 'chết', 'yếu', 'wilting', 'yellow', 'úa'],
      response: "😢 Lá vàng hoặc héo thường do 3 nguyên nhân:\n1. Thiếu nước → tưới thêm nhé\n2. Quá nhiều nắng trực tiếp → chuyển vào bóng mát\n3. Đất cứng → xới nhẹ xung quanh gốc\n\nKiểm tra biểu cảm OLED của cây — nó sẽ báo ngay! 📊",
    },
    {
      match: ['phân', 'bón', 'fertilizer', 'dinh dưỡng', 'chất'],
      response: "🌿 Bón phân cho cây:\nBắt đầu từ tuần thứ 3 sau khi nảy mầm. Dùng phân hữu cơ loãng (tỉ lệ 1:10 với nước) mỗi 2 tuần. Đừng bón quá nhiều — cây sẽ \"say\" và chậm ra quả! 😄",
    },
    {
      match: ['ánh sáng', 'nắng', 'sun', 'light', 'tối', 'bóng', 'shadow'],
      response: "☀️ Nhu cầu ánh sáng:\n🍅 Cà chua, ớt: 6–8 tiếng nắng/ngày\n🫘 Đậu: 4–6 tiếng\n🌻 Hướng dương: Càng nhiều nắng càng tốt!\n\nĐặt cây gần cửa sổ hướng Nam là lý tưởng! 🪟",
    },
    {
      match: ['giai đoạn', 'stage', 'lớn', 'grow', 'tiến hóa', 'khi nào', 'bao lâu'],
      response: "🌱→🌿→🌸→🍅 Cây của bạn sẽ qua 4 giai đoạn!\nThêm ký ức vào Cây Kỷ Niệm mỗi ngày để theo dõi hành trình. Mỗi lá = 1 kỷ niệm quý giá! 💚\n\nCây mất trung bình 3–6 tuần để đạt giai đoạn cuối nhé.",
    },
    {
      match: ['sâu', 'bệnh', 'pest', 'bug', 'mốc', 'nấm', 'fungus'],
      response: "🐛 Phòng sâu bệnh:\n• Xịt hỗn hợp nước + tỏi loãng xung quanh cây\n• Nhặt bỏ lá hỏng ngay khi phát hiện\n• Tránh tưới vào lá buổi tối — dễ bị nấm\n• Thông gió tốt xung quanh chậu\n\nTự nhiên là tốt nhất! 🌿",
    },
  ],
  fallback: "Mình có thể giúp về:\n💧 Tưới nước & độ ẩm đất\n☀️ Ánh sáng cho từng loại cây\n🌿 Bón phân & dinh dưỡng\n🐛 Phòng sâu bệnh\n📈 Theo dõi giai đoạn phát triển\n\nHỏi mình nhé! 😊",
};

export const MODE3_RESPONSES = {
  tech: [
    {
      match: ['i2c', 'địa chỉ', 'address', 'xung đột', 'conflict', 'scan'],
      response: "Lỗi I2C thường do xung đột địa chỉ. Kiểm tra:\n\nOLED SSD1306: 0x3C\nRTC DS3231:   0x68\n\nChạy I2C Scanner để xác nhận:\n```cpp\n#include <Wire.h>\nvoid setup() {\n  Wire.begin();\n  Serial.begin(9600);\n  for (byte a = 1; a < 127; a++) {\n    Wire.beginTransmission(a);\n    if (!Wire.endTransmission())\n      Serial.println(a, HEX);\n  }\n}\nvoid loop() {}\n```",
    },
    {
      match: ['oled', 'màn hình', 'display', 'ssd1306', 'sh1106'],
      response: "Setup OLED cơ bản với Adafruit_SSD1306:\n```cpp\n#include <Adafruit_SSD1306.h>\n#define WIDTH 128\n#define HEIGHT 64\nAdafruit_SSD1306 oled(WIDTH, HEIGHT, &Wire, -1);\n\nvoid setup() {\n  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);\n  oled.clearDisplay();\n  oled.setTextSize(2);\n  oled.setTextColor(WHITE);\n  oled.setCursor(0, 0);\n  oled.println(\"Sprouty!\");\n  oled.display();\n}\n```\nNếu dùng SH1106 (1.3\"), thay thư viện bằng Adafruit_SH110X.",
    },
    {
      match: ['soil', 'moisture', 'cảm biến', 'sensor', 'đất ẩm', 'humidity'],
      response: "Đọc cảm biến độ ẩm đất:\n```cpp\n#define SENSOR_PIN A0\n// Giá trị thô: ~900 = khô, ~300 = ướt\nint raw = analogRead(SENSOR_PIN);\nint percent = map(raw, 900, 300, 0, 100);\npercent = constrain(percent, 0, 100);\n\nif (percent < 30) {\n  // Báo khát — LED đỏ\n  setLED(255, 0, 0);\n} else {\n  // Đủ nước — LED xanh\n  setLED(0, 200, 0);\n}\n```\n⚠️ Seal đầu PCB cảm biến bằng keo nến để chống gỉ khi cắm vào đất ẩm.",
    },
    {
      match: ['led', 'ws2812', 'neopixel', 'rgb', 'màu led'],
      response: "WS2812B RGB LED với Adafruit NeoPixel:\n```cpp\n#include <Adafruit_NeoPixel.h>\n#define LED_PIN 6\n#define NUMPIXELS 1\nAdafruit_NeoPixel strip(NUMPIXELS, LED_PIN,\n  NEO_GRB + NEO_KHZ800);\n\nvoid setup() { strip.begin(); }\n\nvoid setLED(uint8_t r, uint8_t g, uint8_t b) {\n  strip.setPixelColor(0, strip.Color(r, g, b));\n  strip.show();\n}\n// Xanh = đủ nước | Đỏ blink = khát | Vàng = ban đêm\n```",
    },
    {
      match: ['rtc', 'ds3231', 'ds1307', 'thời gian', 'giờ', 'time', 'night', 'ban đêm', 'sleep'],
      response: "RTC + Night Mode tự động:\n```cpp\n#include <RTClib.h>\nRTC_DS3231 rtc;\n\nvoid setup() {\n  rtc.begin();\n  // Chỉ chạy 1 lần để set giờ:\n  // rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));\n}\n\nvoid loop() {\n  DateTime now = rtc.now();\n  bool isNight = (now.hour() >= 21 || now.hour() < 6);\n  if (isNight) {\n    oled.clearDisplay();\n    oled.println(\"Zzz\");\n    oled.display();\n    setLED(255, 180, 30); // Vàng ấm\n  }\n}\n```",
    },
    {
      match: ['esp32', 'wifi', 'firebase', 'cloud', 'sync', 'kết nối cloud', 'firestore'],
      response: "ESP32 gửi dữ liệu lên Firebase:\n```cpp\n#include <WiFi.h>\n#include <FirebaseESP32.h>\n\n#define WIFI_SSID \"YourSSID\"\n#define WIFI_PASS \"YourPass\"\n#define DB_URL   \"https://xxx.firebaseio.com\"\n#define DB_SECRET \"your-secret\"\n\nFirebaseData fbData;\n\nvoid setup() {\n  WiFi.begin(WIFI_SSID, WIFI_PASS);\n  while (WiFi.status() != WL_CONNECTED)\n    delay(500);\n  Firebase.begin(DB_URL, DB_SECRET);\n}\n\nvoid sendMoisture(int val) {\n  Firebase.setInt(fbData,\n    \"/plants/p1/moisture\", val);\n}\n```\n⚡ Dùng thư viện Firebase-ESP-Client cho ESP32 mới nhất.",
    },
    {
      match: ['upload', 'lỗi nạp', 'không nạp', 'error', 'bootloader', 'ch340', 'port'],
      response: "Lỗi upload Arduino Nano phổ biến:\n\n1. CH340 driver chưa cài → tải từ wch.cn\n2. Old Bootloader → Tools → Processor → ATmega328P (Old Bootloader)\n3. Port sai → Device Manager kiểm tra COMx\n4. Giữ nút RESET lúc upload bắt đầu (1–2 giây)\n5. Baud rate mismatch → thử 9600/115200 trong Serial Monitor\n6. Cáp chỉ sạc (không data) → đổi cáp USB có data",
    },
  ],
  fallback: "Mình có thể hỗ trợ về:\n⚡ Arduino C++ & ESP32 firmware\n📺 OLED display (SSD1306/SH1106)\n💧 Cảm biến độ ẩm đất\n💡 WS2812B RGB LED\n⏰ RTC DS3231 & night mode\n☁️ Firebase Firestore sync\n🔧 Debug & upload errors\n\nBạn đang gặp vấn đề gì? 🔧",
};
