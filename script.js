document.addEventListener('DOMContentLoaded', function () {
    const editorMode = document.getElementById('editorMode');
    const viewerMode = document.getElementById('viewerMode');
    const letterInput = document.getElementById('letterInput');
    const letterText = document.getElementById('letterText');
    const generateLinkBtn = document.getElementById('generateLinkBtn');
    const previewBtn = document.getElementById('previewBtn');
    const backToEditor = document.getElementById('backToEditor');
    const startBtn = document.getElementById('startBtn');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const shareStatus = document.getElementById('shareStatus');
    
    let currentTheme = 'default';
    let animationStarted = false;

    // --- Initialization ---
    
    // Check for existing message in URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedMsg = urlParams.get('msg');
    const themeParam = urlParams.get('theme');

    if (encodedMsg) {
        try {
            const decodedMsg = decodeURIComponent(escape(atob(encodedMsg)));
            letterInput.value = decodedMsg;
            if (themeParam) {
                setTheme(themeParam);
            }
            showViewer(decodedMsg);
        } catch (e) {
            console.error("Failed to decode message", e);
            showEditor();
        }
    } else {
        showEditor();
    }

    // --- Mode Switching ---

    function showEditor() {
        editorMode.style.display = 'flex';
        viewerMode.style.display = 'none';
        backToEditor.style.display = 'none';
        startBtn.style.display = 'none';
        document.getElementById('pageTitle').textContent = "তোমার জন্য";
        document.getElementById('pageSubtitle').textContent = "Create Your Masterpiece";
    }

    function showViewer(msg) {
        editorMode.style.display = 'none';
        viewerMode.style.display = 'flex';
        backToEditor.style.display = 'inline-block';
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Begin Your Journey';
        document.getElementById('pageTitle').textContent = "তোমার জন্য";
        document.getElementById('pageSubtitle').textContent = "For My Love 💕";
        
        // Prepare letter text
        letterText.innerHTML = '';
        const lines = msg.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.className = 'paragraph';
            p.textContent = line;
            letterText.appendChild(p);
        });
    }

    // --- Theme Logic ---

    function setTheme(theme) {
        currentTheme = theme;
        document.body.className = `theme-${theme}`;
        
        themeBtns.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    // --- Action Handlers ---

    previewBtn.addEventListener('click', () => {
        const msg = letterInput.value.trim();
        if (!msg) return alert("Please write something first!");
        showViewer(msg);
    });

    backToEditor.addEventListener('click', () => {
        showEditor();
    });

    generateLinkBtn.addEventListener('click', () => {
        const msg = letterInput.value.trim();
        if (!msg) return alert("Write a message first!");
        
        try {
            const encoded = btoa(unescape(encodeURIComponent(msg)));
            const url = new URL(window.location.href);
            url.searchParams.set('msg', encoded);
            url.searchParams.set('theme', currentTheme);
            
            navigator.clipboard.writeText(url.toString()).then(() => {
                shareStatus.textContent = "Link copied to clipboard! 💝";
                setTimeout(() => shareStatus.textContent = "", 3000);
            });
        } catch (e) {
            alert("Could not generate link. Try shorter text.");
        }
    });

    startBtn.addEventListener('click', () => {
        if (!animationStarted) {
            startLetterAnimation();
        }
    });

    // --- Animations (Enhanced from original) ---

    async function startLetterAnimation() {
        const paragraphs = document.querySelectorAll('.paragraph');
        animationStarted = true;
        startBtn.textContent = 'Reading...';
        startBtn.classList.add('loading');

        for (let i = 0; i < paragraphs.length; i++) {
            const p = paragraphs[i];
            p.classList.add('fade-in');
            createBurstEffect();
            await typewriterEffect(p);
            await new Promise(r => setTimeout(r, 600));
        }

        startBtn.textContent = 'Read Again';
        startBtn.classList.remove('loading');
        animationStarted = false;
    }

    function typewriterEffect(element) {
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
    }

    // --- Visual Effects ---

    function createBurstEffect() {
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingHeart, i * 150);
        }
    }

    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 6000);
    }

    function createFirefly() {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';
        firefly.style.animationDuration = (Math.random() * 5 + 10) + 's';
        document.body.appendChild(firefly);
        setTimeout(() => firefly.remove(), 15000);
    }

    setInterval(createFirefly, 1200);
    setInterval(() => {
        if (Math.random() > 0.5) createFloatingHeart();
    }, 2000);

    console.log('Premium Love Letter App Initialized! 💖');
});

