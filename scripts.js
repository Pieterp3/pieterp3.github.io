// Gallery and Lightbox functionality
let currentImageIndex = 0;
let currentPage = 0;
const galleryImages = [];
const imagesPerPage = 3;

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
            displayImg.loading = 'lazy'; // Add lazy loading
            displayImg.src = imagePath;
            displayImg.alt = `Flooring Installation Project ${currentImage}`;
            displayImg.srcset = `${imagePath} 1200w, ${imagePath} 800w, ${imagePath} 400w`;
            displayImg.sizes = "(max-width: 500px) 400px, (max-width: 900px) 800px, 1200px";

            // Add click event to both the div and the image
            const openLightboxHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                openLightbox(loadedImages);
            };
            galleryItem.addEventListener('click', openLightboxHandler);
            displayImg.addEventListener('click', openLightboxHandler);

            galleryItem.appendChild(displayImg);
            galleryGrid.appendChild(galleryItem);

            galleryImages.push(imagePath);
            loadedImages++;
            currentImage++;
            tryLoadImage(); // Try next image

            // Update pagination after loading images
            if (loadedImages % imagesPerPage === 0) {
                updatePagination();
            }
        };

        img.onerror = function () {
            // No more images to load
            if (loadedImages === 0) {
                galleryGrid.innerHTML = '<p>Gallery images coming soon!</p>';
            } else {
                updatePagination();
            }
        };

        img.src = imagePath;
    }

    tryLoadImage(); // Start loading images
}

// Function to update pagination dots
function updatePagination() {
    const paginationContainer = document.getElementById('galleryPagination');
    const totalPages = Math.ceil(galleryImages.length / imagesPerPage);

    paginationContainer.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `page-dot${i === currentPage ? ' active' : ''}`;
        dot.addEventListener('click', () => goToPage(i));
        paginationContainer.appendChild(dot);
    }
}

// Function to move to specific page
function goToPage(page) {
    const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
    if (page >= 0 && page < totalPages) {
        currentPage = page;
        updateGalleryPosition();
        updatePagination();
    }
}

// Function to move gallery
function moveGallery(direction) {
    const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
    currentPage = (currentPage + direction + totalPages) % totalPages;
    updateGalleryPosition();
    updatePagination();
}

// Function to update gallery position
function updateGalleryPosition() {
    const galleryGrid = document.getElementById('galleryGrid');
    const offset = -currentPage * (100);
    galleryGrid.style.transform = `translateX(${offset}%)`;
}

// Touch event variables
let touchStartX = 0;
let touchEndX = 0;

// Function to create lightbox content
function createLightboxContent() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');

    // Create container
    const content = document.createElement('div');
    content.className = 'lightbox-content';

    // Create main image container
    const main = document.createElement('div');
    main.className = 'lightbox-main';

    // Create preview containers
    const prevPreview = document.createElement('div');
    prevPreview.className = 'lightbox-preview prev';
    const nextPreview = document.createElement('div');
    nextPreview.className = 'lightbox-preview next';

    // Move existing elements into new structure
    main.appendChild(lightboxImg);
    prevPreview.innerHTML = '<img src="" alt="Previous image">';
    nextPreview.innerHTML = '<img src="" alt="Next image">';

    content.appendChild(prevPreview);
    content.appendChild(main);
    content.appendChild(nextPreview);

    // Add touch events for mobile
    content.addEventListener('touchstart', handleTouchStart);
    content.addEventListener('touchend', handleTouchEnd);

    // Add click events for previews
    prevPreview.addEventListener('click', () => changeImage(-1));
    nextPreview.addEventListener('click', () => changeImage(1));

    // Replace lightbox contents
    lightbox.innerHTML = '';
    lightbox.appendChild(content);

    // Re-add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'lightbox-close';
    closeButton.onclick = closeLightbox;
    closeButton.innerHTML = '×';
    lightbox.appendChild(closeButton);
}

// Touch event handlers
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
        if (swipeDistance > 0) {
            changeImage(1);
        } else {
            changeImage(-1);
        }
    }
}

// Lightbox functions
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');

    // Create lightbox content if it doesn't exist
    if (!document.querySelector('.lightbox-content')) {
        createLightboxContent();
    }

    updateLightboxImages();
    lightbox.classList.add('active');
}

function updateLightboxImages() {
    const mainImg = document.getElementById('lightboxImage');
    const prevImg = document.querySelector('.lightbox-preview.prev img');
    const nextImg = document.querySelector('.lightbox-preview.next img');

    // Update main image
    mainImg.src = galleryImages[currentImageIndex];

    // Update preview images
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;

    prevImg.src = galleryImages[prevIndex];
    nextImg.src = galleryImages[nextIndex];
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
}

function changeImage(direction) {
    currentImageIndex = (currentImageIndex + direction + galleryImages.length) % galleryImages.length;
    updateLightboxImages();
}

// Close lightbox when clicking outside the content
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
