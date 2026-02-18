document.addEventListener('DOMContentLoaded', function () {
    const startBtn = document.getElementById('startBtn');
    const paragraphs = document.querySelectorAll('.paragraph');
    let animationStarted = false;

    // Create floating hearts dynamically
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 3 + 's';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        document.body.appendChild(heart);

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 4000);
    }

    // Create floating flowers dynamically
    function createFloatingFlower() {
        const flowers = ['🌸', '🌺', '🌹', '🌷', '🌻'];
        const flower = document.createElement('div');
        flower.className = 'flower-element';
        flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
        flower.style.left = Math.random() * 100 + '%';
        flower.style.animationDelay = Math.random() * 4 + 's';
        flower.style.fontSize = (Math.random() * 15 + 20) + 'px';
        document.body.appendChild(flower);

        setTimeout(() => {
            flower.remove();
        }, 6000);
    }

    // Create floating love symbols dynamically
    function createFloatingLove() {
        const symbols = ['💕', '💖', '💗', '💝', '💞'];
        const love = document.createElement('div');
        love.className = 'love-symbol';
        love.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        love.style.left = Math.random() * 100 + '%';
        love.style.animationDelay = Math.random() * 3 + 's';
        love.style.fontSize = (Math.random() * 10 + 15) + 'px';
        document.body.appendChild(love);

        setTimeout(() => {
            love.remove();
        }, 5000);
    }

    // Create floating elements periodically
    setInterval(createFloatingHeart, 2000);
    setInterval(createFloatingFlower, 3000);
    setInterval(createFloatingLove, 2500);

    // Auto-start animation after page loads
    setTimeout(() => {
        if (!animationStarted) {
            startLetterAnimation();
            animationStarted = true;
            startBtn.textContent = 'Reading in Progress...';
            startBtn.classList.add('loading');
        }
    }, 1000); // Start after 1 second

    // Start button functionality (for manual restart)
    startBtn.addEventListener('click', function () {
        if (!animationStarted) {
            startLetterAnimation();
            animationStarted = true;
            startBtn.textContent = 'Reading in Progress...';
            startBtn.classList.add('loading');
        }
    });

    // Animate letter paragraphs sequentially
    async function startLetterAnimation() {
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];

            // Add fade-in class to make it visible (but empty content initially handled by typewriter)
            paragraph.classList.add('fade-in');

            // Create burst of effects
            createBurstEffect();

            // Wait for typing to complete before showing next paragraph
            await typewriterEffect(paragraph);

            // Add special effect to the highlight paragraph after typing
            if (paragraph.classList.contains('highlight')) {
                createSpecialEffect();
            }

            // Small pause between paragraphs
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Re-enable button after animation completes
        startBtn.textContent = 'Read Again';
        startBtn.classList.remove('loading');
        animationStarted = false;
    }

    // Realistic Typewriter effect
    function typewriterEffect(element) {
        return new Promise(resolve => {
            const text = element.getAttribute('data-text') || element.textContent;
            // Store text in data attribute if not already there
            if (!element.getAttribute('data-text')) {
                element.setAttribute('data-text', text);
            }

            element.textContent = '';
            element.style.opacity = '1';
            element.classList.add('typing-cursor');

            let i = 0;

            function typeChar() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    // Random typing speed for realism (30ms to 80ms)
                    const randomDelay = Math.random() * 50 + 30;
                    setTimeout(typeChar, randomDelay);
                } else {
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }

            // Start typing
            typeChar();
        });
    }

    // Create burst effect for each paragraph
    function createBurstEffect() {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingHeart();
                createFloatingFlower();
            }, i * 200);
        }
    }

    // Special effect for the final highlight paragraph
    function createSpecialEffect() {
        // Create massive burst of hearts and flowers
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                createFloatingHeart();
                createFloatingFlower();
                createFloatingLove();
            }, i * 100);
        }

        // Add glow effect to the paragraph
        const highlightParagraph = document.querySelector('.paragraph.highlight');
        if (highlightParagraph) {
            highlightParagraph.style.animation = 'pulse 2s ease-in-out infinite, textGlow 3s ease-in-out infinite';

            // Add rainbow effect
            setTimeout(() => {
                highlightParagraph.style.background = 'linear-gradient(45deg, rgba(255, 107, 107, 0.1), rgba(255, 182, 193, 0.1), rgba(214, 51, 132, 0.1))';
                highlightParagraph.style.backgroundSize = '200% 200%';
                highlightParagraph.style.animation = 'pulse 2s ease-in-out infinite, textGlow 3s ease-in-out infinite, rainbow 3s ease-in-out infinite';
            }, 1000);
        }
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!animationStarted) {
                startBtn.click();
            }
        }
    });

    // Add mouse move effect for subtle parallax
    document.addEventListener('mousemove', function (e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const floatingHearts = document.querySelector('.floating-hearts');
        const particles = document.querySelector('.particles');

        if (floatingHearts) {
            floatingHearts.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        }
        if (particles) {
            particles.style.transform = `translate(${-x * 5}px, ${-y * 5}px)`;
        }
    });

    // Add scroll-based animations
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function () {
        const currentScrollY = window.scrollY;
        const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

        // Add subtle effects based on scroll direction
        const letterContent = document.querySelector('.letter-content');
        if (letterContent) {
            if (scrollDirection === 'down') {
                letterContent.style.transform = `translateY(${Math.min(currentScrollY * 0.1, 20)}px)`;
            } else {
                letterContent.style.transform = `translateY(${Math.max(currentScrollY * 0.1, -20)}px)`;
            }
        }

        lastScrollY = currentScrollY;
    });

    // Add rainbow animation for highlight paragraph
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 5px 15px rgba(214, 51, 132, 0.2);
            }
            50% {
                transform: scale(1.02);
                box-shadow: 0 8px 25px rgba(214, 51, 132, 0.4);
            }
        }
        
        @keyframes rainbow {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-start animation after a delay
    setTimeout(() => {
        if (!animationStarted) {
            startLetterAnimation();
            animationStarted = true;
            startBtn.textContent = 'Reading in Progress...';
            startBtn.classList.add('loading');
        }
    }, 1000);

    // Add touch support for mobile devices
    let touchStartY = 0;
    document.addEventListener('touchstart', function (e) {
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', function (e) {
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;

        // Swipe up to start animation
        if (Math.abs(swipeDistance) > 50 && !animationStarted) {
            startLetterAnimation();
            animationStarted = true;
            startBtn.textContent = 'Reading in Progress...';
            startBtn.classList.add('loading');
        }
    });

    // Create additional visual effects
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.fontSize = (Math.random() * 10 + 5) + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '5';
        sparkle.style.animation = 'sparkle 2s ease-in-out';
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 2000);
    }

    // Create firefly effect
    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';

        // Random animation duration and delay
        firefly.style.animationDuration = (Math.random() * 5 + 5) + 's';
        firefly.style.animationDelay = Math.random() * 5 + 's';

        document.body.appendChild(firefly);

        // Cleanup
        setTimeout(() => {
            firefly.remove();
        }, 15000);
    }

    // Create fireflies periodically
    setInterval(createFirefly, 1000);

    console.log('Romantic Letter Animation Loaded Successfully! ❤️');
});
