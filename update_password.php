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
$password = $data['password'];

// Kiểm tra giá trị đầu vào
if (empty($phone) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Thiếu thông tin cần thiết!"]);
    exit();
}

// Cập nhật mật khẩu trong cơ sở dữ liệu
$sql = "UPDATE users SET password = ? WHERE phone = ?";
$stmt = $conn->prepare($sql);

if ($stmt) {
    $stmt->bind_param("ss", $password, $phone);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(["success" => true, "message" => "Đổi mật khẩu thành công!"]);
        } else {
            echo json_encode(["success" => false, "message" => "Không có bản ghi nào được cập nhật. Kiểm tra lại số điện thoại."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi thực thi câu lệnh: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi chuẩn bị câu lệnh SQL: " . $conn->error]);
}

$conn->close();