// اختيار طريقة حفظ العربة
let useLocalStorage = true;

// تهيئة العربة
function initializeCart() {
  if (useLocalStorage) {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        window.cart = JSON.parse(storedCart);
        if (!Array.isArray(window.cart)) {
          console.warn("Stored cart is not an array, resetting to empty array.");
          window.cart = [];
        }
      } else {
        window.cart = [];
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      window.cart = [];
      useLocalStorage = false;
    }
  } else {
    window.cart = [];
  }
  console.log("Cart initialized:", window.cart);
}

// استدعاء التهيئة عند تحميل الصفحة
if (!window.cart) {
  initializeCart();
}

// دالة لحفظ العربة
function saveCart() {
  if (useLocalStorage) {
    try {
      localStorage.setItem("cart", JSON.stringify(window.cart));
      console.log("Cart saved to localStorage:", window.cart);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      useLocalStorage = false;
    }
  }
}

// دوال إدارة العربة
function openCart() {
  const cart = document.querySelector('.cart');
  if (cart) cart.classList.add("active");
}

function closeCart() {
  const cart = document.querySelector('.cart');
  if (cart) cart.classList.remove("active");
}

function addToCart(id, element) {
  console.time("addToCart");
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) loadingIndicator.style.display = "block";

  if (typeof products === "undefined") {
    console.error("Error: 'products' is not defined. Make sure products.js is loaded.");
    if (loadingIndicator) loadingIndicator.style.display = "none";
    console.timeEnd("addToCart");
    return;
  }

  let product = products.find(p => p.id === id);
  if (!product && typeof lenovoProducts !== "undefined") {
    product = lenovoProducts.find(p => p.id === id);
  }
  if (!product) {
    console.error("Product with ID", id, "not found.");
    if (loadingIndicator) loadingIndicator.style.display = "none";
    console.timeEnd("addToCart");
    return;
  }

  const existingItem = window.cart.find(item => item.id === id);
  console.log("Adding Product ID:", id, "Existing Item:", existingItem);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    window.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1
    });
    if (element) element.classList.add("active");
  }

  console.log("Updated Cart:", window.cart);

  saveCart();
  updateCart(id);
  if (loadingIndicator) loadingIndicator.style.display = "none";
  console.timeEnd("addToCart");
}

function deleteFromCart(id) {
  console.time("deleteFromCart");
  window.cart = window.cart.filter(item => item.id !== id);
  saveCart();
  updateCart(id);
  console.timeEnd("deleteFromCart");
}

function updateQuantity(id, change) {
  console.time("updateQuantity");
  const item = window.cart.find(item => item.id === id);

  if (item) {
    item.quantity = (item.quantity || 1) + change;
    if (item.quantity <= 0) {
      window.cart = window.cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCart(id);
  }

  console.timeEnd("updateQuantity");
}

function updateCart(updatedId = null) {
  console.time("updateCart");
  const cartItems = document.querySelector(".items_in_cart");
  const countItemCart = document.querySelector(".count_item_cart");
  const price_cart_Head = document.querySelector(".price_cart_Head");
  const price_cart_total = document.querySelector(".price_cart_total");
  const cartCount = document.querySelector(".cart-count");

  if (!cartItems || !countItemCart || !price_cart_Head || !price_cart_total || !cartCount) {
    console.error("Error: One or more cart elements are missing in the HTML.", {
      cartItems: !!cartItems,
      countItemCart: !!countItemCart,
      price_cart_Head: !!price_cart_Head,
      price_cart_total: !!price_cart_total,
      cartCount: !!cartCount
    });
    console.timeEnd("updateCart");
    return;
  }

  const cart = window.cart;

  // تحديث عدد الوحدات
  const totalUnits = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  countItemCart.textContent = `(${totalUnits} Item${totalUnits !== 1 ? "s" : ""} in Cart)`;
  cartCount.textContent = totalUnits;

  // تحديث السعر
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  price_cart_Head.textContent = `${total} EGP`;
  price_cart_total.textContent = `${total} EGP`;

  // عرض المنتجات داخل السلة
  cartItems.innerHTML = "";
  cart.forEach(item => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
    cartItems.innerHTML += `
      <div class="item_cart">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div>
          <h4>${item.name}</h4>
          <p>${item.price} EGP${quantity > 1 ? ` (x${quantity})` : ''}</p>
        </div>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${item.id}, -1)" ${quantity === 1 ? 'disabled' : ''}>−</button>
          <span>${quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="delete_item" onclick="deleteFromCart(${item.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });

  // تحديث أيقونات المنتجات
  if (updatedId !== null) {
    const icon = document.querySelector(`.product .icons i.fa-cart-plus[onclick="addToCart(${updatedId}, this)"]`);
    if (icon) {
      if (cart.some(item => item.id === updatedId)) {
        icon.classList.add("active");
      } else {
        icon.classList.remove("active");
      }
    }
  } else {
    document.querySelectorAll(".product .icons i.fa-cart-plus").forEach(icon => {
      const productId = parseInt(icon.getAttribute("onclick")?.match(/\d+/)?.[0] || 0);
      if (cart.some(item => item.id === productId)) {
        icon.classList.add("active");
      } else {
        icon.classList.remove("active");
      }
    });
  }

  console.timeEnd("updateCart");
}

// دالة لعرض المنتجات في صفحة الدفع
function renderCheckoutItems() {
  const checkoutItems = document.querySelector(".ordersummary .items");
  const checkoutTotal = document.querySelector(".ordersummary .total span");

  if (!checkoutItems || !checkoutTotal) {
    console.error("Error: Checkout elements missing in HTML.", {
      checkoutItems: !!checkoutItems,
      checkoutTotal: !!checkoutTotal
    });
    return;
  }

  const cart = window.cart;
  const itemsContainer = checkoutItems.querySelectorAll(".item_cart");
  const totalContainer = checkoutItems.querySelector(".total");
  const buttonContainer = checkoutItems.querySelector(".button_div");

  checkoutItems.innerHTML = "";
  checkoutItems.appendChild(totalContainer);
  checkoutItems.appendChild(buttonContainer);

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Your cart is empty.";
    checkoutItems.insertBefore(emptyMessage, totalContainer);
    checkoutTotal.textContent = "0 EGP";
    return;
  }

  cart.forEach(item => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
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
    checkoutItems.insertBefore(itemElement, totalContainer);
  });

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  checkoutTotal.textContent = `${total} EGP`;
}

// دالة لمعالجة الطلب عند الضغط على "Place Order"
function placeOrder() {
  const deliveryForm = document.querySelector(".checkout .address .inputs");
  const couponForm = document.querySelector(".checkout .coupon .inputs");

  if (!deliveryForm || !couponForm) {
    console.error("Error: Form elements not found.");
    return;
  }

  // جمع بيانات التوصيل
  const deliveryData = {
    email: deliveryForm.querySelector('input[type="email"]').value,
    name: deliveryForm.querySelector('input[type="text"][placeholder="enter your name"]').value,
    address: deliveryForm.querySelector('input[type="text"][placeholder="enter your address"]').value,
    phone: deliveryForm.querySelector('input[type="number"]').value
  };

  // جمع بيانات كود الخصم
  const couponCode = couponForm.querySelector('input[type="text"]').value;

  // التحقق من إدخال بيانات التوصيل
  if (!deliveryData.email || !deliveryData.name || !deliveryData.address || !deliveryData.phone) {
    alert("Please fill in all delivery details before placing your order.");
    return;
  }

  // جمع بيانات الطلب
  const order = {
    orderNumber: `ORD-${Date.now()}`, // رقم طلب عشوائي (محاكاة)
    delivery: deliveryData,
    couponCode: couponCode || "None",
    items: window.cart,
    total: window.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    date: new Date().toLocaleString()
  };

  // حفظ الطلب في localStorage
  localStorage.setItem("lastOrder", JSON.stringify(order));

  // إفراغ العربة
  window.cart = [];
  saveCart();
  updateCart();
  renderCheckoutItems();

  // توجيه المستخدم لصفحة التأكيد
  window.location.href = "order-confirmation.html";
}

// تحميل البيانات عند فتح الصفحة
document.addEventListener("DOMContentLoaded", () => {
  initializeCart();
  updateCart();
  if (document.querySelector(".ordersummary")) {
    renderCheckoutItems();
    // إضافة حدث لزر "Place Order"
    const placeOrderButton = document.querySelector(".ordersummary .button_div button");
    if (placeOrderButton) {
      placeOrderButton.addEventListener("click", placeOrder);
    }
  }
  document.querySelector(".cart-toggle")?.addEventListener("click", openCart);
});