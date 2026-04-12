/**
 * Utility functions for encoding and decoding messages
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
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    copyToClipboard: async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy: ', err);
            return false;
        }
    },

    shortenUrl: async (longUrl) => {
        try {
            const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
            const data = await response.json();
            if (data.shorturl) {
                return data.shorturl;
            }
            return longUrl;
        } catch (e) {
            console.warn("Link shortening failed, using original link.", e);
            return longUrl;
        }
    }
};
