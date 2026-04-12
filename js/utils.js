/**
 * Utility functions — encoding, clipboard, URL shortening, sanitization, toasts
 */
export const Utils = {
    encodeMessage: (msg) => {
        try {
            return btoa(unescape(encodeURIComponent(msg)));
        } catch (e) {
            console.error("Encoding failed", e);
            return null;
        }
    },

    decodeMessage: (encoded) => {
        try {
            return decodeURIComponent(escape(atob(encoded)));
        } catch (e) {
            console.error("Decoding failed", e);
            return null;
        }
    },

    getQueryParam: (param) => {
        return new URLSearchParams(window.location.search).get(param);
    },

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers / non-HTTPS
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.cssText = 'position:fixed;opacity:0;left:-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                return true;
            } catch {
                return false;
            }
        }
    },

    shortenUrl: async (longUrl) => {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 8000);
            const response = await fetch(
                `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);
            const data = await response.json();
            return data.shorturl || longUrl;
        } catch {
            return longUrl;
        }
    },

    /**
     * Sanitize user text content to prevent XSS when inserted into DOM.
     * Only allows plain text — no HTML.
     */
    sanitize: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Toast notification system
     */
    showToast: (message, type = 'info', duration = 4000) => {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, duration);
    },

    /**
     * Save draft to localStorage
     */
    saveDraft: (data) => {
        try {
            localStorage.setItem('tomyinfida-draft', JSON.stringify(data));
        } catch { /* quota exceeded — ignore */ }
    },

    loadDraft: () => {
        try {
            const raw = localStorage.getItem('tomyinfida-draft');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },

    clearDraft: () => {
        try { localStorage.removeItem('tomyinfida-draft'); } catch { /* ignore */ }
    }
};
