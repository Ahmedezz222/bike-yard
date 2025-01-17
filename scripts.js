// Enhanced Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        menuToggle.setAttribute('aria-expanded', isMenuOpen.toString());
        navMenu.setAttribute('aria-hidden', (!isMenuOpen).toString());
        
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    menuToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleMenu();
    });

    [overlay, navMenu].forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target === element && isMenuOpen) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) toggleMenu();
    });
});

// Add this near the top of the file, after existing event listeners

function updateQuantity(action) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value);
    
    if (action === 'increase' && currentValue < 10) {
        currentValue++;
    } else if (action === 'decrease' && currentValue > 1) {
        currentValue--;
    }
    
    quantityInput.value = currentValue;
}

// Add this CSS for quantity controls
const quantityStyles = document.createElement('style');
quantityStyles.textContent = `
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 5px;
    }

    .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: #f5f5f5;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .quantity-btn:hover {
        background: #e0e0e0;
    }

    .quantity-btn:active {
        background: #d0d0d0;
    }

    #quantity {
        width: 50px;
        height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }

    #quantity::-webkit-inner-spin-button,
    #quantity::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;
document.head.appendChild(quantityStyles);

// Filtering Products by Category
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

// Sorting Products by Price
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

// Contact Form Submission (Using EmailJS)
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

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Send email using EmailJS
        Email.send(
            'service_w6adgtg', // EmailJS service ID
            'template_liact1f', // EmailJS template ID
            {
                host: 'smtp.gmail.com',
                username: 'byard7689@gmail.com',
                password: 'pwxt azuc mknx rpyw',
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'byard7689@gmail.com',
            },
            'pwxt azuc mknx rpyw' // EmailJS public key
        ).then(
            function(response) {
                console.log("SUCCESS", response);
                alert("Message sent successfully!");
                contactForm.reset();
            },
            function(error) {
                console.error("FAILED", error);
                alert("Failed to send message. Please try again.");
            }
        ).finally(() => {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
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

class ApplicationError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}

class Cart {
    #items;
    #storage;

    constructor() {
        this.#storage = localStorage;
        this.#items = this.#loadCart();
        this.updateCartDisplay();
    }

    #loadCart() {
        try {
            return JSON.parse(this.#storage.getItem('cart')) || [];
        } catch (error) {
            console.error('Failed to load cart:', error);
            return [];
        }
    }

    addItem(item) {
        if (!item?.id || !item?.price) {
            throw new ApplicationError('Invalid item data', 'INVALID_ITEM');
        }
        
        const existingItem = this.#items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.#items.push({ ...item, quantity: item.quantity || 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(index) {
        this.#items.splice(index, 1);
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.#items));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.#items.length;
        }

        // Update cart table if on cart page
        const cartItems = document.getElementById('cart-items');
        if (cartItems) {
            this.renderCartItems(cartItems);
        }
    }

    renderCartItems(container) {
        container.innerHTML = this.#items.map((item, index) => `
            <tr>
                <td class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <span>${item.name}</span>
                </td>
                <td>
                    <div class="quantity-controls">
                        <button type="button" class="quantity-btn minus" onclick="cart.updateItemQuantity(${index}, 'decrease')">-</button>
                        <span>${item.quantity}</span>
                        <button type="button" class="quantity-btn plus" onclick="cart.updateItemQuantity(${index}, 'increase')">+</button>
                    </div>
                </td>
                <td>
                    <button onclick="cart.removeItem(${index})" class="remove-item">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </td>
                <td>${item.price} EGP</td>
                <td>${item.quantity * item.price} EGP</td>
            </tr>
        `).join('');

        this.updateOrderTotal();
    }

    updateOrderTotal() {
        const subtotal = this.#items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);
        const subtotalElement = document.getElementById('order-subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `${subtotal} EGP`;
        }
    }

    async checkout() {
        try {
            if (this.#items.length === 0) {
                throw new ApplicationError('Cart is empty', 'EMPTY_CART');
            }
            
            // Format items for email
            const itemsList = this.#items.map(item => `
                Product: ${item.name}
                Quantity: ${item.quantity}
                Price: ${item.price} EGP
                Total: ${item.quantity * item.price} EGP
                -------------------------
            `).join('\n');

            // Store formatted items for email template
            localStorage.setItem('cartItemsForEmail', itemsList);
            localStorage.setItem('cartTotal', this.#items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0));
            
            return { success: true };
        } catch (error) {
            console.error('Checkout failed:', error);
            throw new ApplicationError('Checkout failed', 'CHECKOUT_FAILED');
        }
    }

    async #processPayment() {
        // Simulate payment processing
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    updateItemQuantity(index, action) {
        const item = this.#items[index];
        if (action === 'increase' && item.quantity < 10) {
            item.quantity++;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity--;
        }
        this.saveCart();
        this.updateCartDisplay();
    }
}

// Initialize cart
const cart = new Cart();

// Add to Cart Function
function addToCart(productId, productName, price, quantity) {
    try {
        const qty = parseInt(quantity) || 1;
        
        // Get the main product image src
        const mainImage = document.getElementById('main-product-image').src;
        
        const item = {
            id: productId,
            name: productName,
            price: parseFloat(price),
            quantity: qty,
            image: mainImage // Add image to item object
        };

        cart.addItem(item);

        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                Added ${qty} x ${productName} to cart
            </div>
        `;
        document.body.appendChild(toast);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);

    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    }
}

// Add this CSS to handle the toast message
const style = document.createElement('style');
style.textContent = `
    .toast-message {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        z-index: 1000;
        animation: slideIn 0.5s, fadeOut 0.5s 2.5s;
    }

    .toast-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Enhanced form handling
const FormHandler = {
    async submitForm(formElement) {
        try {
            const formData = new FormData(formElement);
            const data = Object.fromEntries(formData.entries());
            
            switch (formElement.id) {
                case 'contact-form':
                    return await this.handleContact(data);
                case 'register-form':
                    return await this.handleRegistration(data);
                default:
                    throw new ApplicationError('Unknown form type', 'INVALID_FORM');
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            throw error;
        }
    },

    // ...existing code...
};

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.cart = new Cart();
        
        // Setup form handlers
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitButton = e.target.querySelector('[type="submit"]');
                
                try {
                    submitButton?.setAttribute('disabled', 'true');
                    await FormHandler.submitForm(e.target);
                } catch (error) {
                    alert(error.message);
                } finally {
                    submitButton?.removeAttribute('disabled');
                }
            });
        });

        // Setup error handling
        window.addEventListener('unhandledrejection', event => {
            console.error('Unhandled promise rejection:', event.reason);
        });

    } catch (error) {
        console.error('Application initialization failed:', error);
    }
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('Product page error:', event.error);
});

// Services Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Modal handling
    const modals = {
        'custom-options': document.getElementById('custom-options'),
        'book-repair': document.getElementById('book-repair'),
        'rental-info': document.getElementById('rental-info')
    };

    // Open modal handlers
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = e.target.getAttribute('href').substring(1);
            if (modals[modalId]) {
                openModal(modals[modalId]);
            }
        });
    });

    // Close modal handlers
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    function openModal(modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Form Handling
    const forms = {
        'customization-form': handleCustomizationSubmit,
        'repair-booking-form': handleRepairBooking,
        'rental-booking-form': handleRentalBooking
    };

    Object.entries(forms).forEach(([formId, handler]) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                submitBtn.disabled = true;

                try {
                    await handler(new FormData(form));
                    closeModal(form.closest('.modal'));
                    alert('Booking submitted successfully! We will contact you shortly.');
                    form.reset();
                } catch (error) {
                    alert(error.message || 'An error occurred. Please try again.');
                } finally {
                    submitBtn.disabled = false;
                }
            });
        }
    });

    async function handleCustomizationSubmit(formData) {
        const customizations = document.querySelectorAll('input[name="customization[]"]:checked');
        if (customizations.length === 0) {
            throw new Error('Please select at least one customization option');
        }
        // Add API call here
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function handleRepairBooking(formData) {
        const date = formData.get('service-date');
        const today = new Date().toISOString().split('T')[0];
        if (date < today) {
            throw new Error('Please select a future date');
        }
        // Add API call here
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    async function handleRentalBooking(formData) {
        const duration = parseInt(formData.get('rental-duration'));
        if (duration < 1 || duration > 30) {
            throw new Error('Rental duration must be between 1 and 30 days');
        }
        // Add API call here
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Price Calculator
    function calculateRentalPrice() {
        const bikeType = document.getElementById('bike-type').value;
        const duration = parseInt(document.getElementById('rental-duration').value) || 0;
        const rates = {
            mountain: 35,
            road: 40,
            electric: 50
        };
        
        if (bikeType && rates[bikeType]) {
            const dailyRate = rates[bikeType];
            const total = duration * dailyRate;
            const weeklyDiscount = duration >= 7 ? 0.2 : 0; // 20% discount for weekly rentals
            const finalPrice = total * (1 - weeklyDiscount);
            
            document.getElementById('rental-total').textContent = 
                `Total: $${finalPrice.toFixed(2)}${weeklyDiscount > 0 ? ' (Weekly discount applied)' : ''}`;
        }
    }

    // Add event listeners for price calculator
    const rentalForm = document.getElementById('rental-booking-form');
    if (rentalForm) {
        ['bike-type', 'rental-duration'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', calculateRentalPrice);
        });
    }
});

// Services Page Button Enhancement
class ServiceFormHandler {
    constructor() {
        this.initializeButtons();
        this.initializeForms();
        this.setupPriceCalculator();
    }

    initializeButtons() {
        document.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });
    }

    async handleButtonClick(e) {
        const button = e.currentTarget;
        const originalText = button.textContent;
        
        try {
            // Add loading animation
            button.innerHTML = '<span class="spinner"></span> Processing...';
            button.disabled = true;
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Success state
            button.innerHTML = '✓ Success';
            button.classList.add('success');
            
            // Reset button after delay
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('success');
                button.disabled = false;
            }, 2000);
        } catch (error) {
            button.innerHTML = '× Error';
            button.classList.add('error');
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('error');
                button.disabled = false;
            }, 2000);
        }
    }

    initializeForms() {
        const forms = {
            'customization-form': this.handleCustomization.bind(this),
            'repair-booking-form': this.handleRepair.bind(this),
            'rental-booking-form': this.handleRental.bind(this)
        };

        Object.entries(forms).forEach(([formId, handler]) => {
            const form = document.getElementById(formId);
            if (form) {
                form.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await handler(new FormData(e.target));
                });
            }
        });
    }

    async handleCustomization(formData) {
        const bikeType = formData.get('bike-type');
        const customizations = document.querySelectorAll('input[name="customization[]"]:checked');
        
        if (!bikeType) {
            throw new Error('Please select a bike type');
        }
        if (customizations.length === 0) {
            throw new Error('Please select at least one customization option');
        }

        // Calculate total price
        const total = Array.from(customizations).reduce((sum, option) => {
            const price = this.getOptionPrice(option.value);
            return sum + price;
        }, 0);

        // Success message with quote
        alert(`Customization request submitted!\nEstimated total: $${total}\nWe'll contact you shortly to confirm details.`);
        return { success: true, total };
    }

    async handleRepair(formData) {
        const serviceDate = new Date(formData.get('service-date'));
        const today = new Date();
        
        if (serviceDate < today) {
            throw new Error('Please select a future date');
        }

        // Success message
        alert('Service booking confirmed!\nWe\'ll see you on ' + serviceDate.toLocaleDateString());
        return { success: true };
    }

    async handleRental(formData) {
        const duration = parseInt(formData.get('rental-duration'));
        const bikeType = formData.get('bike-type');
        
        if (duration < 1 || duration > 30) {
            throw new Error('Rental duration must be between 1 and 30 days');
        }

        const total = this.calculateRentalPrice(bikeType, duration);
        alert(`Rental booking confirmed!\nTotal cost: $${total}\nPlease bring a valid ID when picking up your bike.`);
        return { success: true, total };
    }

    setupPriceCalculator() {
        const rentalForm = document.getElementById('rental-booking-form');
        if (rentalForm) {
            ['bike-type', 'rental-duration'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', () => {
                        this.updateRentalPrice();
                    });
                }
            });
        }
    }

    updateRentalPrice() {
        const bikeType = document.getElementById('bike-type')?.value;
        const duration = parseInt(document.getElementById('rental-duration')?.value) || 0;
        
        if (bikeType && duration) {
            const total = this.calculateRentalPrice(bikeType, duration);
            const priceDisplay = document.getElementById('rental-total');
            if (priceDisplay) {
                priceDisplay.textContent = `Total: $${total}`;
            }
        }
    }

    calculateRentalPrice(bikeType, duration) {
        const rates = {
            mountain: 35,
            road: 40,
            electric: 50
        };

        const dailyRate = rates[bikeType] || 0;
        const baseTotal = dailyRate * duration;
        
        // Apply weekly discount if applicable
        const discount = duration >= 7 ? 0.2 : 0;
        return (baseTotal * (1 - discount)).toFixed(2);
    }

    getOptionPrice(optionValue) {
        const prices = {
            'custom-paint': 200,
            'custom-decals': 50,
            'custom-gears': 300,
            'custom-brakes': 250,
            'custom-saddle': 100,
            'custom-handlebars': 80
        };
        return prices[optionValue] || 0;
    }
}

// Initialize services functionality
document.addEventListener('DOMContentLoaded', () => {
    const serviceHandler = new ServiceFormHandler();
});