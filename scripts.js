// Gallery and Lightbox functionality
let currentImageIndex = 0;
const galleryImages = [];

// Function to load images from the images folder
function loadGalleryImages() {
    const galleryGrid = document.getElementById('galleryGrid');
    let loadedImages = 0;
    let currentImage = 1;

    function tryLoadImage() {
        const imagePath = `images/${currentImage}.png`;
        const img = new Image();

        img.onload = function () {
            // Image exists, add it to gallery
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            const displayImg = document.createElement('img');
            displayImg.src = imagePath;
            displayImg.alt = `Flooring Installation Project ${currentImage}`;

            galleryItem.addEventListener('click', () => openLightbox(loadedImages));

            galleryItem.appendChild(displayImg);
            galleryGrid.appendChild(galleryItem);

            galleryImages.push(imagePath);
            loadedImages++;
            currentImage++;
            tryLoadImage(); // Try next image
        };

        img.onerror = function () {
            // No more images to load
            if (loadedImages === 0) {
                galleryGrid.innerHTML = '<p>Gallery images coming soon!</p>';
            }
        };

        img.src = imagePath;
    }

    tryLoadImage(); // Start loading images
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    lightboxImg.src = galleryImages[currentImageIndex];
    lightbox.classList.add('active');
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    const lightboxImg = document.getElementById('lightboxImage');
    lightboxImg.src = galleryImages[currentImageIndex];
}

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', function (e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Add keyboard navigation for lightbox
document.addEventListener('keydown', function (e) {
    if (!document.getElementById('lightbox').classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            changeImage(-1);
            break;
        case 'ArrowRight':
            changeImage(1);
            break;
    }
});

// Load gallery images when page loads
window.addEventListener('load', loadGalleryImages);

// Form submission
document.getElementById('estimateForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        message: document.getElementById('message').value
    };

    // Create mailto link with form data
    const subject = encodeURIComponent('New Estimate Request - Peerless Flooring');
    const body = encodeURIComponent(
        `New Estimate Request\n\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Address: ${formData.address}\n\n` +
        `Project Details:\n${formData.message}`
    );

    // Open default email client
    window.location.href = `mailto:baronepieter@gmail.com?subject=${subject}&body=${body}`;

    // Show success message
    alert('Thank you for your request. Opening your email client...');
    this.reset();
});
