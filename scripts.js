// Enhanced Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.querySelector('.menu-overlay');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        menuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
        navMenu.setAttribute('aria-hidden', (!isMenuOpen).toString());
        navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
        
        // Handle focus trap when menu is open
        if (isMenuOpen) {
            // Focus first link in menu
            const firstLink = navMenu.querySelector('a');
            if (firstLink) firstLink.focus();
        }
    };

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    // Close menu when clicking overlay
    overlay?.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu();
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu();
        }
    });

    // Handle screen resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu();
        }
    });
});

// Filtering Products by Category
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const products = document.querySelectorAll('.product-card');

    products.forEach((product) => {
        const productCategory = product.getAttribute('data-category');
        product.style.display =
            categoryFilter === 'all' || productCategory === categoryFilter ? 'block' : 'none';
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

        return sortOption === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });

    products.forEach((product) => productsContainer.appendChild(product));
}

// Toggle Login/Signup Forms
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

// Check if User is Logged In
document.addEventListener("DOMContentLoaded", () => {
    const loginSection = document.getElementById("login-section");
    const username = localStorage.getItem("username");

    if (username) {
        loginSection.innerHTML = `
            <span>Welcome, ${username}!</span>
            <button id="logout-button" class="btn-primary">Logout</button>
        `;
        document.getElementById("logout-button").addEventListener("click", () => {
            localStorage.removeItem("username");
            window.location.reload();
        });
    }
});

// Contact Form Submission (Using SMTP.js)
const contactForm = document.getElementById("contact-form");
if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        Email.send({
            SecureToken: "YOUR_SECURE_TOKEN", // Replace with your SMTP.js secure token
            To: "byard7689@gmail.com",
            From: email,
            Subject: `New Contact Form Submission from ${name}`,
            Body: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong> ${message}</p>
            `,
        }).then((response) => {
            if (response === "OK") {
                alert("Message sent successfully!");
                contactForm.reset();
            } else {
                alert("Failed to send the message. Please try again.");
            }
        }).catch((error) => {
            console.error("Error sending email:", error);
            alert("An error occurred. Please try again later.");
        });
    });
}

// Registration Form Submission
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        alert(`Account created successfully! Welcome, ${username}!`);
        localStorage.setItem("username", username);
        window.location.href = "login.html";
    });
}

// Forgot Password Form Submission
const forgotPasswordForm = document.getElementById("forgot-password-form");
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("email").value.trim();
        alert(`Instructions to reset your password have been sent to ${email}.`);
        window.location.href = "login.html";
    });
}

// Update Cart Totals Dynamically
document.addEventListener("DOMContentLoaded", function () {
    const cartCountElement = document.querySelector(".wd-cart-number");
    const cartSubtotalElement = document.querySelector(".woocommerce-Price-amount");

    const cartItems = 3; // Example count
    const cartTotal = 750; // Example total

    cartCountElement.innerHTML = `${cartItems} <span class="items-text">items</span>`;
    cartSubtotalElement.innerHTML = `<bdi>${cartTotal}&nbsp;<span class="woocommerce-Price-currencySymbol">EGP</span></bdi>`;
});

// Proceed to Checkout
const checkoutButton = document.getElementById("checkout");
if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
        const cartItems = document.querySelectorAll("#cart-items tr").length;

        if (cartItems > 0) {
            window.location.href = "checkout.html";
        } else {
            alert("Your cart is empty. Please add items before proceeding to checkout.");
        }
    });
}

function filterProducts() {
    console.debug('Filtering products...');
    const category = document.getElementById('category-filter').value;
    console.debug('Selected category:', category);
    
    const products = document.querySelectorAll('.product-card');
    products.forEach(product => {
        const isVisible = category === 'all' || product.dataset.category === category;
        product.style.display = isVisible ? 'block' : 'none';
        console.debug(`Product ${product.querySelector('h3').textContent}: ${isVisible ? 'shown' : 'hidden'}`);
    });
}

function sortProducts() {
    console.debug('Sorting products...');
    const sortBy = document.getElementById('price-sort').value;
    console.debug('Sort order:', sortBy);
    
    const productsContainer = document.getElementById('products-container');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        return sortBy === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });
    
    products.forEach(product => productsContainer.appendChild(product));
    console.debug('Sort complete');
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Product page error:', event.error);
});