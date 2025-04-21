// open & close menu

var menu = document.querySelector('#menu');

function open_menu() {
    menu.classList.add("active")
}
function close_menu() {
    menu.classList.remove("active")
}

document.addEventListener("DOMContentLoaded", () => {
    const order = JSON.parse(localStorage.getItem("lastOrder"));
    if (!order) {
        document.querySelector(".order-confirmation .container").innerHTML = `
            <h1>No Order Found</h1>
            <p>It looks like you haven't placed an order yet.</p>
            <div class="continue-shopping">
                <a href="index.html" class="btn_cart">Start Shopping</a>
            </div>
        `;
        return;
    }

    // عرض بيانات الطلب
    document.getElementById("order-number").textContent = order.orderNumber;
    document.getElementById("order-date").textContent = order.date;
    document.getElementById("delivery-name").textContent = order.delivery.name;
    document.getElementById("delivery-email").textContent = order.delivery.email;
    document.getElementById("delivery-address").textContent = order.delivery.address;
    document.getElementById("delivery-phone").textContent = order.delivery.phone;
    document.getElementById("coupon-code").textContent = order.couponCode;


    // عرض المنتجات
    const orderItems = document.getElementById("order-items");
    order.items.forEach(item => {
        const quantity = item.quantity || 1;
        const itemTotal = item.price * quantity;
        const itemElement = document.createElement("div");
        itemElement.className = "item_cart";
        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="content">
                <h4>${item.name}</h4>
                <p class="price_cart">Price: <span>${itemTotal} EGP</span>${quantity > 1 ? ` (x${quantity})` : ''}</p>
            </div>
        `;
        orderItems.appendChild(itemElement);
    });

    // عرض الإجمالي
    document.getElementById("order-total").textContent = `${order.total} EGP`;
});