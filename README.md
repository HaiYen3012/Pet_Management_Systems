# 🐾 Pet Management Systems

Hệ thống quản lý thú cưng toàn diện với giao diện web hiện đại và API backend mạnh mẽ.

## 📋 Mục lục
- [Cài đặt cơ sở dữ liệu](#-cài-đặt-cơ-sở-dữ-liệu)
- [Cấu hình dự án](#️-cấu-hình-dự-án)
- [Chạy Frontend](#-chạy-frontend)
- [Chạy Backend](#-chạy-backend)
- [Sử dụng hệ thống](#-sử-dụng-hệ-thống)

---

## 🗄️ Cài đặt cơ sở dữ liệu

### PostgreSQL Setup

1. **Tạo database mới**
   ```sql
   CREATE DATABASE pethome;
   ```

2. **Khởi tạo dữ liệu**
   - Mở file `server/config/init.sql`
   - Chạy script này để tạo các bảng và dữ liệu tài khoản ban đầu

---

## ⚙️ Cấu hình dự án

### Database Configuration

1. **Tạo file environment**
   - Trong thư mục `server`, tạo file `.env`
   - Sao chép cấu trúc từ file `.env.example`

2. **Cập nhật cấu hình database**
   - Mở file `server/config/index.js`
   - Sửa thông tin kết nối PostgreSQL cho phù hợp với hệ thống của bạn

---

## 🎨 Chạy Frontend

1. **Mở terminal mới**
   ```bash
   cd client
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Sửa lỗi (nếu có)**
   - Chạy các lệnh được npm install gợi ý để fix lỗi

4. **Khởi động Frontend**
   ```bash
   npm start
   ```

5. **Truy cập ứng dụng**
   - Sau khi chạy thành công, sử dụng `Ctrl + Click` để mở web trong trình duyệt

---

## 🔧 Chạy Backend

1. **Mở terminal mới** (khác với terminal Frontend)
   ```bash
   cd server
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Sửa lỗi (nếu có)**
   - Chạy các lệnh được npm install gợi ý để fix lỗi

4. **Khởi động Backend**
   ```bash
   npm start
   ```

---

## 🌐 Sử dụng hệ thống

Sau khi cả Frontend và Backend đã được khởi động thành công:

1. Truy cập vào ứng dụng web qua trình duyệt
2. Sử dụng tài khoản được tạo từ script `init.sql` để đăng nhập
3. Bắt đầu quản lý thông tin thú cưng của bạn

---

## 🚀 Lưu ý quan trọng

- **Frontend**: Chạy trên terminal riêng biệt
- **Backend**: Chạy trên terminal riêng biệt  
- **Database**: Đảm bảo PostgreSQL đang chạy trước khi khởi động backend
- **Environment**: Kiểm tra file `.env` và cấu hình database trước khi chạy

---

## 📞 Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc sử dụng, vui lòng kiểm tra:
- Cấu hình database trong `server/config/index.js`
- File `.env` đã được tạo và cấu hình đúng
- PostgreSQL service đang chạy
- Các port không bị xung đột

---

*Happy Pet Managing! 🐕🐱*
