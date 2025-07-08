<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .cart-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 3rem 0;
            margin-bottom: 2rem;
        }
        .cart-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .cart-item {
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: box-shadow 0.3s ease;
        }
        .cart-item:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .item-image {
            width: 120px;
            height: 120px;
            object-fit: cover;
            border-radius: 10px;
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .quantity-btn {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .quantity-btn:hover {
            background: #e9ecef;
            border-color: #adb5bd;
        }
        .quantity-display {
            min-width: 50px;
            text-align: center;
            font-weight: 600;
        }
        .remove-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        .remove-btn:hover {
            background: #c82333;
            transform: translateY(-1px);
        }
        .summary-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            height: fit-content;
        }
        .checkout-btn {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            border: none;
            border-radius: 10px;
            padding: 1rem 2rem;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            width: 100%;
        }
        .checkout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(40, 167, 69, 0.3);
        }
        .checkout-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }
        .empty-cart {
            text-align: center;
            padding: 4rem 2rem;
        }
        .empty-cart i {
            font-size: 4rem;
            color: #6c757d;
            margin-bottom: 1rem;
        }
        .continue-shopping {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }
        .continue-shopping:hover {
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }
        .price-highlight {
            color: #28a745;
            font-weight: 600;
        }
        .loading {
            display: none;
            text-align: center;
            padding: 2rem;
        }
        .spinner-border-sm {
            width: 1rem;
            height: 1rem;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="cart-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-5 fw-bold mb-3">
                        <i class="bi bi-cart3 me-3"></i>Shopping Cart
                    </h1>
                    <p class="lead mb-0">Review your items and proceed to checkout</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div class="container">
            <a class="navbar-brand fw-bold" href="/">
                <i class="bi bi-bicycle me-2"></i>Bike Yard
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/products">Products</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/gallery">Gallery</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contact">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Cart Content -->
    <main class="container">
        <div class="row">
            <!-- Cart Items -->
            <div class="col-lg-8">
                <div class="cart-card">
                    <div class="card-body p-4">
                        <div id="loading" class="loading">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <p class="mt-2">Loading cart...</p>
                        </div>

                        <div id="empty-cart" class="empty-cart" style="display: none;">
                            <i class="bi bi-cart-x"></i>
                            <h3>Your cart is empty</h3>
                            <p class="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
                            <a href="/products" class="continue-shopping">
                                <i class="bi bi-arrow-left me-2"></i>Continue Shopping
                            </a>
                        </div>

                        <div id="cart-items">
                            <!-- Cart items will be dynamically loaded here -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="col-lg-4">
                <div class="summary-card">
                    <h3 class="h5 mb-4">Order Summary</h3>
                    
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span id="subtotal">$0.00</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Tax (10%):</span>
                        <span id="tax">$0.00</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span id="shipping">$0.00</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-4">
                        <strong>Total:</strong>
                        <strong class="price-highlight" id="total">$0.00</strong>
                    </div>

                    <button id="checkout-btn" class="checkout-btn" onclick="proceedToCheckout()">
                        <i class="bi bi-credit-card me-2"></i>Proceed to Checkout
                    </button>

                    <div class="text-center mt-3">
                        <a href="/products" class="text-decoration-none">
                            <i class="bi bi-arrow-left me-1"></i>Continue Shopping
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-bicycle me-2"></i>Bike Yard</h5>
                    <p class="text-muted mb-0">Your trusted partner for all things cycling.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-muted mb-0">&copy; 2024 Bike Yard. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Sample cart data (in a real app, this would come from session/database)
        let cartItems = [
            {
                id: 1,
                name: 'Mountain Bike',
                price: 500.00,
                image: '/products/Mountain_Bike.png',
                quantity: 1
            },
            {
                id: 2,
                name: 'Cycling Helmet',
                price: 40.00,
                image: '/products/Accessories.png',
                quantity: 2
            }
        ];

        // Initialize cart
        document.addEventListener('DOMContentLoaded', function() {
            loadCart();
        });

        function loadCart() {
            const loading = document.getElementById('loading');
            const emptyCart = document.getElementById('empty-cart');
            const cartItemsContainer = document.getElementById('cart-items');

            loading.style.display = 'block';
            cartItemsContainer.innerHTML = '';

            // Simulate loading
            setTimeout(() => {
                loading.style.display = 'none';

                if (cartItems.length === 0) {
                    emptyCart.style.display = 'block';
                    updateSummary();
                    return;
                }

                emptyCart.style.display = 'none';
                renderCartItems();
                updateSummary();
            }, 500);
        }

        function renderCartItems() {
            const container = document.getElementById('cart-items');
            container.innerHTML = '';

            cartItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="item-image" 
                                 onerror="this.src='/products/Mountain_Bike.png'">
                        </div>
                        <div class="col-md-4">
                            <h5 class="mb-1">${item.name}</h5>
                            <p class="text-muted mb-0">Price: $${item.price.toFixed(2)}</p>
                        </div>
                        <div class="col-md-3">
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <strong class="price-highlight">$${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                        <div class="col-md-1 text-end">
                            <button class="remove-btn" onclick="removeItem(${item.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                container.appendChild(itemElement);
            });
        }

        function updateQuantity(itemId, change) {
            const item = cartItems.find(item => item.id === itemId);
            if (item) {
                const newQuantity = item.quantity + change;
                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                    renderCartItems();
                    updateSummary();
                } else if (newQuantity === 0) {
                    removeItem(itemId);
                }
            }
        }

        function removeItem(itemId) {
            cartItems = cartItems.filter(item => item.id !== itemId);
            renderCartItems();
            updateSummary();
            
            if (cartItems.length === 0) {
                document.getElementById('empty-cart').style.display = 'block';
            }
        }

        function updateSummary() {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.1;
            const shipping = subtotal > 0 ? 10.00 : 0;
            const total = subtotal + tax + shipping;

            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
            document.getElementById('total').textContent = `$${total.toFixed(2)}`;

            // Disable checkout if cart is empty
            const checkoutBtn = document.getElementById('checkout-btn');
            checkoutBtn.disabled = cartItems.length === 0;
        }

        function proceedToCheckout() {
            if (cartItems.length === 0) {
                alert('Your cart is empty. Please add some items before checkout.');
                return;
            }

            // In a real application, this would redirect to a checkout page
            // For now, we'll simulate a successful order
            const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1 + 10;
            
            // Create a simple order object
            const order = {
                id: Date.now(),
                items: cartItems,
                total: total,
                status: 'pending'
            };

            // Store order in localStorage for demo purposes
            localStorage.setItem('currentOrder', JSON.stringify(order));

            // Redirect to order confirmation
            window.location.href = '/order-confirmation';
        }
    </script>
</body>
</html> 