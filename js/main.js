// Doi sang dinh dang tien VND
function vnd(price) {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Close popup
const body = document.querySelector("body");
let modalContainer = document.querySelectorAll(".modal");
let modalBox = document.querySelectorAll(".mdl-cnt");
let formLogSign = document.querySelector(".forms");

// Click vùng ngoài sẽ tắt Popup
modalContainer.forEach((item) => {
  item.addEventListener("click", closeModal);
});

modalBox.forEach((item) => {
  item.addEventListener("click", function (event) {
    event.stopPropagation();
  });
});

function closeModal() {
  modalContainer.forEach((item) => {
    item.classList.remove("open");
  });
  console.log(modalContainer);
  body.style.overflow = "auto";
}

function increasingNumber(e) {
  let qty = e.parentNode.querySelector(".input-qty");
  if (parseInt(qty.value) < qty.max) {
    qty.value = parseInt(qty.value) + 1;
  } else {
    qty.value = qty.max;
  }
}

function decreasingNumber(e) {
  let qty = e.parentNode.querySelector(".input-qty");
  if (qty.value > qty.min) {
    qty.value = parseInt(qty.value) - 1;
  } else {
    qty.value = qty.min;
  }
}

//Xem chi tiet san pham
function detailProduct(index) {
  let modal = document.querySelector(".modal.product-detail");
  let products = JSON.parse(localStorage.getItem("products"));
  event.preventDefault();
  let infoProduct = products.find((sp) => {
    return sp.id === index;
  });
  let modalHtml = `<div align="center" class="modal-header">
    <img class="product-image" src="${infoProduct.img}" alt="" >
    </div>
    <div class="modal-body">
        <h2 class="product-title">${infoProduct.title}</h2>
        <div class="product-control">
            <div class="priceBox">
                <span class="current-price">${vnd(infoProduct.price)}</span>
            </div>
            <div class="buttons_added">
                <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                <input class="input-qty" max="100" min="1" name="" type="number" value="1">
                <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
            </div>
        </div>
        <p class="product-description">${infoProduct.desc}</p>
    </div>
    <div class="notebox">
            <p class="notebox-title">Ghi chú</p>
            <textarea class="text-note" id="popup-detail-note" placeholder="Nhập thông tin cần lưu ý..."></textarea>
    </div>
    <div class="modal-footer">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(infoProduct.price)}</span>
        </div>
        <div class="modal-footer-control">
            <button class="button-dathangngay" data-product="${
              infoProduct.id
            }">Đặt hàng ngay</button>
            <button class="button-dat" id="add-cart" onclick="animationCart()"><i class="fa-light fa-basket-shopping"></i></button>
        </div>
    </div>`;
  document.querySelector("#product-detail-content").innerHTML = modalHtml;
  modal.classList.add("open");
  body.style.overflow = "hidden";
  //Cap nhat gia tien khi tang so luong san pham
  let tgbtn = document.querySelectorAll(".is-form");
  let qty = document.querySelector(".product-control .input-qty");
  let priceText = document.querySelector(".price");
  tgbtn.forEach((element) => {
    element.addEventListener("click", () => {
      let price = infoProduct.price * parseInt(qty.value);
      priceText.innerHTML = vnd(price);
    });
  });
  // Them san pham vao gio hang
  let productbtn = document.querySelector(".button-dat");
  productbtn.addEventListener("click", (e) => {
    if (localStorage.getItem("currentuser")) {
      addCart(infoProduct.id);
    } else {
      toast({
        title: "Warning",
        message: "Chưa đăng nhập tài khoản !",
        type: "warning",
        duration: 3000,
      });
    }
  });
  // Mua ngay san pham
  dathangngay();
}

function animationCart() {
  document.querySelector(".count-product-cart").style.animation =
    "slidein ease 1s";
  setTimeout(() => {
    document.querySelector(".count-product-cart").style.animation = "none";
  }, 1000);
}

// Them SP vao gio hang
function addCart(index) {
  let currentuser = localStorage.getItem("currentuser")
    ? JSON.parse(localStorage.getItem("currentuser"))
    : [];
  let soluong = document.querySelector(".input-qty").value;
  let popupDetailNote = document.querySelector("#popup-detail-note").value;
  let note = popupDetailNote == "" ? "Không có ghi chú" : popupDetailNote;
  let productcart = {
    id: index,
    soluong: parseInt(soluong),
    note: note,
  };
  let vitri = currentuser.cart.findIndex((item) => item.id == productcart.id);
  if (vitri == -1) {
    currentuser.cart.push(productcart);
  } else {
    currentuser.cart[vitri].soluong =
      parseInt(currentuser.cart[vitri].soluong) + parseInt(productcart.soluong);
  }

  localStorage.setItem("currentuser", JSON.stringify(currentuser));
  updateAmount();
  closeModal();
  // toast({ title: 'Success', message: 'Thêm thành công sản phẩm vào giỏ hàng', type: 'success', duration: 3000 });
}

//Show gio hang
function showCart() {
  if (localStorage.getItem("currentuser") != null) {
    let currentuser = JSON.parse(localStorage.getItem("currentuser"));
    if (currentuser.cart.length != 0) {
      document.querySelector(".gio-hang-trong").style.display = "none";
      document.querySelector("button.thanh-toan").classList.remove("disabled");
      let productcarthtml = "";
      currentuser.cart.forEach((item) => {
        let product = getProduct(item);
        productcarthtml += `<li class="cart-item" data-id="${product.id}">
                <div class="cart-item-info">
                    <p class="cart-item-title">
                        ${product.title}
                    </p>
                    <span class="cart-item-price price" data-price="${
                      product.price
                    }">
                    ${vnd(parseInt(product.price))}
                    </span>
                </div>
                <p class="product-note"><i class="fa-light fa-pencil"></i><span>${
                  product.note
                }</span></p>
                <div class="cart-item-control">
                    <button class="cart-item-delete" onclick="deleteCartItem(${
                      product.id
                    },this)">Xóa</button>
                    <div class="buttons_added">
                        <input class="minus is-form" type="button" value="-" onclick="decreasingNumber(this)">
                        <input class="input-qty" max="100" min="1" name="" type="number" value="${
                          product.soluong
                        }">
                        <input class="plus is-form" type="button" value="+" onclick="increasingNumber(this)">
                    </div>
                </div>
            </li>`;
      });
      document.querySelector(".cart-list").innerHTML = productcarthtml;
      updateCartTotal();
      saveAmountCart();
    } else {
      document.querySelector(".gio-hang-trong").style.display = "flex";
    }
  }
  let modalCart = document.querySelector(".modal-cart");
  let containerCart = document.querySelector(".cart-container");
  let themsach = document.querySelector(".them-sach");
  modalCart.onclick = function () {
    closeCart();
  };
  themsach.onclick = function () {
    closeCart();
  };
  containerCart.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Delete cart item
function deleteCartItem(id, el) {
  let cartParent = el.parentNode.parentNode;
  cartParent.remove();
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let vitri = currentUser.cart.findIndex((item) => (item.id = id));
  currentUser.cart.splice(vitri, 1);

  // Nếu trống thì hiển thị giỏ hàng trống
  if (currentUser.cart.length == 0) {
    document.querySelector(".gio-hang-trong").style.display = "flex";
    document.querySelector("button.thanh-toan").classList.add("disabled");
  }
  localStorage.setItem("currentuser", JSON.stringify(currentUser));
  updateCartTotal();
}

//Update cart total
function updateCartTotal() {
  document.querySelector(".text-price").innerText = vnd(getCartTotal());
}

// Lay tong tien don hang
function getCartTotal() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let tongtien = 0;
  if (currentUser != null) {
    currentUser.cart.forEach((item) => {
      let product = getProduct(item);
      tongtien += parseInt(product.soluong) * parseInt(product.price);
    });
  }
  return tongtien;
}

// Get Product
function getProduct(item) {
  let products = JSON.parse(localStorage.getItem("products"));
  let infoProductCart = products.find((sp) => item.id == sp.id);
  let product = {
    ...infoProductCart,
    ...item,
  };
  return product;
}

window.onload = updateAmount();
window.onload = updateCartTotal();

// Lay so luong hang

function getAmountCart() {
  let currentuser = JSON.parse(localStorage.getItem("currentuser"));
  let amount = 0;
  currentuser.cart.forEach((element) => {
    amount += parseInt(element.soluong);
  });
  return amount;
}

//Update Amount Cart
function updateAmount() {
  if (localStorage.getItem("currentuser") != null) {
    let amount = getAmountCart();
    document.querySelector(".count-product-cart").innerText = amount;
  }
}

// Save Cart Info
function saveAmountCart() {
  let cartAmountbtn = document.querySelectorAll(".cart-item-control .is-form");
  let listProduct = document.querySelectorAll(".cart-item");
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  cartAmountbtn.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      let id = listProduct[parseInt(index / 2)].getAttribute("data-id");
      let productId = currentUser.cart.find((item) => {
        return item.id == id;
      });
      productId.soluong = parseInt(
        listProduct[parseInt(index / 2)].querySelector(".input-qty").value
      );
      localStorage.setItem("currentuser", JSON.stringify(currentUser));
      updateCartTotal();
    });
  });
}

// Open & Close Cart
function openCart() {
  showCart();
  document.querySelector(".modal-cart").classList.add("open");
  body.style.overflow = "hidden";
}

function closeCart() {
  document.querySelector(".modal-cart").classList.remove("open");
  body.style.overflow = "auto";
  updateAmount();
}

// Open Search Advanced
document.querySelector(".filter-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".advanced-search").classList.toggle("open");
  document.getElementById("home-service").scrollIntoView();
});

document.querySelector(".form-search-input").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("home-service").scrollIntoView();
});

function closeSearchAdvanced() {
  document.querySelector(".advanced-search").classList.toggle("open");
}

//Open Search Mobile
function openSearchMb() {
  document.querySelector(".header-middle-left").style.display = "none";
  document.querySelector(".header-middle-center").style.display = "block";
  document.querySelector(".header-middle-right-item.close").style.display =
    "block";
  let liItem = document.querySelectorAll(".header-middle-right-item.open");
  for (let i = 0; i < liItem.length; i++) {
    liItem[i].style.setProperty("display", "none", "important");
  }
}

//Close Search Mobile
function closeSearchMb() {
  document.querySelector(".header-middle-left").style.display = "block";
  document.querySelector(".header-middle-center").style.display = "none";
  document.querySelector(".header-middle-right-item.close").style.display =
    "none";
  let liItem = document.querySelectorAll(".header-middle-right-item.open");
  for (let i = 0; i < liItem.length; i++) {
    liItem[i].style.setProperty("display", "block", "important");
  }
}

//Signup && Login Form

// Chuyen doi qua lai SignUp & Login
let signup = document.querySelector(".signup-link");
let login = document.querySelector(".login-link");
let container = document.querySelector(".signup-login .modal-container");
login.addEventListener("click", () => {
  container.classList.add("active");
});

signup.addEventListener("click", () => {
  container.classList.remove("active");
});

let signupbtn = document.getElementById("signup");
let loginbtn = document.getElementById("login");
let formsg = document.querySelector(".modal.signup-login");
signupbtn.addEventListener("click", () => {
  formsg.classList.add("open");
  container.classList.remove("active");
  body.style.overflow = "hidden";
});

loginbtn.addEventListener("click", () => {
  document.querySelector(".form-message-check-login").innerHTML = "";
  formsg.classList.add("open");
  container.classList.add("active");
  body.style.overflow = "hidden";
});

// Dang nhap & Dang ky

// Chức năng đăng ký
let signupButton = document.getElementById("signup-button");
let loginButton = document.getElementById("login-button");
signupButton.addEventListener("click", () => {
  event.preventDefault();
  let fullNameUser = document.getElementById("fullname").value;
  let phoneUser = document.getElementById("phone").value;
  let passwordUser = document.getElementById("password").value;
  let passwordConfirmation = document.getElementById(
    "password_confirmation"
  ).value;
  let email_confirmation = document.getElementById("email_confirmation").value;

  let checkSignup = document.getElementById("checkbox-signup").checked;
  // Check validate
  if (fullNameUser.length == 0) {
    document.querySelector(".form-message-name").innerHTML =
      "Vui lòng nhập họ vâ tên";
    document.getElementById("fullname").focus();
  } else if (fullNameUser.length < 3) {
    document.getElementById("fullname").value = "";
    document.querySelector(".form-message-name").innerHTML =
      "Vui lòng nhập họ và tên lớn hơn 3 kí tự";
  } else {
    document.querySelector(".form-message-name").innerHTML = "";
  }
  if (phoneUser.length == 0) {
    document.querySelector(".form-message-phone").innerHTML =
      "Vui lòng nhập vào số điện thoại";
  } else if (phoneUser.length != 10) {
    document.querySelector(".form-message-phone").innerHTML =
      "Vui lòng nhập vào số điện thoại 10 số";
    document.getElementById("phone").value = "";
  } else {
    document.querySelector(".form-message-phone").innerHTML = "";
  }
  if (passwordUser.length == 0) {
    document.querySelector(".form-message-password").innerHTML =
      "Vui lòng nhập mật khẩu";
  } else if (passwordUser.length < 6) {
    document.querySelector(".form-message-password").innerHTML =
      "Vui lòng nhập mật khẩu lớn hơn 6 kí tự";
    document.getElementById("password").value = "";
  } else {
    document.querySelector(".form-message-password").innerHTML = "";
  }
  if (passwordConfirmation.length == 0) {
    document.querySelector(".form-message-password-confi").innerHTML =
      "Vui lòng nhập lại mật khẩu";
  } else if (passwordConfirmation !== passwordUser) {
    document.querySelector(".form-message-password-confi").innerHTML =
      "Mật khẩu không khớp";
    document.getElementById("password_confirmation").value = "";
  } else {
    document.querySelector(".form-message-password-confi").innerHTML = "";
  }
  if (checkSignup != true) {
    document.querySelector(".form-message-checkbox").innerHTML =
      "Vui lòng check đăng ký";
  } else {
    document.querySelector(".form-message-checkbox").innerHTML = "";
  }

  if (
    fullNameUser &&
    phoneUser &&
    passwordUser &&
    passwordConfirmation &&
    checkSignup
  ) {
    if (passwordConfirmation == passwordUser) {
      let user = {
        fullname: fullNameUser,
        phone: phoneUser,
        password: passwordUser,
        address: "",
        email: email_confirmation,
        status: 1,
        join: new Date(),
        cart: [],
        userType: 0,
      };
      let accounts = localStorage.getItem("accounts")
        ? JSON.parse(localStorage.getItem("accounts"))
        : [];
      let checkloop = accounts.some((account) => {
        return account.phone == user.phone;
      });
      if (!checkloop) {
        accounts.push(user);
        localStorage.setItem("accounts", JSON.stringify(accounts));
        localStorage.setItem("currentuser", JSON.stringify(user));
        fetch("register_user.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        toast({
          title: "Thành công",
          message: "Tạo thành công tài khoản !",
          type: "success",
          duration: 2000,
        });
        closeModal();
        kiemtradangnhap();
        updateAmount();
        setTimeout((e) => {
          window.location = "http://localhost/websach/";
        }, 2000);
      } else {
        toast({
          title: "Thất bại",
          message: "Tài khoản đã tồn tại !",
          type: "error",
          duration: 3000,
        });
      }
    } else {
      toast({
        title: "Thất bại",
        message: "Sai mật khẩu !",
        type: "error",
        duration: 3000,
      });
    }
  }
});

// Dang nhap
loginButton.addEventListener("click", () => {
  event.preventDefault();
  let phonelog = document.getElementById("phone-login").value;
  let passlog = document.getElementById("password-login").value;
  let accounts = JSON.parse(localStorage.getItem("accounts"));

  if (phonelog.length == 0) {
    document.querySelector(".form-message.phonelog").innerHTML =
      "Vui lòng nhập vào số điện thoại";
  } else if (phonelog.length != 10) {
    document.querySelector(".form-message.phonelog").innerHTML =
      "Vui lòng nhập vào số điện thoại 10 số";
    document.getElementById("phone-login").value = "";
  } else {
    document.querySelector(".form-message.phonelog").innerHTML = "";
  }

  if (passlog.length == 0) {
    document.querySelector(".form-message-check-login").innerHTML =
      "Vui lòng nhập mật khẩu";
  } else if (passlog.length < 6) {
    document.querySelector(".form-message-check-login").innerHTML =
      "Vui lòng nhập mật khẩu lớn hơn 6 kí tự";
    document.getElementById("passwordlogin").value = "";
  } else {
    document.querySelector(".form-message-check-login").innerHTML = "";
  }

  if (phonelog && passlog) {
    let vitri = accounts.findIndex((item) => item.phone == phonelog);
    if (vitri == -1) {
      toast({
        title: "Error",
        message: "Tài khoản của bạn không tồn tại",
        type: "error",
        duration: 3000,
      });
    } else if (accounts[vitri].password == passlog) {
      if (accounts[vitri].status == 0) {
        toast({
          title: "Warning",
          message: "Tài khoản của bạn đã bị khóa",
          type: "warning",
          duration: 3000,
        });
      } else {
        localStorage.setItem("currentuser", JSON.stringify(accounts[vitri]));
        toast({
          title: "Success",
          message: "Đăng nhập thành công",
          type: "success",
          duration: 2000,
        });
        closeModal();
        kiemtradangnhap();
        checkAdmin();
        updateAmount();
        setTimeout((e) => {
          window.location = "http://localhost/websach/";
        }, 2000);
      }
    } else {
      toast({
        title: "Warning",
        message: "Sai mật khẩu",
        type: "warning",
        duration: 3000,
      });
    }
  }
});

// Kiểm tra xem có tài khoản đăng nhập không ?
function kiemtradangnhap() {
  let currentUser = localStorage.getItem("currentuser");
  if (currentUser != null) {
    let user = JSON.parse(currentUser);
    document.querySelector(
      ".auth-container"
    ).innerHTML = `<span class="text-dndk">Tài khoản</span>
            <span class="text-tk">${user.fullname} <i class="fa-sharp fa-solid fa-caret-down"></span>`;
    document.querySelector(
      ".header-middle-right-menu"
    ).innerHTML = `<li><a href="javascript:;" onclick="myAccount()"><i class="fa-light fa-circle-user"></i> Tài khoản của tôi</a></li>
            <li><a href="javascript:;" onclick="orderHistory()"><i class="fa-regular fa-bags-shopping"></i> Đơn hàng đã mua</a></li>
            <li class="border"><a id="logout" href="javascript:;"><i class="fa-light fa-right-from-bracket"></i class="updateCart1"> Thoát tài khoản</a></li>`;
    document.querySelector("#logout").addEventListener("click", logOut);
  }
}

function logOut() {
  let accounts = JSON.parse(localStorage.getItem("accounts"));
  let user = JSON.parse(localStorage.getItem("currentuser"));
  let vitri = accounts.findIndex((item) => item.phone == user.phone);

  // Cập nhật giỏ hàng trong accounts localStorage
  accounts[vitri].cart.length = 0;
  for (let i = 0; i < user.cart.length; i++) {
    accounts[vitri].cart[i] = user.cart[i];
  }

  // Gửi giỏ hàng cập nhật lên server
  fetch("updateCart.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: user.phone,
      cart: user.cart,
    }),
  });

  localStorage.setItem("accounts", JSON.stringify(accounts));
  // Xóa currentuser khỏi localStorage và chuyển hướng
  localStorage.removeItem("currentuser");
  window.location = "./index.php";
}

function checkAdmin() {
  let user = JSON.parse(localStorage.getItem("currentuser"));
  if (user && user.userType == 1) {
    let node = document.createElement(`li`);
    node.innerHTML = `<a href="./admin.php"><i class="fa-light fa-gear"></i> Quản lý cửa hàng</a>`;
    document.querySelector(".header-middle-right-menu").prepend(node);
  }
}

window.onload = kiemtradangnhap();
window.onload = checkAdmin();

// Chuyển đổi trang chủ và trang thông tin tài khoản
function myAccount() {
  document.getElementById("gioithieu").style.display = "none";
  document.getElementById("tracuu").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.remove("open");
  document.getElementById("account-user").classList.add("open");
  userInfo();
}

// Chuyển đổi trang chủ và trang xem lịch sử đặt hàng
function orderHistory() {
  document.getElementById("gioithieu").style.display = "none";
  document.getElementById("tracuu").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("order-history").classList.add("open");
  //renderOrderProduct();
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function userInfo() {
  let user = JSON.parse(localStorage.getItem("currentuser"));
  document.getElementById("infoname").value = user.fullname;
  document.getElementById("infophone").value = user.phone;
  document.getElementById("infoemail").value = user.email;
  document.getElementById("infoaddress").value = user.address;
  if (user.email == undefined) {
    infoemail.value = "";
  }
  if (user.address == undefined) {
    infoaddress.value = "";
  }
}

// Thay doi thong tin
function changeInformation() {
  let accounts = JSON.parse(localStorage.getItem("accounts"));
  let user = JSON.parse(localStorage.getItem("currentuser"));
  let infoname = document.getElementById("infoname");
  let infoemail = document.getElementById("infoemail");
  let infoaddress = document.getElementById("infoaddress");

  user.fullname = infoname.value;
  if (infoemail.value.length > 0) {
    if (!emailIsValid(infoemail.value)) {
      document.querySelector(".inforemail-error").innerHTML =
        "Vui lòng nhập lại email!";
      infoemail.value = "";
    } else {
      user.email = infoemail.value;
      document.querySelector(".inforemail-error").innerHTML = ""; // Xóa lỗi nếu email hợp lệ
    }
  }

  if (infoaddress.value.length > 0) {
    user.address = infoaddress.value;
  }

  let vitri = accounts.findIndex((item) => item.phone == user.phone);
  accounts[vitri].fullname = user.fullname;
  accounts[vitri].email = user.email;
  accounts[vitri].address = user.address;

  // Lưu thông tin vào localStorage
  localStorage.setItem("currentuser", JSON.stringify(user));
  localStorage.setItem("accounts", JSON.stringify(accounts));

  // Gửi yêu cầu AJAX tới PHP để cập nhật thông tin trong cơ sở dữ liệu
  fetch("update_user_info.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: user.phone,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        toast({
          title: "Success",
          message: "Cập nhật thông tin thành công!",
          type: "success",
          duration: 3000,
        });
      } else {
        toast({
          title: "Thất bại",
          message: "Đã xảy ra lỗi khi cập nhật thông tin!",
          type: "error",
          duration: 3000,
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      toast({
        title: "Thất bại",
        message: "Đã xảy ra lỗi, vui lòng thử lại sau!",
        type: "error",
        duration: 3000,
      });
    });

  kiemtradangnhap();
}

function changePassword() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let passwordCur = document.getElementById("password-cur-info");
  let passwordAfter = document.getElementById("password-after-info");
  let passwordConfirm = document.getElementById("password-comfirm-info");
  let check = true;

  // Kiểm tra các trường thông tin
  if (passwordCur.value.length == 0) {
    document.querySelector(".password-cur-info-error").innerHTML =
      "Vui lòng nhập mật khẩu hiện tại";
    check = false;
  } else {
    document.querySelector(".password-cur-info-error").innerHTML = "";
  }

  if (passwordAfter.value.length == 0) {
    document.querySelector(".password-after-info-error").innerHTML =
      "Vui lòng nhập mật khẩu mới";
    check = false;
  } else {
    document.querySelector(".password-after-info-error").innerHTML = "";
  }

  if (passwordConfirm.value.length == 0) {
    document.querySelector(".password-after-comfirm-error").innerHTML =
      "Vui lòng nhập mật khẩu xác nhận";
    check = false;
  } else {
    document.querySelector(".password-after-comfirm-error").innerHTML = "";
  }

  // Thực hiện thay đổi mật khẩu nếu tất cả kiểm tra đều đúng
  if (check == true) {
    if (passwordCur.value == currentUser.password) {
      if (passwordAfter.value.length >= 6) {
        if (passwordConfirm.value == passwordAfter.value) {
          currentUser.password = passwordAfter.value;
          localStorage.setItem("currentuser", JSON.stringify(currentUser));

          let accounts = JSON.parse(localStorage.getItem("accounts"));
          let accountChange = accounts.find(
            (acc) => acc.phone === currentUser.phone
          );
          accountChange.password = currentUser.password;
          localStorage.setItem("accounts", JSON.stringify(accounts));

          // Gửi yêu cầu AJAX tới PHP để cập nhật mật khẩu trong database
          fetch("update_password.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: currentUser.phone,
              password: currentUser.password,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                toast({
                  title: "Success",
                  message: "Đổi mật khẩu thành công!",
                  type: "success",
                  duration: 3000,
                });
              } else {
                toast({
                  title: "Thất bại",
                  message: "Đã xảy ra lỗi khi đổi mật khẩu!",
                  type: "error",
                  duration: 3000,
                });
              }
            })
            .catch((error) => {
              //console.error('Error:', error);
              toast({
                title: "Thất bại",
                message: "Đã xảy ra lỗi, vui lòng thử lại sau!",
                type: "error",
                duration: 3000,
              });
            });
        } else {
          document.querySelector(".password-after-comfirm-error").innerHTML =
            "Mật khẩu bạn nhập không trùng khớp";
        }
      } else {
        document.querySelector(".password-after-info-error").innerHTML =
          "Vui lòng nhập mật khẩu mới có số kí tự lớn hơn hoặc bằng 6";
      }
    } else {
      document.querySelector(".password-cur-info-error").innerHTML =
        "Bạn đã nhập sai mật khẩu hiện tại";
    }
  }
}

function getProductInfo(id) {
  let products = JSON.parse(localStorage.getItem("products"));
  return products.find((item) => {
    return item.id == id;
  });
}

// Quan ly don hang
function renderOrderProduct() {
  let currentUser = JSON.parse(localStorage.getItem("currentuser"));
  let order = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : [];
  let orderHtml = "";
  let arrDonHang = [];
  for (let i = 0; i < order.length; i++) {
    if (order[i].khachhang === currentUser.phone) {
      arrDonHang.push(order[i]);
    }
  }
  if (arrDonHang.length == 0) {
    orderHtml = `<div class="empty-order-section"><img src="./assets/img/empty-order.jpg" alt="" class="empty-order-img"><p>Chưa có đơn hàng nào</p></div>`;
  } else {
    arrDonHang.forEach((item) => {
      let productHtml = `<div class="order-history-group">`;
      let chiTietDon = getOrderDetails(item.id);
      chiTietDon.forEach((sp) => {
        let infosp = getProductInfo(sp.id);
        productHtml += `<div class="order-history">
                    <div class="order-history-left">
                        <img src="${infosp.img}" alt="">
                        <div class="order-history-info">
                            <h4>${infosp.title}!</h4>
                            <p class="order-history-note"><i class="fa-light fa-pen"></i> ${
                              sp.note
                            }</p>
                            <p class="order-history-quantity">x${sp.soluong}</p>
                        </div>
                    </div>
                    <div class="order-history-right">
                        <div class="order-history-price">
                            <span class="order-history-current-price">${vnd(
                              sp.price
                            )}</span>
                        </div>                         
                    </div>
                </div>`;
      });
      let textCompl = item.trangthai == 1 ? "Đã xử lý" : "Đang xử lý";
      let classCompl = item.trangthai == 1 ? "complete" : "no-complete";
      productHtml += `<div class="order-history-control">
                <div class="order-history-status">
                    <span class="order-history-status-sp ${classCompl}">${textCompl}</span>
                    <button id="order-history-detail" onclick="detailOrder('${
                      item.id
                    }')"><i class="fa-regular fa-eye"></i> Xem chi tiết</button>
                </div>
                <div class="order-history-total">
                    <span class="order-history-total-desc">Tổng tiền: </span>
                    <span class="order-history-toltal-price">${vnd(
                      item.tongtien
                    )}</span>
                </div>
            </div>`;
      productHtml += `</div>`;
      orderHtml += productHtml;
    });
  }
  document.querySelector(".order-history-section").innerHTML = orderHtml;
}

// Get Order Details
function getOrderDetails(madon) {
  let orderDetails = localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [];
  let ctDon = [];
  orderDetails.forEach((item) => {
    if (item.madon == madon) {
      ctDon.push(item);
    }
  });
  return ctDon;
}

// Format Date
function formatDate(date) {
  let fm = new Date(date);
  let yyyy = fm.getFullYear();
  let mm = fm.getMonth() + 1;
  let dd = fm.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return dd + "/" + mm + "/" + yyyy;
}

// Xem chi tiet don hang
// function detailOrder(id) {
//     let order = JSON.parse(localStorage.getItem("order"));
//     let detail = order.find(item => {
//         return item.id == id;
//     })
//     document.querySelector(".modal.detail-order").classList.add("open");
//     let detailOrderHtml = `<ul class="detail-order-group">
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-light fa-calendar-days"></i> Ngày đặt hàng</span>
//             <span class="detail-order-item-right">${formatDate(detail.thoigiandat)}</span>
//         </li>
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-light fa-truck"></i> Hình thức giao</span>
//             <span class="detail-order-item-right">${detail.hinhthucgiao}</span>
//         </li>
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-light fa-clock"></i> Ngày nhận hàng</span>
//             <span class="detail-order-item-right">${(detail.thoigiangiao == "" ? "" : (detail.thoigiangiao + " - ")) + formatDate(detail.ngaygiaohang)}</span>
//         </li>
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-light fa-location-dot"></i> Địa điểm nhận</span>
//             <span class="detail-order-item-right">${detail.diachinhan}</span>
//         </li>
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-thin fa-person"></i> Người nhận</span>
//             <span class="detail-order-item-right">${detail.tenguoinhan}</span>
//         </li>
//         <li class="detail-order-item">
//             <span class="detail-order-item-left"><i class="fa-light fa-phone"></i> Số điện thoại nhận</span>
//             <span class="detail-order-item-right">${detail.sdtnhan}</span>
//         </li>
//     </ul>`
//     document.querySelector(".detail-order-content").innerHTML = detailOrderHtml;
// }

// Create id order
function createId(arr) {
  let id = arr.length + 1;
  let check = arr.find((item) => item.id == "DH" + id);
  while (check != null) {
    id++;
    check = arr.find((item) => item.id == "DH" + id);
  }
  return "DH" + id;
}

// Back to top
window.onscroll = () => {
  let backtopTop = document.querySelector(".back-to-top");
  if (document.documentElement.scrollTop > 100) {
    backtopTop.classList.add("active");
  } else {
    backtopTop.classList.remove("active");
  }
};

// Auto hide header on scroll
const headerNav = document.querySelector(".header-bottom");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (lastScrollY < window.scrollY) {
    headerNav.classList.add("hide");
  } else {
    headerNav.classList.remove("hide");
  }
  lastScrollY = window.scrollY;
});

// Page
function renderProducts(showProduct) {
  let productHtml = "";
  if (showProduct.length == 0) {
    document.getElementById("home-title").style.display = "none";
    productHtml = `<div class="no-result"><div class="no-result-h">Tìm kiếm không có kết quả</div><div class="no-result-p">Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn</div><div class="no-result-i"><i class="fa-light fa-face-sad-cry"></i></div></div>`;
  } else {
    document.getElementById("home-title").style.display = "block";
    showProduct.forEach((product) => {
      productHtml += `<div class="col-product">
            <article class="card-product" >
                <div align="center" class="card-header">
                    <a href="#" class="card-image-link" onclick="detailProduct(${
                      product.id
                    })">
                    <img  class="card-image" src="${product.img}" alt="${
        product.title
      }">
                    </a>
                </div>
                <div class="book-info">
                    <div class="card-content">
                        <div class="card-title">
                            <a href="#" class="card-title-link" onclick="detailProduct(${
                              product.id
                            })">${product.title}</a>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="product-price">
                            <span class="current-price">${vnd(
                              product.price
                            )}</span>
                        </div>
                    <div class="product-buy">
                        <button onclick="detailProduct(${
                          product.id
                        })" class="card-button order-item"><i class="fa-regular fa-cart-shopping-fast"></i> Đặt sách</button>
                    </div> 
                </div>
                </div>
            </article>
        </div>`;
    });
  }
  document.getElementById("home-products").innerHTML = productHtml;
}

// Find Product
var productAll = JSON.parse(localStorage.getItem("products")).filter(
  (item) => item.status == 1
);
function searchProducts(mode) {
  let valeSearchInput = document.querySelector(".form-search-input").value;
  let valueCategory = document.getElementById(
    "advanced-search-category-select"
  ).value;
  let minPrice = document.getElementById("min-price").value;
  let maxPrice = document.getElementById("max-price").value;
  if (
    parseInt(minPrice) > parseInt(maxPrice) &&
    minPrice != "" &&
    maxPrice != ""
  ) {
    alert("Giá đã nhập sai !");
  }

  let result =
    valueCategory == "Tất cả"
      ? productAll
      : productAll.filter((item) => {
          return item.category == valueCategory;
        });

  result =
    valeSearchInput == ""
      ? result
      : result.filter((item) => {
          return item.title
            .toString()
            .toUpperCase()
            .includes(valeSearchInput.toString().toUpperCase());
        });

  if (minPrice == "" && maxPrice != "") {
    result = result.filter((item) => item.price <= maxPrice);
  } else if (minPrice != "" && maxPrice == "") {
    result = result.filter((item) => item.price >= minPrice);
  } else if (minPrice != "" && maxPrice != "") {
    result = result.filter(
      (item) => item.price <= maxPrice && item.price >= minPrice
    );
  }

  document.getElementById("home-service").scrollIntoView();
  switch (mode) {
    case 0:
      result = JSON.parse(localStorage.getItem("products"));
      document.querySelector(".form-search-input").value = "";
      document.getElementById("advanced-search-category-select").value =
        "Tất cả";
      document.getElementById("min-price").value = "";
      document.getElementById("max-price").value = "";
      break;
    case 1:
      result.sort((a, b) => a.price - b.price);
      break;
    case 2:
      result.sort((a, b) => b.price - a.price);
      break;
  }
  showHomeProduct(result);
}

// Phân trang
let perPage = 12;
let currentPage = 1;
let totalPage = 0;
let perProducts = [];

function displayList(productAll, perPage, currentPage) {
  let start = (currentPage - 1) * perPage;
  let end = (currentPage - 1) * perPage + perPage;
  let productShow = productAll.slice(start, end);
  renderProducts(productShow);
}

function showHomeProduct(products) {
  let productAll = products.filter((item) => item.status == 1);
  displayList(productAll, perPage, currentPage);
  setupPagination(productAll, perPage, currentPage);
}

window.onload = showHomeProduct(JSON.parse(localStorage.getItem("products")));

function setupPagination(productAll, perPage) {
  document.querySelector(".page-nav-list").innerHTML = "";
  let page_count = Math.ceil(productAll.length / perPage);
  for (let i = 1; i <= page_count; i++) {
    let li = paginationChange(i, productAll, currentPage);
    document.querySelector(".page-nav-list").appendChild(li);
  }
}

function paginationChange(page, productAll, currentPage) {
  let node = document.createElement(`li`);
  node.classList.add("page-nav-item");
  node.innerHTML = `<a href="javascript:;">${page}</a>`;
  if (currentPage == page) node.classList.add("active");
  node.addEventListener("click", function () {
    currentPage = page;
    displayList(productAll, perPage, currentPage);
    let t = document.querySelectorAll(".page-nav-item.active");
    for (let i = 0; i < t.length; i++) {
      t[i].classList.remove("active");
    }
    node.classList.add("active");
    document.getElementById("home-service").scrollIntoView();
  });
  return node;
}

// Hiển thị chuyên mục
function showCategory(category) {
  document.getElementById("trangchu").classList.remove("hide");
  document.getElementById("gioithieu").style.display = "none";
  document.getElementById("tracuu").style.display = "none";
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("order-history").classList.remove("open");
  // document.body.style.overflow = '';
  let productSearch = productAll.filter((value) => {
    return value.category
      .toString()
      .toUpperCase()
      .includes(category.toUpperCase());
  });
  let currentPageSeach = 1;
  displayList(productSearch, perPage, currentPageSeach);
  setupPagination(productSearch, perPage, currentPageSeach);
  document.getElementById("home-title").scrollIntoView();
}

function showGioiThieu() {
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("home-products").classList.add("hide");
  document.getElementById("home-title").classList.add("hide");
  document.getElementById("gioithieu").style.display = "block";
  document.getElementById("tracuu").style.display = "none";
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("order-history").classList.remove("open");

  // document.body.style.overflow = 'hidden';
}

function showTraCuu() {
  document.getElementById("trangchu").classList.add("hide");
  document.getElementById("home-products").classList.add("hide");
  document.getElementById("home-title").classList.add("hide");
  document.getElementById("gioithieu").style.display = "none";

  document.getElementById("tracuu").style.display = "block";
  document.getElementById("account-user").classList.remove("open");
  document.getElementById("order-history").classList.remove("open");
}

// Hàm hiển thị đơn hàng
function showOrder(arr) {
  let orderHtml = "";
  if (arr.length == 0) {
    orderHtml = `<td colspan="6">Không có dữ liệu</td>`;
  } else {
    arr.forEach((item) => {
      let status =
        item.trangthai == 0
          ? `<span class="status-no-complete">Chưa xử lý</span>`
          : `<span class="status-complete">Đã xử lý</span>`;
      let date = formatDate(item.thoigiandat);
      orderHtml += `
            <tr>
            <td>${item.id}</td>
            <td>${item.tenguoinhan}</td>
            <td>${date}</td>
            <td>${vnd(item.tongtien)}</td>                               
            <td>${status}</td>
            <td class="control">
            <button class="btn-detail" id="" onclick="detailOrder('${
              item.id
            }')"><i class="fa-regular fa-eye"></i> Chi tiết</button>
            </td>
            </tr>      
            `;
    });
  }
  document.getElementById("showOrder").innerHTML = orderHtml;
}

// Hiển thị đơn hàng khi trang tải
//window.onload = () => showOrder(orders);

// Get Order Details
function getOrderDetails(madon) {
  let orderDetails = localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [];
  let ctDon = [];
  orderDetails.forEach((item) => {
    if (item.madon == madon) {
      ctDon.push(item);
    }
  });
  return ctDon;
}

// Show Order Detail
function detailOrder(id) {
  document.querySelector(".modal.detail-order").classList.add("open");
  let orders = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : [];
  let products = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
  // Lấy hóa đơn
  let order = orders.find((item) => item.id == id);
  // Lấy chi tiết hóa đơn
  let ctDon = getOrderDetails(id);
  let spHtml = `<div class="modal-detail-left"><div class="order-item-group">`;

  ctDon.forEach((item) => {
    let detaiSP = products.find((product) => product.id == item.id);
    spHtml += `<div class="order-product">
            <div class="order-product-left">
                <img src="${detaiSP.img}" alt="">
                <div class="order-product-info">
                    <h4>${detaiSP.title}</h4>
                    <p class="order-product-note"><i class="fa-light fa-pen"></i> ${
                      item.note
                    }</p>
                    <p class="order-product-quantity">SL: ${item.soluong}<p>
                </div>
            </div>
            <div class="order-product-right">
                <div class="order-product-price">
                    <span class="order-product-current-price">${vnd(
                      item.price
                    )}</span>
                </div>                         
            </div>
        </div>`;
  });
  spHtml += `</div></div>`;
  spHtml += `<div class="modal-detail-right">
        <ul class="detail-order-group">
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-light fa-calendar-days"></i> Ngày đặt hàng</span>
                <span class="detail-order-item-right">${formatDate(
                  order.thoigiandat
                )}</span>
            </li>
            <li class="detail-order-item">
                <span class="detail-order-item-left"><i class="fa-light fa-truck"></i> Hình thức giao</span>
                <span class="detail-order-item-right">${
                  order.hinhthucgiao
                }</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-thin fa-person"></i> Người nhận</span>
            <span class="detail-order-item-right">${order.tenguoinhan}</span>
            </li>
            <li class="detail-order-item">
            <span class="detail-order-item-left"><i class="fa-light fa-phone"></i> Số điện thoại</span>
            <span class="detail-order-item-right">${order.sdtnhan}</span>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-left"><i class="fa-light fa-clock"></i> Thời gian giao</span>
                <p class="detail-order-item-b">${
                  (order.thoigiangiao == "" ? "" : order.thoigiangiao + " - ") +
                  formatDate(order.ngaygiaohang)
                }</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fa-light fa-location-dot"></i> Địa chỉ nhận</span>
                <p class="detail-order-item-b">${order.diachinhan}</p>
            </li>
            <li class="detail-order-item tb">
                <span class="detail-order-item-t"><i class="fa-light fa-note-sticky"></i> Ghi chú</span>
                <p class="detail-order-item-b">${order.ghichu}</p>
            </li>
        </ul>
    </div>`;
  document.querySelector(".modal-detail-order").innerHTML = spHtml;

  let classDetailBtn = order.trangthai == 0 ? "btn-chuaxuly" : "btn-daxuly";
  let textDetailBtn = order.trangthai == 0 ? "Chưa xử lý" : "Đã xử lý";
  document.querySelector(
    ".modal-detail-bottom"
  ).innerHTML = `<div class="modal-detail-bottom-left">
        <div class="price-total">
            <span class="thanhtien">Thành tiền</span>
            <span class="price">${vnd(order.tongtien)}</span>
        </div>
    </div>
    <div class="modal-detail-bottom-right">
        <button class="modal-detail-btn ${classDetailBtn}" onclick="changeStatus('${
    order.id
  }',this)">${textDetailBtn}</button>
    </div>`;
}

let currentSlide = 0; // Slide hiện tại bắt đầu từ 0
const slides = document.querySelectorAll(".home-slider img"); // Lấy tất cả hình ảnh trong slider

// Hàm hiển thị slide hiện tại
function showSlide(index) {
  // Ẩn tất cả các hình ảnh
  slides.forEach((slide) => {
    slide.classList.remove("active"); // Loại bỏ lớp active của tất cả hình ảnh
  });

  // Hiển thị hình ảnh hiện tại
  slides[index].classList.add("active"); // Thêm lớp active vào hình ảnh hiện tại
}

// Hàm chuyển đổi sang slide tiếp theo
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length; // Tăng chỉ số slide và quay lại đầu nếu vượt quá
  showSlide(currentSlide); // Hiển thị slide mới
}

// Hàm chuyển đổi sang slide trước đó
function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length; // Giảm chỉ số slide và quay lại cuối nếu nhỏ hơn 0
  showSlide(currentSlide); // Hiển thị slide mới
}

// Thiết lập bộ đếm thời gian để chuyển đổi slide tự động
setInterval(nextSlide, 4000); // Chuyển đổi slide sau mỗi 3 giây

// Gọi hàm hiển thị slide đầu tiên
showSlide(currentSlide);

// Thêm sự kiện cho nút Previous
document.querySelector(".prev-slide").addEventListener("click", prevSlide);

// Thêm sự kiện cho nút Next
document.querySelector(".next-slide").addEventListener("click", nextSlide);
