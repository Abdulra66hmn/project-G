 // جلب الـ ID من الـ URL
 function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
  }

  // جلب بيانات المنتج وعرضها
  const productId = getProductIdFromUrl();
  const product = products.find(p => p.id === productId);

  if (product) {
    document.getElementById('bigImg').src = product.img;
    document.getElementsByClassName('sm_imgs')[0].children[0].src = product.img;
    document.getElementsByClassName('sm_imgs')[0].children[1].src = product.img_hover;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-price').textContent = `EGP${product.price}`;
    document.getElementById('product-old-price').textContent = product.old_price ? `EGP${product.old_price}` : '';
    document.getElementById('product-storage').textContent = `Storage : ${product.storage}`;
    document.getElementById('product-ram').textContent = `Ram : ${product.ram}`;
    document.getElementById('product-processor').textContent = `Processor: ${product.processor1, product.processor}`;
    document.getElementById('product-screen-size').textContent = `Screen size : ${product.screen_size}`;
    document.getElementById('product-screen-type').textContent = `Screen type : ${product.screen_type}`;
    document.getElementById('product-graph-card').textContent = `Graphic card : ${product.graph_card}`;
    document.getElementById('product-os').textContent = `OS : ${product.os}`;
  } else {
    document.querySelector('.item_detail').innerHTML = '<p>Product not found!</p>';
  }

  // تغيير الصورة الكبيرة
  function ChangeItemImage(src) {
    document.getElementById('bigImg').src = src;
  }

  // عرض المنتجات المماثلة
  const swiper_items_sale = document.getElementById("swiper_items_sale");
  if (swiper_items_sale) {
    products.forEach(p => {
      if (p.id !== productId && p.old_price) {
        const percent_disc = Math.floor(((p.old_price - p.price) / p.old_price) * 100);
        swiper_items_sale.innerHTML += `
          <div class="product swiper-slide">
            <div class="icons">
              <span><i onclick="addToCart(${p.id}, this, event)" class="fa-solid fa-cart-plus"></i></span>
              <span><i class="fa-solid fa-heart"></i></span>
              <span><i class="fa-solid fa-share"></i></span>
            </div>
            <span class="sale_present">%${percent_disc}</span>
            <div class="img_product">
              <a href="item.html?id=${p.id}">
                <img src="${p.img}" alt="${p.name}">
                <img class="img_hover" src="${p.img_hover}" alt="${p.name} Hover">
              </a>
            </div>
            <h3 class="name_product"><a href="item.html?id=${p.id}">${p.name}</a></h3>
            <div class="tags-container">
              <span class="tag">${p.os}</span>
              <span class="tag">${p.ram}</span>
              <span class="tag">${p.screen_size}</span>
            </div>
            <div class="stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="price">
              <p><span>EGP${p.price}</span></p>
              <p class="old_price">EGP${p.old_price}</p>
            </div>
          </div>
        `;
      }
    });

    const saleSwiper = new Swiper(".sale_sec", {
      slidesPerView: 5,
      spaceBetween: 30,
      autoplay: {
        delay: 1500,
        disableOnInteraction: false,
      },
      navigation: {
        nextEl: ".sale_sec .swiper-button-next",
        prevEl: ".sale_sec .swiper-button-prev",
      },
      loop: true,
      breakpoints: {
        1600: { slidesPerView: 5 },
        1200: { slidesPerView: 4, spaceBetween: 30 },
        700: { slidesPerView: 3, spaceBetween: 15 },
        0: { slidesPerView: 2, spaceBetween: 10 },
      },
    });
  }


