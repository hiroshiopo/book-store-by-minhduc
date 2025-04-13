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

// Lấy dữ liệu từ yêu cầu POST
$title = $_POST['title'];
$img = $_POST['img'];
$category = $_POST['category'];
$price = $_POST['price'];
$desc = $_POST['desc'];
$status = $_POST['status'];

// Chuẩn bị câu lệnh SQL để thêm sản phẩm vào cơ sở dữ liệu
$sql = "INSERT INTO products (title, img, category, price, describes, status) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssisi", $title, $img, $category, $price, $desc, $status);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Sản phẩm đã được thêm vào cơ sở dữ liệu thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi thêm sản phẩm vào cơ sở dữ liệu!"]);
}

$stmt->close();
$conn->close();