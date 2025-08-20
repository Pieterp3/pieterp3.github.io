// Function to create a before/after slider
function createBeforeAfterSlider(beforeImage, afterImage, index) {
    const slider = document.createElement('div');
    slider.className = 'before-after-slider';
    slider.id = `slider-${index}`;

    // Create before side
    const beforeSide = document.createElement('div');
    beforeSide.className = 'slider-before';
    const beforeImg = document.createElement('img');
    beforeImg.src = beforeImage;
    beforeImg.alt = 'Before transformation';
    beforeSide.appendChild(beforeImg);

    // Create after side
    const afterSide = document.createElement('div');
    afterSide.className = 'slider-after';
    const afterImg = document.createElement('img');
    afterImg.src = afterImage;
    afterImg.alt = 'After transformation';
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

// Load and initialize before/after sliders
async function loadTransformationSliders() {
    const container = document.getElementById('transformationSlider');
    if (!container) return;

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
}

// Call the function when the page loads
window.addEventListener('load', loadTransformationSliders);
