<?php
$servername = "localhost"; // Địa chỉ máy chủ MySQL
$username = "root"; // Tên đăng nhập MySQL
$password = ""; // Mật khẩu MySQL
$dbname = "websach"; // Tên cơ sở dữ liệu của bạn

// Kết nối đến cơ sở dữ liệu
$conn = new mysqli($servername, $username, $password, $dbname);

// Kiểm tra kết nối
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Kết nối cơ sở dữ liệu thất bại!"]));
}

// Đọc dữ liệu từ yêu cầu POST
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];
$action = $data['action']; // 'delete' hoặc 'restore'

// Kiểm tra hành động và cập nhật trạng thái sản phẩm tương ứng
if ($action == 'delete') {
    $status = 0;
} elseif ($action == 'restore') {
    $status = 1;
} else {
    echo json_encode(["success" => false, "message" => "Hành động không hợp lệ!"]);
    exit();
}

// Cập nhật trạng thái sản phẩm trong cơ sở dữ liệu
$sql = "UPDATE products SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => ($action == 'delete' ? "Xóa sản phẩm thành công!" : "Khôi phục sản phẩm thành công!")]);
} else {
    echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi khi cập nhật sản phẩm!"]);
}

$stmt->close();
$conn->close();