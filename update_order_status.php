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
$id = $data['id'];
$trangthai = $data['trangthai'];

// Cập nhật trạng thái đơn hàng trong cơ sở dữ liệu
$sql = "UPDATE `order` SET trangthai = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("is", $trangthai, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật trạng thái đơn hàng thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi thực thi câu lệnh: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
}

$conn->close();