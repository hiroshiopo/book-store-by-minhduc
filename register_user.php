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

$fullname = $data['fullname'];
$phone = $data['phone'];
$password = $data['password'];
$address = $data['address'];
$email = $data['email'];
$status = $data['status'];
$join_date = $data['join'];
$userType = $data['userType'];

// Kiểm tra nếu số điện thoại đã tồn tại
$sql_check = "SELECT * FROM users WHERE phone = ?";
$stmt_check = $conn->prepare($sql_check);
$stmt_check->bind_param("s", $phone);
$stmt_check->execute();
$result_check = $stmt_check->get_result();

if ($result_check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Số điện thoại đã được sử dụng!"]);
} else {
    // Mã hóa mật khẩu trước khi lưu
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Thêm người dùng mới vào database
    $sql = "INSERT INTO users (fullname, phone, password, address, email, status, join_date, userType) VALUES ('$fullname', '$phone', '$hashed_password', '$address', ' $email', $status, '$join_date', '$userType')";


    if (mysqli_query($conn, $sql)) {
        echo json_encode(["success" => true, "message" => "Tạo tài khoản thành công!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Đã xảy ra lỗi trong quá trình tạo tài khoản!"]);
    }

    $stmt->close();
}

$conn->close();