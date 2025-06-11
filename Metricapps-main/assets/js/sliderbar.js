function setupSlider(container) {

    const slider = container.querySelector('.custom-slider');
    const bubble = container.querySelector('.value-bubble');
    const tickMarks = container.querySelector('.ticks');
    const subtickMarks = container.querySelector('.subticks');
    const tickLabels = container.querySelector('.tick-labels');

    function updateBubble() {
        const val = slider.value;
        const min = +slider.min;
        const max = +slider.max;
        const percent = (val - min) / (max - min);

        slider.style.setProperty('--percent', `${percent * 100}%`);
        bubble.textContent = val;

        // Accurate thumb position
        const sliderWidth = slider.offsetWidth;
        const bubbleWidth = bubble.offsetWidth;
        const thumbWidth = 25; // match your CSS thumb width
        const thumbCenter = percent * (sliderWidth - thumbWidth) + thumbWidth / 2;

        // Center bubble on thumb
        const bubbleLeft = thumbCenter ;
        bubble.style.left = `${bubbleLeft}px`;
    }

    function generateTicks() {

        const min = +slider.min;
        const max = +slider.max;
        const numMainTicks = 11;
        const mainStep = (max - min) / (numMainTicks - 1);

        tickMarks.innerHTML = '';
        subtickMarks.innerHTML = '';
        tickLabels.innerHTML = '';

        // Main ticks and labels
        for (let i = 0; i < numMainTicks; i++) {
            const value = Math.round(min + i * mainStep);

            const mark = document.createElement('div');
            mark.className = 'tick-mark';
            tickMarks.appendChild(mark);

            const label = document.createElement('span');
            label.textContent = value;
            label.style.left = `${(i / (numMainTicks - 1)) * 100}%`;
            tickLabels.appendChild(label);
        }

        // Subticks
        const numSubticks = 2 * numMainTicks - 1;
        for (let i = 0; i < numSubticks; i++) {
            const subtick = document.createElement('div');
            subtick.className = 'subtick-mark';
            subtickMarks.appendChild(subtick);
        }
    }

    slider.addEventListener('input', updateBubble);
    window.addEventListener('resize', updateBubble);

    generateTicks();
    updateBubble();
}

// Initialize all sliders on the page
document.querySelectorAll('.slider-container').forEach(setupSlider);