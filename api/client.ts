import axios from 'axios';

// CỰC KỲ QUAN TRỌNG: ĐỊA CHỈ IP
// Khi dùng Expo Go trên điện thoại thật, bạn không thể dùng 'localhost' hay '10.0.2.2'.
// Bạn phải dùng địa chỉ IP của máy tính trong cùng mạng WiFi.
// 1. Mở Command Prompt (Windows) hoặc Terminal (macOS).
// 2. Windows: gõ `ipconfig` | macOS/Linux: gõ `ifconfig`
// 3. Tìm địa chỉ IPv4 của bạn (ví dụ: 192.168.1.10).
const API_URL = 'http://192.168.1.133:5000/api/v1'; // <-- THAY BẰNG IP CỦA BẠN

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;