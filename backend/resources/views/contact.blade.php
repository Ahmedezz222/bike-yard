<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact - Bike Yard</title>
    <style>
        .contact-form { max-width: 400px; margin: 40px auto; }
        .contact-form input, .contact-form textarea { width: 100%; margin-bottom: 10px; padding: 8px; }
        .contact-form button { background: #007bff; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .address { margin: 40px auto; max-width: 400px; }
    </style>
</head>
<body>
    <h1>Contact</h1>
    <div class="contact-form">
        <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="4" required></textarea>
            <button type="submit">Send Message</button>
        </form>
    </div>
    <div class="address">
        <strong>Address:</strong><br>
        123 Bike Lane, Cycle City, Country
    </div>
</body>
</html> 