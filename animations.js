document.addEventListener('DOMContentLoaded', function() {
    // Typing animation
    const textElement = document.querySelector('.typing-text');
    const cursor = document.querySelector('.cursor');
    const texts = [
        'Convert Text to Speech',
        'Listen to Your Content',
        'AI-Powered Voices',
        'Multiple Languages',
        'Natural Sounding'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let deleteSpeed = 50;
    let pauseTime = 2000;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Delete text
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = deleteSpeed;
        } else {
            // Type text
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        // Check if text is fully typed
        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            typingSpeed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
        
        // Set speed for next frame
        setTimeout(type, typingSpeed);
    }
    
    // Start the typing animation after a short delay
    setTimeout(type, 1000);
    
    // Cursor blink animation
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);
    
    // Animate sound wave bars
    const bars = document.querySelectorAll('.sound-wave .bar');
    setInterval(() => {
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 60) + 10;
            bar.style.height = `${randomHeight}px`;
        });
    }, 300);
});
