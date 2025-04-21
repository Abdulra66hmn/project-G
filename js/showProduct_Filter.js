// Filter open/close function (Mobile only)
function open_close_filter() {
    const mobileFilter = document.querySelector('.mobile_filter');
    const overlay = document.querySelector('.filter_overlay');
    
    mobileFilter.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Unified product display function
function displayProducts(category, containerId, productsToShow = null) {
    const productsContainer = document.getElementById(containerId);
    if (!productsContainer) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }
    
    productsContainer.innerHTML = '<div class="loader"></div>';

    setTimeout(() => {
        productsContainer.innerHTML = '';
        const filteredProducts = productsToShow || products.filter(product => product.laptop.toLowerCase() === category.toLowerCase());
        
        filteredProducts.forEach(product => {
            const percent_disc = product.old_price && product.price
                ? Math.floor(((product.old_price - product.price) / product.old_price) * 100)
                : 0;

            const productHTML = `
                <div class="product swiper-slide">
                    <div class="icons">
                        <span><i onclick="addToCart(${product.id}, this)" class="fa-solid fa-cart-plus"></i></span>
                        <span><i class="fa-solid fa-heart"></i></span>
                        <span><i class="fa-solid fa-share"></i></span>
                    </div>
                    ${percent_disc > 0 ? `<span class="sale_present">%${percent_disc}</span>` : ""}
                    ${product.isNew ? `<span class="sale_present">NEW</span>` : ""}
                    <div class="img_product">
                        <img src="${product.img}" alt="${product.name}">
                        <img class="img_hover" src="${product.img_hover}" alt="${product.name} Hover">
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
            productsContainer.innerHTML += productHTML;
        });
    }, 500);
}

// Unified apply filters function
function applyFilters(category, containerId) {
    const productsContainer = document.getElementById(containerId);
    if (!productsContainer) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    productsContainer.innerHTML = '<div class="loader"></div>';

    setTimeout(() => {
        // Collect filters from desktop
        const sortPrice = document.querySelector('input[name="sort-price"]:checked')?.value;
        const screenSizes = Array.from(document.querySelectorAll('.desktop_filter input[type="checkbox"][value*="inches"]:checked')).map(input => input.value);
        const processors = Array.from(document.querySelectorAll('.desktop_filter input[type="checkbox"][value*="M3"]:checked, .desktop_filter input[type="checkbox"][value*="Intel Core"]:checked')).map(input => input.value);
        const rams = Array.from(document.querySelectorAll('.desktop_filter input[type="checkbox"][value*="GB"]:checked')).map(input => input.value);

        // Collect filters from mobile
        const mobileSortPrice = document.querySelector('.mobile_filter .filter_option[data-category="sort-price"].active')?.dataset.value;
        const mobileScreenSizes = Array.from(document.querySelectorAll('.mobile_filter .filter_option[data-category="screen-size"].active')).map(btn => btn.dataset.value);
        const mobileProcessors = Array.from(document.querySelectorAll('.mobile_filter .filter_option[data-category="processor"].active')).map(btn => btn.dataset.value);
        const mobileRams = Array.from(document.querySelectorAll('.mobile_filter .filter_option[data-category="ram"].active')).map(btn => btn.dataset.value);

        // Combine desktop and mobile filters
        const finalSortPrice = sortPrice || mobileSortPrice;
        const finalScreenSizes = screenSizes.length > 0 ? screenSizes : mobileScreenSizes;
        const finalProcessors = processors.length > 0 ? processors : mobileProcessors;
        const finalRams = rams.length > 0 ? rams : mobileRams;

        // Filter products by category
        let filteredProducts = products.filter(product => product.laptop.toLowerCase() === category.toLowerCase());

        // Apply filters
        if (finalScreenSizes.length > 0) {
            filteredProducts = filteredProducts.filter(product => finalScreenSizes.includes(product.screen_size));
        }
        if (finalProcessors.length > 0) {
            filteredProducts = filteredProducts.filter(product => finalProcessors.includes(product.processor));
        }
        if (finalRams.length > 0) {
            filteredProducts = filteredProducts.filter(product => finalRams.includes(product.ram));
        }
        if (finalSortPrice === 'low-to-high') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (finalSortPrice === 'high-to-low') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(category, containerId, filteredProducts);
    }, 500);
}

// Unified clear filters function
function clearFilters(category, containerId) {
    document.querySelectorAll('.desktop_filter input[type="radio"]').forEach(input => (input.checked = false));
    document.querySelectorAll('.desktop_filter input[type="checkbox"]').forEach(input => (input.checked = false));
    document.querySelectorAll('.mobile_filter .filter_option').forEach(btn => btn.classList.remove('active'));
    displayProducts(category, containerId);
}

// Mobile filter button handling
document.querySelectorAll('.mobile_filter .filter_option').forEach(button => {
    button.addEventListener('click', function () {
        const category = this.dataset.category;
        if (category === 'sort-price') {
            document.querySelectorAll(`.filter_option[data-category="${category}"]`).forEach(btn => btn.classList.remove('active'));
        }
        this.classList.toggle('active');
    });
});

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'hp') {
        displayProducts('hp', 'productsHP_dev');
    } else if (page === 'lenovo') {
        displayProducts('lenovo', 'products_dev');
    } else if (page === 'mac') {
        displayProducts('mac', 'productsMAC_dev');
    }
});