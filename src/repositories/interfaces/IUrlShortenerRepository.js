class IUrlShortenerRepository {
    async saveUrl(urlData) {
        throw new Error('Method not implemented');
    }

    async getUrl(shortId) {
        throw new Error('Method not implemented');
    }

    async findByOriginalUrl(originalUrl) {
        throw new Error('Method not implemented');
    }

    async deleteUrl(shortId) {
        throw new Error('Method not implemented');
    }

    async incrementClickCount(shortId) {
        throw new Error('Method not implemented');
    }
}

module.exports = IUrlShortenerRepository;