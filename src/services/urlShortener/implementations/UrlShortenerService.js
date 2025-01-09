// Implementation of URL Shortener Serviceconst IUrlShortenerService = require('../interfaces/IUrlShortenerService');
const crypto = require('crypto');

class UrlShortenerService extends IUrlShortenerService {
    constructor() {
        super();
        // In-memory storage for demonstration. In production, use a database
        this.urlDatabase = new Map();
        this.urlStats = new Map();
    }

    async shortenUrl(originalUrl, customAlias = null) {
        try {
            // Validate URL
            if (!this.isValidUrl(originalUrl)) {
                throw new Error('Invalid URL provided');
            }

            // Handle custom alias
            if (customAlias) {
                if (this.urlDatabase.has(customAlias)) {
                    throw new Error('Custom alias already in use');
                }
                this.urlDatabase.set(customAlias, originalUrl);
                this.urlStats.set(customAlias, { clicks: 0, createdAt: new Date() });
                return customAlias;
            }

            // Generate short ID
            const shortId = await this.generateUniqueId();
            this.urlDatabase.set(shortId, originalUrl);
            this.urlStats.set(shortId, { clicks: 0, createdAt: new Date() });

            return shortId;
        } catch (error) {
            throw new Error(`Error shortening URL: ${error.message}`);
        }
    }

    async getUrl(shortId) {
        try {
            const originalUrl = this.urlDatabase.get(shortId);
            if (!originalUrl) {
                throw new Error('URL not found');
            }

            // Update stats
            const stats = this.urlStats.get(shortId);
            stats.clicks += 1;
            this.urlStats.set(shortId, stats);

            return originalUrl;
        } catch (error) {
            throw new Error(`Error retrieving URL: ${error.message}`);
        }
    }

    async getUrlStats(shortId) {
        try {
            const stats = this.urlStats.get(shortId);
            if (!stats) {
                throw new Error('Stats not found for this URL');
            }
            return {
                shortId,
                clicks: stats.clicks,
                createdAt: stats.createdAt,
                originalUrl: this.urlDatabase.get(shortId)
            };
        } catch (error) {
            throw new Error(`Error retrieving stats: ${error.message}`);
        }
    }

    async deleteUrl(shortId) {
        try {
            if (!this.urlDatabase.has(shortId)) {
                throw new Error('URL not found');
            }
            this.urlDatabase.delete(shortId);
            this.urlStats.delete(shortId);
            return true;
        } catch (error) {
            throw new Error(`Error deleting URL: ${error.message}`);
        }
    }

    // Helper methods
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    async generateUniqueId(length = 6) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let shortId;
        do {
            shortId = crypto.randomBytes(length)
                .toString('base64')
                .replace(/[+/=]/g, '')
                .substring(0, length);
        } while (this.urlDatabase.has(shortId));

        return shortId;
    }
}

module.exports = UrlShortenerService;
