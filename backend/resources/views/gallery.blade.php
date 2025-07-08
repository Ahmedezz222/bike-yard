<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gallery - Bike Yard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
        }
        .gallery-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 0;
            margin-bottom: 3rem;
        }
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem 0;
        }
        .gallery-item {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        .gallery-image {
            width: 100%;
            height: 250px;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        .gallery-item:hover .gallery-image {
            transform: scale(1.05);
        }
        .gallery-content {
            padding: 1.5rem;
        }
        .gallery-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
        }
        .gallery-description {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .back-to-top:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .loading-placeholder {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
        }
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header class="gallery-header">
        <div class="container">
            <div class="row">
                <div class="col-12 text-center">
                    <h1 class="display-4 fw-bold mb-3">Our Gallery</h1>
                    <p class="lead mb-0">Explore our collection of cycling moments, products, and community events</p>
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
                        <a class="nav-link active" href="/gallery">Gallery</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/contact">Contact</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Gallery Content -->
    <main class="container">
        <div class="gallery-grid">
            <!-- Gallery Item 1 -->
            <div class="gallery-item">
                <img src="/img/additional/image1.jpg" alt="Mountain Bike Trail" class="gallery-image" 
                     onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Mountain+Bike+Trail'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Mountain Bike Trail</h3>
                    <p class="gallery-description">Experience the thrill of off-road cycling on challenging mountain trails.</p>
                </div>
            </div>

            <!-- Gallery Item 2 -->
            <div class="gallery-item">
                <img src="/img/additional/image2.jpg" alt="Road Cycling" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/764ba2/ffffff?text=Road+Cycling'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Road Cycling</h3>
                    <p class="gallery-description">Speed and endurance on smooth asphalt roads with professional road bikes.</p>
                </div>
            </div>

            <!-- Gallery Item 3 -->
            <div class="gallery-item">
                <img src="/img/additional/image3.jpg" alt="Bike Maintenance" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Bike+Maintenance'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Bike Maintenance</h3>
                    <p class="gallery-description">Professional bike maintenance and repair services to keep your ride in top condition.</p>
                </div>
            </div>

            <!-- Gallery Item 4 -->
            <div class="gallery-item">
                <img src="/img/additional/image4.jpg" alt="Cycling Gear" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/764ba2/ffffff?text=Cycling+Gear'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Cycling Gear</h3>
                    <p class="gallery-description">High-quality cycling apparel and protective gear for every rider.</p>
                </div>
            </div>

            <!-- Gallery Item 5 -->
            <div class="gallery-item">
                <img src="/img/additional/image5.jpg" alt="Bike Shop" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Bike+Shop'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Bike Shop</h3>
                    <p class="gallery-description">Our modern bike shop with the latest equipment and expert staff.</p>
                </div>
            </div>

            <!-- Gallery Item 6 -->
            <div class="gallery-item">
                <img src="/img/additional/image6.jpg" alt="Cycling Event" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/764ba2/ffffff?text=Cycling+Event'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Cycling Event</h3>
                    <p class="gallery-description">Join our community events and group rides for cyclists of all levels.</p>
                </div>
            </div>

            <!-- Gallery Item 7 -->
            <div class="gallery-item">
                <img src="/img/additional/image7.jpg" alt="Bike Parts" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Bike+Parts'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Bike Parts</h3>
                    <p class="gallery-description">Premium bike components and replacement parts for all bike types.</p>
                </div>
            </div>

            <!-- Gallery Item 8 -->
            <div class="gallery-item">
                <img src="/img/additional/image8.jpg" alt="Cycling Accessories" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/764ba2/ffffff?text=Cycling+Accessories'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Cycling Accessories</h3>
                    <p class="gallery-description">Essential accessories to enhance your cycling experience and safety.</p>
                </div>
            </div>

            <!-- Gallery Item 9 -->
            <div class="gallery-item">
                <img src="/img/additional/image9.jpg" alt="Bike Repair" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Bike+Repair'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Bike Repair</h3>
                    <p class="gallery-description">Expert repair services to get your bike back on the road quickly.</p>
                </div>
            </div>

            <!-- Gallery Item 10 -->
            <div class="gallery-item">
                <img src="/img/additional/image10.jpg" alt="Cycling Community" class="gallery-image"
                     onerror="this.src='https://via.placeholder.com/400x250/764ba2/ffffff?text=Cycling+Community'">
                <div class="gallery-content">
                    <h3 class="gallery-title">Cycling Community</h3>
                    <p class="gallery-description">Connect with fellow cyclists and share your passion for cycling.</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-5 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5><i class="bi bi-bicycle me-2"></i>Bike Yard</h5>
                    <p class="text-muted">Your trusted partner for all things cycling.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="text-muted mb-0">&copy; 2024 Bike Yard. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <button class="back-to-top" onclick="scrollToTop()">
        <i class="bi bi-arrow-up"></i>
    </button>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Show/hide back to top button
        window.addEventListener('scroll', function() {
            const backToTop = document.querySelector('.back-to-top');
            if (window.scrollY > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
    </script>
</body>
</html> 