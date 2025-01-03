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
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: String,
    email: String,
    address: String,
    phone: String,
    otherPhone: String,
    notes: String,
    paymentMethod: String,
    status: { type: String, default: 'pending' },
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

        // Send confirmation email
        const emailBody = `
            New order received!
            Order ID: ${order._id}
            Customer: ${order.customerName}
            Total Amount: ${order.subtotal} EGP
            View full details in your admin dashboard.
        `;

        // Send email using your preferred email service
        // Example using nodemailer (you'll need to install it):
        const nodemailer = require('nodemailer');
        
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gmass',
                pass: '6eca2716-3faa-4081-be4e-83b883e37ba2' // Use app-specific password from Gmail
            }
        });

        await transporter.sendMail({
            host: 'smtp.gmail.com',
            port: 2525,
            from: 'byard7689@gmail.com',
            to: 'byard7689@gmail.com',
            subject: `New Order #${order._id}`,
            text: emailBody
        });

        res.status(201).json({ 
            message: 'Order placed successfully', 
            orderId: order._id 
        });
    } catch (error) {
        console.error('Order processing error:', error);
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

// Additional API Endpoints
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

app.put('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error updating order' });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting order' });
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
