/**
 * Visual effects and animations
 */
export const Effects = {
    createFloatingHeart: () => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    },

    createFirefly: () => {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 5 + 10) + 's';
        document.body.appendChild(firefly);
        setTimeout(() => firefly.remove(), 15000);
    },

    createBurst: () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(Effects.createFloatingHeart, i * 150);
        }
    },

    typewriterEffect: (element) => {
        return new Promise(resolve => {
            const text = element.textContent;
            element.textContent = '';
            element.style.opacity = '1';
            element.classList.add('typing-cursor');

            let i = 0;
            function typeChar() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeChar, Math.random() * 40 + 20);
                } else {
                    element.classList.remove('typing-cursor');
                    resolve();
                }
            }
            typeChar();
        });
    },

    initBackground: () => {
        setInterval(Effects.createFirefly, 1200);
        setInterval(() => {
            if (Math.random() > 0.5) Effects.createFloatingHeart();
        }, 2000);
    },

    setAtmosphere: (type) => {
        // Clear existing atmospheres
        const existing = document.querySelectorAll('.atmosphere-element');
        existing.forEach(el => el.remove());
        
        if (type === 'rain') {
            setInterval(() => {
                const drop = document.createElement('div');
                drop.className = 'atmosphere-element rain-drop';
                drop.style.left = Math.random() * 100 + 'vw';
                drop.style.animationDuration = (0.5 + Math.random() * 0.5) + 's';
                document.body.appendChild(drop);
                setTimeout(() => drop.remove(), 1000);
            }, 50);
        } else if (type === 'stars') {
            for (let i = 0; i < 50; i++) {
                const star = document.createElement('div');
                star.className = 'atmosphere-element star-twinkle';
                star.style.left = Math.random() * 100 + 'vw';
                star.style.top = Math.random() * 100 + 'vh';
                star.style.animationDelay = Math.random() * 5 + 's';
                document.body.appendChild(star);
            }
        } else if (type === 'birds') {
            setInterval(() => {
                const bird = document.createElement('div');
                bird.className = 'atmosphere-element bird-fly';
                bird.textContent = '🕊️';
                bird.style.top = (20 + Math.random() * 40) + 'vh';
                bird.style.animationDuration = (10 + Math.random() * 10) + 's';
                document.body.appendChild(bird);
                setTimeout(() => bird.remove(), 20000);
            }, 5000);
        }
    }
};
