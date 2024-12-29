document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const checkoutForm = document.getElementById('checkout-form');

    function updateCartSummary() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cartItems.forEach(item => {
            const total = item.quantity * item.price;
            subtotal += total;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product}</td>
                <td>${item.quantity}</td>
                <td>${item.price} EGP</td>
                <td>${total} EGP</td>
            `;
            cartItemsContainer.appendChild(row);
        });

        orderSubtotal.textContent = `${subtotal} EGP`;
    }

    updateCartSummary();

    checkoutForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(checkoutForm);
        const orderData = {
            customerName: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            otherPhone: formData.get('other-phone'),
            notes: formData.get('notes'),
            paymentMethod: formData.get('payment'),
            items: cartItems,
            subtotal: parseFloat(orderSubtotal.textContent)
        };

        try {
            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Order placed successfully! Order ID: ' + result.orderId);
                localStorage.removeItem('cartItems');
                window.location.href = '/order-confirmation.html';
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            alert('Error placing order: ' + error.message);
        }
    });
});
