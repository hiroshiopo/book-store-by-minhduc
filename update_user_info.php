<?php
$servername = "localhost"; // Địa chỉ máy chủ MySQL
$username = "root"; // Tên đăng nhập MySQL
$password = ""; // Mật khẩu MySQL
$dbname = "websach"; // Tên cơ sở dữ liệu của bạn

// Kết nối đến cơ sở dữ liệu
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại: " . $conn->connect_error]));
}

// Đọc dữ liệu từ yêu cầu POST
$data = json_decode(file_get_contents('php://input'), true);
$phone = $data['phone'];
$fullname = $data['fullname'];
$email = $data['email'];
$address = $data['address'];

// Cập nhật thông tin người dùng trong cơ sở dữ liệu
$sql = "UPDATE users SET fullname = ?, email = ?, address = ? WHERE phone = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ssss", $fullname, $email, $address, $phone);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật thông tin thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi thực thi câu lệnh: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
}

$conn->close();