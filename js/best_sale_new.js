document.addEventListener("DOMContentLoaded", () => {
    // Unified function to display products in a Swiper slider
    function displayProductsInSlider(containerId, sectionClass, filterCondition, getSaleLabel) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Element with ID '${containerId}' not found.`);
            return;
        }

        container.innerHTML = ''; // Clear container
        products.forEach(product => {
            if (filterCondition(product)) {
                const percent_disc = product.old_price
                    ? Math.floor(((product.old_price - product.price) / product.old_price) * 100)
                    : 0;

                container.innerHTML += `
                    <div class="product swiper-slide">
                        <div class="icons">
                            <span><i onclick="addToCart(${product.id}, this, event)" class="fa-solid fa-cart-plus"></i></span>
                            <span><i class="fa-solid fa-heart"></i></span>
                            <span><i class="fa-solid fa-share"></i></span>
                        </div>
                        <span class="sale_present">${getSaleLabel(product, percent_disc)}</span>
                        <div class="img_product">
                            <a href="item.html?id=${product.id}">
                                <img src="${product.img}" alt="${product.name}">
                                <img class="img_hover" src="${product.img_hover}" alt="${product.name} Hover">
                            </a>
                        </div>
                        <h3 class="name_product"><a href="item.html?id=${product.id}">${product.name}</a></h3>
                        <div class="tags-container">
                            <span class="tag">${product.os}</span>
                            <span class="tag">${product.ram}</span>
                            <span class="tag">${product.screen_size}</span>
                        </div>
                        <div class="stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <div class="price">
                            <p><span>EGP${product.price}</span></p>
                            ${product.old_price ? `<p class="old_price">EGP${product.old_price}</p>` : ""}
                        </div>
                    </div>
                `;
            }
        });

        // Initialize Swiper
        new Swiper(`.${sectionClass}`, {
            slidesPerView: 5,
            spaceBetween: 30,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: `.${sectionClass} .swiper-button-next`,
                prevEl: `.${sectionClass} .swiper-button-prev`,
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

    // Display Best Sellers
    displayProductsInSlider(
        'swiper_items_best',
        'best_sec',
        product => product.isBestSeller === true,
        (product, percent_disc) => percent_disc > 0 ? `%${percent_disc}` : 'BEST SELLER'
    );

    // Display New Products
    displayProductsInSlider(
        'swiper_items_new',
        'new_sec',
        product => product.isNew === true,
        () => 'NEW'
    );

    // Display Sale Products
    displayProductsInSlider(
        'swiper_items_sale',
        'sale_sec',
        product => product.old_price,
        (product, percent_disc) => `%${percent_disc}`
    );
});