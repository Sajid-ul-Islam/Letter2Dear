/**
 * Visual effects and animations — hearts, fireflies, atmosphere, typewriter
 */

// Track active intervals for cleanup
const activeIntervals = [];
const activeTimeouts = [];
const atmosphereIntervals = [];
const themeIntervals = [];

function trackInterval(id) {
    activeIntervals.push(id);
    return id;
}

function trackTimeout(id) {
    activeTimeouts.push(id);
    return id;
}

const cleanupAtmosphereEffects = () => {
    atmosphereIntervals.forEach(clearInterval);
    atmosphereIntervals.length = 0;
    document.querySelectorAll('.atmosphere-element, .petal-element, .bird-fly').forEach(el => el.remove());
};

const cleanupThemeEffects = () => {
    themeIntervals.forEach(clearInterval);
    themeIntervals.length = 0;
    document.querySelectorAll('.theme-effect').forEach(el => el.remove());
};

export const Effects = {
    /** Currently running typewriter — set to a reject fn when active, null when idle */
    _skipResolve: null,

    createFloatingHeart: () => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '&#10084;&#65039;';
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 18 + 14) + 'px';
        document.body.appendChild(heart);
        trackTimeout(setTimeout(() => heart.remove(), 6000));
    },

    createFirefly: () => {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 5 + 8) + 's';
        document.body.appendChild(firefly);
        trackTimeout(setTimeout(() => firefly.remove(), 15000));
    },

    createBurst: () => {
        for (let i = 0; i < 4; i++) {
            trackTimeout(setTimeout(Effects.createFloatingHeart, i * 120));
        }
    },

    /**
     * Typewriter effect — can be skipped by calling Effects.skipTypewriter()
     */
    typewriterEffect: (element) => {
        return new Promise((resolve) => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            element.classList.add('typing-cursor');

            let i = 0;
            let skipped = false;

            Effects._skipResolve = () => {
                skipped = true;
                element.textContent = text;
                element.classList.remove('typing-cursor');
                resolve();
            };

            function typeChar() {
                if (skipped) return;
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    trackTimeout(setTimeout(typeChar, Math.random() * 35 + 18));
                } else {
                    element.classList.remove('typing-cursor');
                    Effects._skipResolve = null;
                    resolve();
                }
            }
            typeChar();
        });
    },

    skipTypewriter: () => {
        if (Effects._skipResolve) {
            Effects._skipResolve();
            Effects._skipResolve = null;
        }
    },

    initBackground: () => {
        trackInterval(setInterval(Effects.createFirefly, 1500));
        trackInterval(setInterval(() => {
            if (Math.random() > 0.5) Effects.createFloatingHeart();
        }, 2500));
    },

    /**
     * Set atmosphere effect — rain, petals, stars, birds.
     * Cleans up previous atmosphere before adding new one.
     */
    setAtmosphere: (type) => {
        cleanupAtmosphereEffects();

        if (type === 'none' || !type) return;

        const createAtmosphere = (generator, interval) => {
            atmosphereIntervals.push(setInterval(generator, interval));
        };

        if (type === 'rain') {
            createAtmosphere(() => {
                const drop = document.createElement('div');
                drop.className = 'atmosphere-element rain-drop';
                drop.style.left = Math.random() * 100 + 'vw';
                drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
                document.body.appendChild(drop);
                trackTimeout(setTimeout(() => drop.remove(), 1200));
            }, 60);
        }

        if (type === 'petals') {
            createAtmosphere(() => {
                const petal = document.createElement('div');
                petal.className = 'petal-element';
                const size = 8 + Math.random() * 10;
                petal.style.width = size + 'px';
                petal.style.height = size + 'px';
                petal.style.left = Math.random() * 100 + 'vw';
                petal.style.animationDuration = (6 + Math.random() * 8) + 's';
                const hue = 340 + Math.random() * 30; // pink-red range
                petal.style.background = `hsl(${hue}, 80%, 70%)`;
                document.body.appendChild(petal);
                trackTimeout(setTimeout(() => petal.remove(), 14000));
            }, 300);
        }

        if (type === 'stars') {
            for (let i = 0; i < 60; i++) {
                const star = document.createElement('div');
                star.className = 'atmosphere-element star-twinkle';
                star.style.left = Math.random() * 100 + 'vw';
                star.style.top = Math.random() * 100 + 'vh';
                star.style.animationDelay = Math.random() * 5 + 's';
                const size = 1 + Math.random() * 2;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                document.body.appendChild(star);
            }
        }

        if (type === 'birds') {
            createAtmosphere(() => {
                const bird = document.createElement('div');
                bird.className = 'atmosphere-element bird-fly';
                bird.textContent = '\uD83D\uDD4A\uFE0F';
                bird.style.top = (15 + Math.random() * 45) + 'vh';
                const dur = 10 + Math.random() * 12;
                bird.style.animationDuration = dur + 's';
                document.body.appendChild(bird);
                trackTimeout(setTimeout(() => bird.remove(), dur * 1000 + 500));
            }, 4000);
        }
    },

    /**
     * Set theme-specific ambient effects.
     */
    setThemeEffects: (theme) => {
        cleanupThemeEffects();

        const createThemeEffect = (generator, interval) => {
            themeIntervals.push(setInterval(generator, interval));
        };

        switch (theme) {
            case 'academia':
                createThemeEffect(() => {
                    const leaf = document.createElement('div');
                    leaf.className = 'theme-effect falling-leaf';
                    leaf.innerHTML = '&#127809;'; // 🍂
                    leaf.style.left = Math.random() * 100 + 'vw';
                    leaf.style.animationDuration = (8 + Math.random() * 7) + 's';
                    leaf.style.transform = `scale(${0.8 + Math.random() * 0.5}) rotate(${Math.random() * 360}deg)`;
                    document.body.appendChild(leaf);
                    trackTimeout(setTimeout(() => leaf.remove(), 15000));
                }, 800);
                break;

            case 'cyberpunk':
                createThemeEffect(() => {
                    const char = document.createElement('div');
                    char.className = 'theme-effect binary-char';
                    char.textContent = Math.random() > 0.5 ? '0' : '1';
                    char.style.left = Math.random() * 100 + 'vw';
                    char.style.animationDuration = (3 + Math.random() * 4) + 's';
                    document.body.appendChild(char);
                    trackTimeout(setTimeout(() => char.remove(), 7000));
                }, 100);
                break;

            case 'minimalist':
                createThemeEffect(() => {
                    const line = document.createElement('div');
                    line.className = 'theme-effect minimal-line';
                    line.style.left = Math.random() * 100 + 'vw';
                    line.style.width = (50 + Math.random() * 100) + 'px';
                    line.style.animationDuration = (10 + Math.random() * 10) + 's';
                    line.style.transform = `rotate(${Math.random() * 90 - 45}deg)`;
                    document.body.appendChild(line);
                    trackTimeout(setTimeout(() => line.remove(), 20000));
                }, 1200);
                break;
        }
    },

    /**
     * Clean up all effects — call when leaving viewer
     */
    cleanup: () => {
        activeIntervals.forEach(clearInterval);
        activeTimeouts.forEach(clearTimeout);
        activeIntervals.length = 0;
        activeTimeouts.length = 0;
        document.querySelectorAll('.heart, .firefly').forEach(el => el.remove());
        cleanupAtmosphereEffects();
        cleanupThemeEffects();
    }
};
