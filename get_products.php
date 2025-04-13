<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "websach";

// Kết nối với cơ sở dữ liệu
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Truy vấn dữ liệu từ bảng sản phẩm
$sql = "SELECT id, status, title, img, category, price, describes FROM products";
$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    // Lưu dữ liệu sản phẩm vào mảng
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Trả về dữ liệu dưới dạng JSON
header('Content-Type: application/json');
echo json_encode($products);


$conn->close();