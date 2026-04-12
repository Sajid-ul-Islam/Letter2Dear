import { Utils } from './utils.js';
import { Effects } from './effects.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const $ = (id) => document.getElementById(id);
    const el = {
        editorMode: $('editorMode'),
        viewerMode: $('viewerMode'),
        lockedMode: $('lockedMode'),
        letterArea: $('letterArea'),
        envelopeWrapper: $('envelopeWrapper'),
        openEnvelopeBtn: $('openEnvelopeBtn'),
        letterInput: $('letterInput'),
        letterText: $('letterText'),
        generateLinkBtn: $('generateLinkBtn'),
        previewBtn: $('previewBtn'),
        backToEditor: $('backToEditor'),
        backToHome: $('backToHome'),
        startBtn: $('startBtn'),
        shareStatus: $('shareStatus'),
        shareOptions: $('shareOptions'),
        whatsappBtn: $('whatsappBtn'),
        telegramBtn: $('telegramBtn'),
        pageTitle: $('pageTitle'),
        pageSubtitle: $('pageSubtitle'),
        countdownTimer: $('countdownTimer'),
        charCount: $('charCount'),
        welcomeBanner: $('welcomeBanner'),
        progressBar: $('progressBar'),
        letterProgress: $('letterProgress'),
        skipBtn: $('skipBtn'),
        // Password modal
        passwordModal: $('passwordModal'),
        passwordInput: $('passwordInput'),
        passwordSubmit: $('passwordSubmit'),
        passwordCancel: $('passwordCancel'),
        passwordError: $('passwordError'),
    };

    const themeBtns = document.querySelectorAll('.theme-btn');

    let state = {
        currentTheme: 'default',
        isAnimating: false,
        cachedMsg: null,
        countdownInterval: null,
    };

    // --- Helpers ---

    const setTheme = (theme) => {
        state.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        themeBtns.forEach(btn => {
            const isActive = btn.dataset.theme === theme;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-checked', isActive);
        });
    };

    const setMusic = (type) => {
        const audio = $('bgMusic');
        if (!audio) return;
        const tracks = {
            romantic: 'https://www.bensound.com/bensound-music/bensound-romantic.mp3',
            lofi: 'https://www.bensound.com/bensound-music/bensound-lofi.mp3',
            violin: 'https://www.bensound.com/bensound-music/bensound-emotional.mp3',
            nature: 'https://www.bensound.com/bensound-music/bensound-nature.mp3',
        };
        audio.src = tracks[type] || '';
    };

    const setFont = (font) => {
        if (el.letterText) {
            el.letterText.className = `letter-text font-${font}`;
        }
    };

    const setCoupon = (type) => {
        const names = {
            hug: 'One Giant Hug',
            dinner: 'Fancy Dinner Date',
            coffee: 'Coffee Morning',
            movie: 'Movie Night',
            custom: 'Your Special Gift',
        };
        const couponEl = $('loveCoupon');
        const couponText = $('couponText');
        if (names[type]) {
            couponText.textContent = names[type];
            couponEl.style.display = 'block';
        } else {
            couponEl.style.display = 'none';
        }
    };

    // --- Mode Switching ---

    const showEditor = () => {
        el.editorMode.style.display = 'flex';
        el.viewerMode.style.display = 'none';
        el.lockedMode.style.display = 'none';
        el.backToEditor.style.display = 'none';
        el.startBtn.style.display = 'none';
        el.pageTitle.textContent = 'তোমার জন্য';
        el.pageSubtitle.textContent = 'Create Your Masterpiece';

        // Restore draft
        const draft = Utils.loadDraft();
        if (draft && !el.letterInput.value) {
            el.letterInput.value = draft.message || '';
            if (draft.theme) setTheme(draft.theme);
            updateCharCount();
        }
    };

    const showViewer = (msg) => {
        el.editorMode.style.display = 'none';
        el.viewerMode.style.display = 'flex';
        el.backToEditor.style.display = 'inline-block';
        el.startBtn.style.display = 'inline-block';
        el.startBtn.textContent = 'Begin Your Journey';
        el.pageSubtitle.textContent = 'For My Love';

        // Render paragraphs safely
        el.letterText.innerHTML = '';
        const lines = msg.split('\n').filter(l => l.trim());
        lines.forEach(line => {
            const p = document.createElement('p');
            p.className = 'paragraph';
            p.textContent = line; // safe — textContent, not innerHTML
            el.letterText.appendChild(p);
        });

        // Reset progress
        if (el.progressBar) el.progressBar.style.width = '0%';
    };

    const showEnvelope = () => {
        el.editorMode.style.display = 'none';
        el.viewerMode.style.display = 'flex';
        el.envelopeWrapper.style.display = 'flex';
        el.envelopeWrapper.style.opacity = '1';
        el.letterArea.style.display = 'none';
        el.backToEditor.style.display = 'inline-block';
        el.startBtn.style.display = 'none';
        el.skipBtn.style.display = 'none';

        const env = document.querySelector('.envelope');
        if (env) env.classList.remove('open');
        if (el.openEnvelopeBtn) el.openEnvelopeBtn.style.display = 'block';
    };

    const showLocked = (targetDate) => {
        el.editorMode.style.display = 'none';
        el.viewerMode.style.display = 'none';
        el.lockedMode.style.display = 'flex';

        const updateTimer = () => {
            const diff = targetDate - new Date();
            if (diff <= 0) {
                clearInterval(state.countdownInterval);
                window.location.reload();
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            el.countdownTimer.textContent = d > 0
                ? `${d}d ${h}h ${m}m ${s}s`
                : `${h}h ${m}m ${s}s`;
        };
        updateTimer();
        state.countdownInterval = setInterval(updateTimer, 1000);
    };

    // --- Password Modal ---

    const showPasswordModal = () => {
        return new Promise((resolve) => {
            el.passwordModal.style.display = 'flex';
            el.passwordInput.value = '';
            el.passwordError.textContent = '';
            el.passwordInput.focus();

            const cleanup = () => {
                el.passwordModal.style.display = 'none';
                el.passwordSubmit.removeEventListener('click', onSubmit);
                el.passwordCancel.removeEventListener('click', onCancel);
                el.passwordInput.removeEventListener('keydown', onKeydown);
            };

            const onSubmit = () => {
                const val = el.passwordInput.value;
                cleanup();
                resolve(val);
            };

            const onCancel = () => {
                cleanup();
                resolve(null);
            };

            const onKeydown = (e) => {
                if (e.key === 'Enter') onSubmit();
                if (e.key === 'Escape') onCancel();
            };

            el.passwordSubmit.addEventListener('click', onSubmit);
            el.passwordCancel.addEventListener('click', onCancel);
            el.passwordInput.addEventListener('keydown', onKeydown);
        });
    };

    // --- Letter Animation ---

    const startLetterAnimation = async () => {
        if (state.isAnimating) return;

        const paragraphs = document.querySelectorAll('.paragraph');
        if (!paragraphs.length) return;

        state.isAnimating = true;
        el.startBtn.textContent = 'Reading...';
        el.startBtn.classList.add('loading');
        el.skipBtn.style.display = 'block';

        const total = paragraphs.length;

        for (let i = 0; i < total; i++) {
            const p = paragraphs[i];
            p.classList.add('fade-in');
            Effects.createBurst();
            await Effects.typewriterEffect(p);

            // Update progress
            if (el.progressBar) {
                el.progressBar.style.width = ((i + 1) / total * 100) + '%';
            }

            if (i < total - 1) {
                await new Promise(r => setTimeout(r, 500));
            }
        }

        el.startBtn.textContent = 'Read Again';
        el.startBtn.classList.remove('loading');
        el.skipBtn.style.display = 'none';
        state.isAnimating = false;
    };

    const skipAnimation = () => {
        Effects.skipTypewriter();
        // Reveal all remaining paragraphs instantly
        document.querySelectorAll('.paragraph').forEach(p => {
            p.classList.add('fade-in');
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        });
        if (el.progressBar) el.progressBar.style.width = '100%';
        el.startBtn.textContent = 'Read Again';
        el.startBtn.classList.remove('loading');
        el.skipBtn.style.display = 'none';
        state.isAnimating = false;
    };

    // --- Character Counter ---

    const updateCharCount = () => {
        const len = el.letterInput.value.length;
        el.charCount.textContent = `${len} / 5000`;
        el.charCount.classList.toggle('near-limit', len > 4000 && len <= 5000);
        el.charCount.classList.toggle('at-limit', len >= 5000);

        // Hide welcome banner once user starts typing
        if (len > 0 && el.welcomeBanner) {
            el.welcomeBanner.style.display = 'none';
        }
    };

    // --- Auto-save Draft ---

    let draftTimer = null;
    const autosaveDraft = () => {
        clearTimeout(draftTimer);
        draftTimer = setTimeout(() => {
            Utils.saveDraft({
                message: el.letterInput.value,
                theme: state.currentTheme,
            });
        }, 1000);
    };

    // --- Link Generation ---

    const generateAndCopy = async (url) => {
        const btn = el.generateLinkBtn;
        const btnText = btn.querySelector('.btn-text');
        const btnLoader = btn.querySelector('.btn-loader');

        btn.disabled = true;
        btnText.textContent = 'Shortening...';
        btnLoader.style.display = 'inline-block';
        el.shareStatus.textContent = '';

        const shareUrl = await Utils.shortenUrl(url.toString());

        btnLoader.style.display = 'none';
        btn.disabled = false;
        btnText.textContent = 'Shorten & Copy Link';

        const copied = await Utils.copyToClipboard(shareUrl);
        if (copied) {
            Utils.showToast('Link copied to clipboard!', 'success');
            el.shareOptions.style.display = 'flex';

            el.whatsappBtn.onclick = () => {
                const text = encodeURIComponent(
                    'I have written a special letter for you...\n\nRead it here: ' + shareUrl
                );
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            };

            el.telegramBtn.onclick = () => {
                const text = encodeURIComponent('I have written a special letter for you...');
                window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`, '_blank');
            };

            Utils.clearDraft();
        } else {
            Utils.showToast('Could not copy. Try manually: ' + shareUrl, 'error', 6000);
        }
    };

    // --- Initialize ---

    const init = async () => {
        Effects.initBackground();

        const params = {
            msg: Utils.getQueryParam('msg'),
            theme: Utils.getQueryParam('theme'),
            pass: Utils.getQueryParam('p'),
            atmosphere: Utils.getQueryParam('a'),
            date: Utils.getQueryParam('d'),
            img: Utils.getQueryParam('img'),
            music: Utils.getQueryParam('m'),
            font: Utils.getQueryParam('f'),
            coupon: Utils.getQueryParam('c'),
        };

        // --- Viewer flow (URL has a message) ---
        if (params.msg) {
            const decoded = Utils.decodeMessage(params.msg);
            if (!decoded) {
                Utils.showToast('This letter link appears to be invalid.', 'error');
                showEditor();
                return;
            }

            state.cachedMsg = decoded;

            // Date lock check
            if (params.date) {
                const unlockDate = new Date(params.date);
                if (!isNaN(unlockDate) && new Date() < unlockDate) {
                    showLocked(unlockDate);
                    return;
                }
            }

            // Password check — use modal instead of prompt()
            if (params.pass) {
                const input = await showPasswordModal();
                if (input === null) {
                    window.location.search = '';
                    return;
                }
                if (input !== params.pass) {
                    el.passwordModal.style.display = 'flex';
                    el.passwordError.textContent = 'Wrong password!';
                    // Give them one more try
                    const retry = await showPasswordModal();
                    if (retry !== params.pass) {
                        Utils.showToast('Incorrect password. Returning to home.', 'error');
                        window.location.search = '';
                        return;
                    }
                }
            }

            // Apply settings
            if (params.theme) setTheme(params.theme);
            if (params.atmosphere) Effects.setAtmosphere(params.atmosphere);
            if (params.music) setMusic(params.music);
            if (params.font) setFont(params.font);
            if (params.coupon) setCoupon(params.coupon);

            if (params.img) {
                const imgEl = $('letterImage');
                if (imgEl) {
                    imgEl.src = decodeURIComponent(params.img);
                    $('polaroid').style.display = 'block';
                }
            }

            showEnvelope();
        } else {
            // --- Editor flow ---
            showEditor();
        }

        // --- Event Listeners ---

        // Envelope open
        el.openEnvelopeBtn?.addEventListener('click', () => {
            const env = document.querySelector('.envelope');
            if (env) env.classList.add('open');
            el.openEnvelopeBtn.style.display = 'none';

            const audio = $('bgMusic');
            if (audio && audio.src) {
                audio.play().catch(() => {}); // autoplay policy
            }

            setTimeout(() => {
                el.envelopeWrapper.style.opacity = '0';
                el.envelopeWrapper.style.transition = 'opacity 0.6s ease';
                setTimeout(() => {
                    el.envelopeWrapper.style.display = 'none';
                    el.letterArea.style.display = 'block';
                    $('reactionBar').style.display = 'block';
                    showViewer(state.cachedMsg);
                }, 600);
            }, 800);
        });

        // Reactions
        document.querySelectorAll('.react-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const reply = btn.dataset.reply;
                const text = encodeURIComponent(reply + '\n\n(Replying to your love letter)');
                window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
            });
        });

        // Theme buttons
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => setTheme(btn.dataset.theme));
        });

        // Character counter + autosave
        el.letterInput?.addEventListener('input', () => {
            updateCharCount();
            autosaveDraft();
        });

        // Preview
        el.previewBtn?.addEventListener('click', () => {
            const msg = el.letterInput.value.trim();
            if (!msg) {
                Utils.showToast('Write something first!', 'info');
                el.letterInput.focus();
                return;
            }

            state.cachedMsg = msg;

            const atmosphere = $('atmosphereSelect')?.value;
            const music = $('musicSelect')?.value;
            const font = $('fontSelect')?.value;
            const coupon = $('couponSelect')?.value;
            const imgUrl = $('imageUrl')?.value.trim();
            const fileInput = $('imageUpload');

            if (atmosphere && atmosphere !== 'none') Effects.setAtmosphere(atmosphere);
            if (music) setMusic(music);
            if (font) setFont(font);
            if (coupon) setCoupon(coupon);

            const imgEl = $('letterImage');
            if (fileInput?.files?.[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imgEl.src = e.target.result;
                    $('polaroid').style.display = 'block';
                    showEnvelope();
                };
                reader.onerror = () => {
                    Utils.showToast('Failed to load image.', 'error');
                    $('polaroid').style.display = 'none';
                    showEnvelope();
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else if (imgUrl) {
                imgEl.src = imgUrl;
                $('polaroid').style.display = 'block';
                showEnvelope();
            } else {
                $('polaroid').style.display = 'none';
                showEnvelope();
            }
        });

        // Back to editor
        el.backToEditor?.addEventListener('click', showEditor);
        el.backToHome?.addEventListener('click', () => { window.location.search = ''; });

        // Start / Read Again
        el.startBtn?.addEventListener('click', startLetterAnimation);

        // Skip animation
        el.skipBtn?.addEventListener('click', skipAnimation);

        // Generate link
        el.generateLinkBtn?.addEventListener('click', async () => {
            const msg = el.letterInput.value.trim();
            if (!msg) {
                Utils.showToast('Write a message first!', 'info');
                el.letterInput.focus();
                return;
            }

            const encoded = Utils.encodeMessage(msg);
            const password = $('letterPass')?.value.trim();
            const atmosphere = $('atmosphereSelect')?.value;
            const music = $('musicSelect')?.value;
            const font = $('fontSelect')?.value;
            const coupon = $('couponSelect')?.value;
            const unlockDate = $('unlockDate')?.value;
            const imgUrl = $('imageUrl')?.value.trim();
            const fileInput = $('imageUpload');

            const url = new URL(window.location.origin + window.location.pathname);
            url.searchParams.set('msg', encoded);
            url.searchParams.set('theme', state.currentTheme);
            if (password) url.searchParams.set('p', password);
            if (atmosphere && atmosphere !== 'none') url.searchParams.set('a', atmosphere);
            if (music && music !== 'none') url.searchParams.set('m', music);
            if (font && font !== 'atma') url.searchParams.set('f', font);
            if (coupon && coupon !== 'none') url.searchParams.set('c', coupon);
            if (unlockDate) url.searchParams.set('d', unlockDate);

            if (fileInput?.files?.[0]) {
                if (fileInput.files[0].size > 50000) {
                    Utils.showToast('Photo too large! Use an image under 50KB or paste a URL instead.', 'error');
                    return;
                }
                const reader = new FileReader();
                reader.onload = async (e) => {
                    url.searchParams.set('img', encodeURIComponent(e.target.result));
                    await generateAndCopy(url);
                };
                reader.onerror = () => {
                    Utils.showToast('Failed to read image file.', 'error');
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                if (imgUrl) url.searchParams.set('img', encodeURIComponent(imgUrl));
                await generateAndCopy(url);
            }
        });

        // --- Keyboard Shortcuts ---
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter = Preview
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                el.previewBtn?.click();
            }
            // Ctrl+S = Generate Link
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                el.generateLinkBtn?.click();
            }
            // Escape = skip animation or close modal
            if (e.key === 'Escape') {
                if (state.isAnimating) skipAnimation();
            }
        });

        // Init char counter
        updateCharCount();
    };

    init();
});
