<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "websach";

// Kết nối đến cơ sở dữ liệu
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại!"]));
}

// Đọc dữ liệu từ yêu cầu POST
$data = json_decode(file_get_contents('php://input'), true);
$fullname = $data['fullname'];
$phone = $data['phone'];
$password = $data['password'];
$address = $data['address'];
$email = $data['email'];
$status = $data['status'];
$join_date = $data['join'];
$userType = $data['userType'];

// Thêm tài khoản mới vào cơ sở dữ liệu
$sql = "INSERT INTO users (fullname, phone, password, address, email, status, join_date, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssi", $fullname, $phone, $password, $address, $email, $status, $join_date, $userType);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Tạo tài khoản thành công!"]);
} else {
    echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi thêm tài khoản!"]);
}

$stmt->close();
$conn->close();