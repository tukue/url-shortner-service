class IUrlShortenerService {
    async shortenUrl(url, customAlias) {
        throw new Error('Method not implemented');
    }

    async getUrl(shortId) {
        throw new Error('Method not implemented');
    }

    async getUrlStats(shortId) {
        throw new Error('Method not implemented');
    }

    async deleteUrl(shortId) {
        throw new Error('Method not implemented');
    }
}

module.exports = IUrlShortenerService;