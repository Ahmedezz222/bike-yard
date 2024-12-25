// Import Dependencies
const express = require('express');
const path = require('path');

// Initialize Express App
const app = express();

// Set Port
const PORT = process.env.PORT || 3000;

// Middleware to Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

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

// 404 Page for Undefined Routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
