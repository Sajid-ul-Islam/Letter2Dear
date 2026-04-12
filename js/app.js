import { Utils } from './utils.js';
import { Effects } from './effects.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const elements = {
        editorMode: document.getElementById('editorMode'),
        viewerMode: document.getElementById('viewerMode'),
        lockedMode: document.getElementById('lockedMode'),
        letterArea: document.getElementById('letterArea'),
        envelopeWrapper: document.getElementById('envelopeWrapper'),
        openEnvelopeBtn: document.getElementById('openEnvelopeBtn'),
        letterInput: document.getElementById('letterInput'),
        letterText: document.getElementById('letterText'),
        generateLinkBtn: document.getElementById('generateLinkBtn'),
        previewBtn: document.getElementById('previewBtn'),
        backToEditor: document.getElementById('backToEditor'),
        backToHome: document.getElementById('backToHome'),
        startBtn: document.getElementById('startBtn'),
        themeBtns: document.querySelectorAll('.theme-btn'),
        shareStatus: document.getElementById('shareStatus'),
        shareOptions: document.getElementById('shareOptions'),
        whatsappBtn: document.getElementById('whatsappBtn'),
        telegramBtn: document.getElementById('telegramBtn'),
        pageTitle: document.getElementById('pageTitle'),
        pageSubtitle: document.getElementById('pageSubtitle'),
        countdownTimer: document.getElementById('countdownTimer')
    };

    let state = {
        currentTheme: 'default',
        isAnimating: false,
        cachedMsg: null
    };

    // --- Safety Check ---
    for (let key in elements) {
        if (!elements[key] && key !== 'themeBtns') {
            console.warn(`Element ${key} not found in HTML!`);
        }
    }

    // --- Core Logic ---

    const setTheme = (theme) => {
        state.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        elements.themeBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
        });
    };

    const showEditor = () => {
        elements.editorMode.style.display = 'flex';
        elements.viewerMode.style.display = 'none';
        elements.lockedMode.style.display = 'none';
        elements.backToEditor.style.display = 'none';
        elements.startBtn.style.display = 'none';
        elements.pageTitle.textContent = "তোমার জন্য";
        elements.pageSubtitle.textContent = "Create Your Masterpiece";
    };

    const showViewer = (msg) => {
        elements.editorMode.style.display = 'none';
        elements.viewerMode.style.display = 'flex';
        elements.backToEditor.style.display = 'inline-block';
        elements.startBtn.style.display = 'inline-block';
        elements.startBtn.textContent = 'Begin Your Journey';
        elements.pageSubtitle.textContent = "For My Love 💕";
        
        elements.letterText.innerHTML = '';
        const lines = msg.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
            const p = document.createElement('p');
            p.className = 'paragraph';
            p.textContent = line;
            elements.letterText.appendChild(p);
        });
    };

    const startLetterAnimation = async () => {
        if (state.isAnimating) return;
        
        const paragraphs = document.querySelectorAll('.paragraph');
        state.isAnimating = true;
        elements.startBtn.textContent = 'Reading...';
        elements.startBtn.classList.add('loading');

        for (const p of paragraphs) {
            p.classList.add('fade-in');
            Effects.createBurst();
            await Effects.typewriterEffect(p);
            await new Promise(r => setTimeout(r, 600));
        }

        elements.startBtn.textContent = 'Read Again';
        elements.startBtn.classList.remove('loading');
        state.isAnimating = false;
    };

    const showLocked = (targetDate) => {
        elements.editorMode.style.display = 'none';
        elements.viewerMode.style.display = 'none';
        elements.lockedMode.style.display = 'flex';
        
        const updateTimer = () => {
            const now = new Date();
            const diff = targetDate - now;
            if (diff <= 0) {
                window.location.reload();
                return;
            }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            elements.countdownTimer.textContent = `${h}h ${m}m ${s}s`;
        };
        updateTimer();
        setInterval(updateTimer, 1000);
    };

    const showEnvelope = () => {
        elements.editorMode.style.display = 'none';
        elements.viewerMode.style.display = 'flex';
        elements.envelopeWrapper.style.display = 'flex';
        elements.envelopeWrapper.style.opacity = '1';
        elements.letterArea.style.display = 'none';
        elements.backToEditor.style.display = 'inline-block';
        elements.startBtn.style.display = 'none';
        
        const env = document.querySelector('.envelope');
        if (env) env.classList.remove('open');
        if (elements.openEnvelopeBtn) elements.openEnvelopeBtn.style.display = 'block';
    };

    // --- Init ---

    const init = async () => {
        Effects.initBackground();

        const msgParam = Utils.getQueryParam('msg');
        const themeParam = Utils.getQueryParam('theme');
        const passParam = Utils.getQueryParam('p');
        const atmosphereParam = Utils.getQueryParam('a');
        const dateParam = Utils.getQueryParam('d');
        const imgParam = Utils.getQueryParam('img');
        const musicParam = Utils.getQueryParam('m');
        const fontParam = Utils.getQueryParam('f');
        const couponParam = Utils.getQueryParam('c');

        if (msgParam) {
            const decoded = Utils.decodeMessage(msgParam);
            if (decoded) {
                state.cachedMsg = decoded;
                
                if (dateParam) {
                    const unlockDate = new Date(dateParam);
                    if (new Date() < unlockDate) { showLocked(unlockDate); return; }
                }

                if (passParam) {
                    const input = prompt("This letter is password protected. Enter the secret word:");
                    if (input !== passParam) {
                        alert("Wrong password!");
                        window.location.search = "";
                        return;
                    }
                }

                if (themeParam) setTheme(themeParam);
                if (atmosphereParam) Effects.setAtmosphere(atmosphereParam);
                if (musicParam) setMusic(musicParam);
                if (fontParam) setFont(fontParam);
                if (couponParam) setCoupon(couponParam);

                if (imgParam) {
                    const imgEl = document.getElementById('letterImage');
                    if (imgEl) {
                        imgEl.src = decodeURIComponent(imgParam);
                        document.getElementById('polaroid').style.display = 'block';
                    }
                }
                
                showEnvelope();
            } else {
                showEditor();
            }
        } else {
            showEditor();
        }

        // Reactions
        document.querySelectorAll('.react-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reply = btn.getAttribute('data-reply');
                const text = encodeURIComponent(reply + "\n\n(Replying to your love letter 💌)");
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            });
        });

        elements.openEnvelopeBtn?.addEventListener('click', () => {
            const env = document.querySelector('.envelope');
            if (env) env.classList.add('open');
            elements.openEnvelopeBtn.style.display = 'none';
            
            // Play Music
            const audio = document.getElementById('bgMusic');
            if (audio.src) audio.play().catch(e => console.log("Audio play blocked"));

            setTimeout(() => {
                elements.envelopeWrapper.style.opacity = '0';
                setTimeout(() => {
                    elements.envelopeWrapper.style.display = 'none';
                    elements.letterArea.style.display = 'block';
                    document.getElementById('reactionBar').style.display = 'block';
                    showViewer(state.cachedMsg);
                }, 800);
            }, 1000);
        });

        elements.backToHome?.addEventListener('click', () => {
            window.location.search = "";
        });

        elements.themeBtns.forEach(btn => {
            btn.addEventListener('click', () => setTheme(btn.getAttribute('data-theme')));
        });

        elements.previewBtn?.addEventListener('click', async () => {
            const msg = elements.letterInput.value.trim();
            const atmosphere = document.getElementById('atmosphereSelect')?.value;
            const music = document.getElementById('musicSelect')?.value;
            const font = document.getElementById('fontSelect')?.value;
            const coupon = document.getElementById('couponSelect')?.value;
            const imgUrl = document.getElementById('imageUrl')?.value.trim();
            const fileInput = document.getElementById('imageUpload');
            
            if (msg) {
                state.cachedMsg = msg;
                if (atmosphere && atmosphere !== 'none') Effects.setAtmosphere(atmosphere);
                if (music) setMusic(music);
                if (font) setFont(font);
                if (coupon) setCoupon(coupon);

                const imgEl = document.getElementById('letterImage');
                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imgEl.src = e.target.result;
                        document.getElementById('polaroid').style.display = 'block';
                        showEnvelope();
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else if (imgUrl) {
                    imgEl.src = imgUrl;
                    document.getElementById('polaroid').style.display = 'block';
                    showEnvelope();
                } else {
                    document.getElementById('polaroid').style.display = 'none';
                    showEnvelope();
                }
            }
            else alert("Write something first! ❤️");
        });

        elements.backToEditor?.addEventListener('click', showEditor);
        elements.startBtn?.addEventListener('click', startLetterAnimation);

        elements.generateLinkBtn?.addEventListener('click', async () => {
            const msg = elements.letterInput.value.trim();
            if (!msg) return alert("Write a message first!");

            const encoded = Utils.encodeMessage(msg);
            const password = document.getElementById('letterPass')?.value.trim();
            const atmosphere = document.getElementById('atmosphereSelect')?.value;
            const music = document.getElementById('musicSelect')?.value;
            const font = document.getElementById('fontSelect')?.value;
            const coupon = document.getElementById('couponSelect')?.value;
            const unlockDate = document.getElementById('unlockDate')?.value;
            const imgUrl = document.getElementById('imageUrl')?.value.trim();
            const fileInput = document.getElementById('imageUpload');

            const url = new URL(window.location.href);
            url.searchParams.set('msg', encoded);
            url.searchParams.set('theme', state.currentTheme);
            if (password) url.searchParams.set('p', password);
            if (atmosphere && atmosphere !== 'none') url.searchParams.set('a', atmosphere);
            if (music && music !== 'none') url.searchParams.set('m', music);
            if (font) url.searchParams.set('f', font);
            if (coupon && coupon !== 'none') url.searchParams.set('c', coupon);
            if (unlockDate) url.searchParams.set('d', unlockDate);
            
            if (fileInput.files && fileInput.files[0]) {
                if (fileInput.files[0].size > 50000) {
                    return alert("Photo is too large! Please use a smaller image (<50KB).");
                }
                const reader = new FileReader();
                reader.onload = async (e) => {
                    url.searchParams.set('img', encodeURIComponent(e.target.result));
                    await generateAndCopy(url);
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                if (imgUrl) url.searchParams.set('img', encodeURIComponent(imgUrl));
                await generateAndCopy(url);
            }
        });
    };

    const setMusic = (type) => {
        const audio = document.getElementById('bgMusic');
        const links = {
            'romantic': 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
            'lofi': 'https://www.bensound.com/bensound-music/bensound-lofi.mp3',
            'violin': 'https://www.bensound.com/bensound-music/bensound-emotional.mp3',
            'nature': 'https://www.bensound.com/bensound-music/bensound-nature.mp3'
        };
        if (links[type]) audio.src = links[type];
        else audio.src = "";
    };

    const setFont = (font) => {
        elements.letterText.className = `letter-text font-${font}`;
    };

    const setCoupon = (type) => {
        const names = {
            'hug': 'One Giant Hug ❤️',
            'dinner': 'Fancy Dinner Date 🍴',
            'coffee': 'Coffee Morning ☕',
            'movie': 'Movie Night 🍿',
            'custom': 'Your Special Gift 🎁'
        };
        if (names[type]) {
            document.getElementById('couponText').textContent = names[type];
            document.getElementById('loveCoupon').style.display = 'block';
        } else {
            document.getElementById('loveCoupon').style.display = 'none';
        }
    };

    const generateAndCopy = async (url) => {
        elements.shareStatus.textContent = "Shortening link... ⏳";
        const shareUrl = await Utils.shortenUrl(url.toString());

        if (await Utils.copyToClipboard(shareUrl)) {
            elements.shareStatus.textContent = "Short link copied! 💝";
            elements.shareOptions.style.display = 'flex';

            elements.whatsappBtn.onclick = () => {
                const text = encodeURIComponent("I have written a special, locked letter for you... 💖\n\nRead it here: " + shareUrl);
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            };

            elements.telegramBtn.onclick = () => {
                const text = encodeURIComponent("I have written a special letter for you... 💖");
                window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
            };
            setTimeout(() => elements.shareStatus.textContent = "", 5000);
        }
    };

    init();
});
