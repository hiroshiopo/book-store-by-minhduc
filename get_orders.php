<?php
$servername = "localhost"; // Địa chỉ máy chủ MySQL
$username = "root"; // Tên đăng nhập MySQL
$password = ""; // Mật khẩu MySQL
$dbname = "websach"; // Tên cơ sở dữ liệu

// Tạo kết nối đến cơ sở dữ liệu
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại!"]));
}

// Thiết lập UTF-8 cho kết nối
$conn->set_charset("utf8");

// Lấy dữ liệu từ bảng order
$sql = "SELECT * FROM `order`";
$result = $conn->query($sql);

$orders = [];

if ($result->num_rows > 0) {
    // Chuyển đổi từng hàng kết quả thành mảng liên kết
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

// Trả về dữ liệu dưới dạng JSON
echo json_encode($orders);

// Đóng kết nối
$conn->close();