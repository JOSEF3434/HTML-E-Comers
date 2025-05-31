// Sample product data (in a real application, this would come from a backend)
let products = JSON.parse(localStorage.getItem('products')) || [
    {
        id: 1,
        title: "Wireless Headphones",
        price: 199.99,
        description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
            "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500"
        ],
        rating: 4.5,
        reviews: [
            {
                user: "John D.",
                rating: 5,
                comment: "Amazing sound quality and very comfortable!"
            },
            {
                user: "Sarah M.",
                rating: 4,
                comment: "Great headphones, but a bit pricey."
            }
        ]
    }
];

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Add new product
function addProduct(product) {
    // Generate new ID
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    product.id = newId;
    
    // Add default values if not provided
    if (!product.rating) product.rating = 0;
    if (!product.reviews) product.reviews = [];
    
    products.push(product);
    saveProducts();
    return newId;
}

// Update existing product
function updateProduct(productId, updatedProduct) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        saveProducts();
        return true;
    }
    return false;
}

// Delete product
function deleteProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        return true;
    }
    return false;
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Product display functions
function displayProducts(containerId, productsToShow) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // If it's the featured products section, only show 3 products
    if (containerId === 'featured-products') {
        productsToShow = productsToShow.slice(0, 3);
    }

    container.innerHTML = productsToShow.map(product => `
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img src="${product.images[0]}" alt="${product.title}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="text-lg font-semibold">${product.title}</h3>
                <p class="text-gray-600">$${product.price.toFixed(2)}</p>
                <div class="flex items-center mt-2">
                    ${generateStarRating(product.rating)}
                    <span class="ml-2 text-gray-600">(${product.reviews.length} reviews)</span>
                </div>
                <button onclick="addToCart(${product.id})" class="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-yellow-400"></i>';
    }

    return stars;
}

// Product detail page functions
function displayProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Update main product image
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = product.images[0];
    }

    // Update thumbnails
    const thumbnails = document.querySelectorAll('.grid-cols-4 img');
    thumbnails.forEach((thumb, index) => {
        if (product.images[index]) {
            thumb.src = product.images[index];
            thumb.onclick = () => {
                mainImage.src = product.images[index];
            };
        }
    });

    // Update product info
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;

    // Update reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = product.reviews.map(review => `
            <div class="border-b pb-4">
                <div class="flex items-center mb-2">
                    <div class="flex items-center">
                        ${generateStarRating(review.rating)}
                    </div>
                    <span class="ml-2 font-semibold">${review.user}</span>
                </div>
                <p class="text-gray-600">${review.comment}</p>
            </div>
        `).join('');
    }
}

// Quantity selector functionality
function setupQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');

    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.onclick = () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        };

        increaseBtn.onclick = () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        };
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Login/Logout functionality
function updateLoginState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const dashboardBtn = document.getElementById('dashboard-btn');

    if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (logoutBtn) logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    if (dashboardBtn) dashboardBtn.style.display = isLoggedIn ? 'block' : 'none';
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    updateLoginState();
    window.location.href = 'index.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Update login state
    updateLoginState();

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Display featured products on home page
    const featuredProducts = document.getElementById('featured-products');
    if (featuredProducts) {
        displayProducts('featured-products', products);
    }

    // Display all products on shop page
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
        displayProducts('products-grid', products);
    }

    // Setup product detail page
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    if (productId) {
        displayProductDetails(productId);
        setupQuantitySelector();
    }

    // Setup add to cart button
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(productId, quantity);
        };
    }

    // Update cart count on page load
    updateCartCount();
}); 