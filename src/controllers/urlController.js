// URL Controller Implementation// src/controllers/urlController.js

const UrlShortenerService = require('../services/urlShortener/implementations/UrlShortenerService');

class UrlController {
    constructor() {
        this.urlShortenerService = new UrlShortenerService();
    }

    async shortenUrl(req, res) {
        try {
            const { url } = req.body;
            
            if (!url) {
                return res.status(400).json({ 
                    error: 'URL is required' 
                });
            }

            const shortId = await this.urlShortenerService.shortenUrl(url);
            
            res.status(201).json({
                shortId,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async redirectToUrl(req, res) {
        try {
            const { shortId } = req.params;
            const originalUrl = await this.urlShortenerService.getOriginalUrl(shortId);
            res.redirect(originalUrl);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UrlController();
// src/controllers/urlController.js

const UrlShortenerService = require('../services/urlShortener/implementations/UrlShortenerService');

class UrlController {
    constructor() {
        this.urlShortenerService = new UrlShortenerService();
    }

    async shortenUrl(req, res) {
        try {
            const { url } = req.body;
            
            if (!url) {
                return res.status(400).json({ 
                    error: 'URL is required' 
                });
            }

            const shortId = await this.urlShortenerService.shortenUrl(url);
            
            res.status(201).json({
                shortId,
                shortUrl: `${req.protocol}://${req.get('host')}/${shortId}`
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async redirectToUrl(req, res) {
        try {
            const { shortId } = req.params;
            const originalUrl = await this.urlShortenerService.getOriginalUrl(shortId);
            res.redirect(originalUrl);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UrlController();
