// Toggle Mobile Menu
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Close Menu on Outside Click
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
    }
});

// Filtering Products by Category
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach((product) => {
        const productCategory = product.getAttribute('data-category');
        if (categoryFilter === 'all' || productCategory === categoryFilter) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sorting Products by Price
function sortProducts() {
    const sortOption = document.getElementById('price-sort').value;
    const productsContainer = document.getElementById('products-container');
    const products = Array.from(productsContainer.children);

    products.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));

        if (sortOption === 'low-to-high') {
            return priceA - priceB;
        } else if (sortOption === 'high-to-low') {
            return priceB - priceA;
        }
        return 0;
    });

    products.forEach((product) => productsContainer.appendChild(product));
}

// Toggle Forms
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("login-section");
    const username = localStorage.getItem("username");

    if (username) {
        // If user is logged in, show their username
        loginSection.innerHTML = `<span>Welcome, ${username}!</span>`;
    }
});

// Forgot Password Form
document.getElementById("forgot-password-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("forgot-password-email").value;

    // Simulate sending a reset email
    alert(`Instructions to reset your password have been sent to ${email}.`);
    window.location.href = "login.html"; // Redirect to login page after submission
});

// Register Form
document.getElementById("register-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Simulating successful account creation
    alert(`Account created successfully! Welcome, ${username}!`);
    window.location.href = "login.html"; // Redirect to login page after registration
});

// Checkout Form
document.getElementById("checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.getElementById("payment").value;

    if (!name || !email || !address || !paymentMethod) {
        alert("Please fill out all fields to confirm your order.");
        return;
    }

    alert(`Thank you, ${name}! Your order has been placed successfully.\n\nOrder Details:\nEmail: ${email}\nAddress: ${address}\nPayment Method: ${paymentMethod}`);
    // Redirect to a confirmation page or clear the cart here.
});

// Event listeners for filter and sort
document.getElementById('category-filter').addEventListener('change', filterProducts);
document.getElementById('price-sort').addEventListener('change', sortProducts);