// Function to create a before/after slider
function createBeforeAfterSlider(beforeImage, afterImage, index) {
    const slider = document.createElement('div');
    slider.className = 'before-after-slider';
    slider.id = `slider-${index}`;

    // Create before side with loading state
    const beforeSide = document.createElement('div');
    beforeSide.className = 'slider-before';
    const beforeImg = document.createElement('img');
    beforeImg.loading = 'lazy';
    beforeImg.decoding = 'async';
    beforeImg.fetchPriority = 'high';
    beforeImg.src = beforeImage;
    beforeImg.alt = 'Before transformation';
    beforeImg.srcset = `${beforeImage} 1200w, ${beforeImage} 800w, ${beforeImage} 400w`;
    beforeImg.sizes = "(max-width: 500px) 400px, (max-width: 900px) 800px, 1200px";
    beforeSide.appendChild(beforeImg);

    // Create after side
    const afterSide = document.createElement('div');
    afterSide.className = 'slider-after';
    const afterImg = document.createElement('img');
    afterImg.loading = 'lazy';
    afterImg.src = afterImage;
    afterImg.alt = 'After transformation';
    afterImg.srcset = `${afterImage} 1200w, ${afterImage} 800w, ${afterImage} 400w`;
    afterImg.sizes = "(max-width: 500px) 400px, (max-width: 900px) 800px, 1200px";
    afterSide.appendChild(afterImg);

    // Create handle
    const handle = document.createElement('div');
    handle.className = 'slider-handle';

    // Create labels
    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'slider-label label-before';
    beforeLabel.textContent = 'Before';

    const afterLabel = document.createElement('div');
    afterLabel.className = 'slider-label label-after';
    afterLabel.textContent = 'After';

    // Add all elements to slider
    slider.appendChild(beforeSide);
    slider.appendChild(afterSide);
    slider.appendChild(handle);
    slider.appendChild(beforeLabel);
    slider.appendChild(afterLabel);

    // Initialize slider at 50%
    afterSide.style.width = '50%';
    handle.style.left = '50%';

    // Add event listeners for slider functionality
    let isDragging = false;

    const handleMove = (e) => {
        if (!isDragging) return;

        const sliderRect = slider.getBoundingClientRect();
        const x = e.type === 'touchmove'
            ? e.touches[0].clientX - sliderRect.left
            : e.clientX - sliderRect.left;

        const position = Math.max(0, Math.min(x, sliderRect.width));
        const percentage = (position / sliderRect.width) * 100;

        afterSide.style.width = `${percentage}%`;
        handle.style.left = `${percentage}%`;
    };

    const startDragging = (e) => {
        isDragging = true;
        slider.classList.add('dragging');
        handleMove(e);
    };

    const stopDragging = () => {
        isDragging = false;
        slider.classList.remove('dragging');
    };

    // Touch events
    handle.addEventListener('touchstart', startDragging);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', stopDragging);

    // Mouse events
    handle.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', stopDragging);

    return slider;
}

// Global variables for transformation slider
let currentTransformIndex = 0;
const transformationsPerPage = 1;
let totalTransformations = 0;

// Function to show specific transformation
function showTransformation(index) {
    const container = document.getElementById('transformationSlider');
    const sliders = container.getElementsByClassName('before-after-slider');

    // Hide all sliders
    Array.from(sliders).forEach(slider => {
        slider.style.display = 'none';
    });

    // Show current slider
    if (sliders[index]) {
        sliders[index].style.display = 'block';
    }

    // Update navigation buttons
    updateTransformationNavigation();
}

// Function to update transformation navigation
function updateTransformationNavigation() {
    const prevButton = document.getElementById('transformPrev');
    const nextButton = document.getElementById('transformNext');
    const pagination = document.getElementById('transformPagination');

    if (prevButton && nextButton) {
        prevButton.disabled = currentTransformIndex === 0;
        nextButton.disabled = currentTransformIndex >= totalTransformations - 1;
    }

    if (pagination) {
        pagination.innerHTML = '';
        for (let i = 0; i < totalTransformations; i++) {
            const dot = document.createElement('div');
            dot.className = `transform-dot${i === currentTransformIndex ? ' active' : ''}`;
            dot.addEventListener('click', () => {
                currentTransformIndex = i;
                showTransformation(i);
            });
            pagination.appendChild(dot);
        }
    }
}

// Function to navigate transformations
function navigateTransformation(direction) {
    currentTransformIndex = Math.max(0, Math.min(currentTransformIndex + direction, totalTransformations - 1));
    showTransformation(currentTransformIndex);
}

// Load and initialize before/after sliders
async function loadTransformationSliders() {
    const container = document.getElementById('transformationSlider');
    if (!container) return;

    // Create navigation elements
    const navigation = document.createElement('div');
    navigation.className = 'transformation-navigation';
    navigation.innerHTML = `
        <button id="transformPrev" onclick="navigateTransformation(-1)">❮</button>
        <div id="transformPagination" class="transform-pagination"></div>
        <button id="transformNext" onclick="navigateTransformation(1)">❯</button>
    `;
    container.parentElement.appendChild(navigation);

    // Function to check if image exists
    const imageExists = async (url) => {
        try {
            const response = await fetch(url);
            return response.ok;
        } catch {
            return false;
        }
    };

    let currentIndex = 1;

    while (true) {
        const beforeImage = `images/baslider/${currentIndex}.png`;
        const afterImage = `images/baslider/${String.fromCharCode(96 + currentIndex)}.png`;

        // Check if both before and after images exist
        const [beforeExists, afterExists] = await Promise.all([
            imageExists(beforeImage),
            imageExists(afterImage)
        ]);

        if (!beforeExists || !afterExists) break;

        // Create and add the slider
        const slider = createBeforeAfterSlider(beforeImage, afterImage, currentIndex);
        container.appendChild(slider);

        currentIndex++;
    }

    totalTransformations = currentIndex - 1;

    // Show first transformation and initialize navigation
    if (totalTransformations > 0) {
        showTransformation(0);
    }
}

// Call the function when the page loads
window.addEventListener('load', loadTransformationSliders);
