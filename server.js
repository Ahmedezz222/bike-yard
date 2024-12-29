// Import Dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express App
const app = express();

// Set Port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bikeyarddb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    address: String,
    phone: String,
    otherPhone: String,
    notes: String,
    paymentMethod: String,
    items: [{
        product: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    subtotal: Number,
    orderDate: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Serve Home Page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve Products Page
app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'products.html'));
});

// Serve Services Page
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

// Serve Contact Page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API Endpoints
app.post('/api/orders', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ error: 'Error placing order' });
    }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        res.json(order);
    } catch (error) {
        res.status(404).json({ error: 'Order not found' });
    }
});

// 404 Page for Undefined Routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
