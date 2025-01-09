const express = require('express');
const crypto = require('crypto'); // Built-in Node.js crypto module
const app = express();

// In-memory storage (replace with a database in production)
const urlDatabase = new Map();
const urlStats = new Map();

// Basic middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utility function to generate short URL
function generateShortUrl(length = 6) {
    return crypto.randomBytes(length).toString('base64')
        .replace(/[+/=]/g, '')  // Remove non-URL-safe characters
        .substring(0, length);
}

// Utility function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Basic routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to URL Shortener' });
});

app.post('/shorten', (req, res) => {
    try {
        const { url, customAlias } = req.body;

        // Validate URL
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!isValidUrl(url)) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Check if URL already exists
        for (const [shortId, originalUrl] of urlDatabase.entries()) {
            if (originalUrl === url) {
                const stats = urlStats.get(shortId);
                return res.json({
                    original_url: url,
                    short_url: shortId,
                    stats: stats
                });
            }
        }

        // Handle custom alias
        if (customAlias) {
            if (urlDatabase.has(customAlias)) {
                return res.status(400).json({ error: 'Custom alias already in use' });
            }
            urlDatabase.set(customAlias, url);
            urlStats.set(customAlias, { clicks: 0, created: new Date() });
            return res.json({
                original_url: url,
                short_url: customAlias,
                stats: urlStats.get(customAlias)
            });
        }

        // Generate short URL
        let shortUrl;
        do {
            shortUrl = generateShortUrl();
        } while (urlDatabase.has(shortUrl));

        // Save to database
        urlDatabase.set(shortUrl, url);
        urlStats.set(shortUrl, { clicks: 0, created: new Date() });

        res.json({
            original_url: url,
            short_url: shortUrl,
            stats: urlStats.get(shortUrl)
        });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ error: 'Failed to shorten URL' });
    }
});

app.get('/:shortUrl', (req, res) => {
    try {
        const { shortUrl } = req.params;
        
        // Check if short URL exists
        if (!urlDatabase.has(shortUrl)) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Get original URL and update stats
        const originalUrl = urlDatabase.get(shortUrl);
        const stats = urlStats.get(shortUrl);
        stats.clicks += 1;
        urlStats.set(shortUrl, stats);

        // Redirect to original URL
        res.redirect(originalUrl);
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).json({ error: 'Failed to redirect' });
    }
});

// Stats endpoint
app.get('/stats/:shortUrl', (req, res) => {
    try {
        const { shortUrl } = req.params;
        
        if (!urlDatabase.has(shortUrl)) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const stats = urlStats.get(shortUrl);
        const originalUrl = urlDatabase.get(shortUrl);

        res.json({
            short_url: shortUrl,
            original_url: originalUrl,
            stats: stats
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
