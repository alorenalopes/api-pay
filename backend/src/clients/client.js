const axios = require('axios');
require('dotenv').config();

const DEFAULT_PROVIDERS_URL = process.env.PROVIDERS_URL;
const DEFAULT_TIMEOUT = process.env.REQUEST_TIMEOUT || 10000;

/**
 * HTTP client for provider communication
 */
class HttpClient {
    /**
     * Creates a new HTTP client instance
     * @param {string} [baseURL=DEFAULT_PROVIDERS_URL] - Base URL for all requests
     */
    constructor(baseURL = DEFAULT_PROVIDERS_URL) {
        this.baseURL = baseURL;
        this.instance = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: DEFAULT_TIMEOUT
        });
    }

    /**
     * Handles HTTP request errors and adds useful information
     * @param {Error} error - Original request error
     * @param {string} method - HTTP method used (GET, POST, etc.)
     * @param {string} url - Relative request URL
     * @throws {Error} Enhanced error with additional information
     * @private
     */
    handleError(error, method, url) {
        const fullUrl = `${this.baseURL}${url}`;
        console.error(`Error in ${method} request to ${fullUrl}:`, error.message);

        error.url = fullUrl;
        error.method = method;
        error.response = error.response || {};

        throw error;
    }

    /**
     * Executes a GET request
     * @param {string} url - Relative request URL
     * @param {Object} [params={}] - Query string parameters
     * @param {Object} [config={}] - Additional axios configurations
     * @returns {Promise<Object>} Response data
     * @throws {Error} Request error with additional information
     */
    async get(url, params = {}, config = {}) {
        try {
            const response = await this.instance.get(url, {...config, params});
            return response.data;
        } catch (error) {
            return this.handleError(error, 'GET', url);
        }
    }

    /**
     * Executes a POST request
     * @param {string} url - Relative request URL
     * @param {Object} [data={}] - Data to be sent in request body
     * @param {Object} [config={}] - Additional axios configurations
     * @returns {Promise<Object>} Response data
     * @throws {Error} Request error with additional information
     */
    async post(url, data = {}, config = {}) {
        try {
            const response = await this.instance.post(url, data, config);
            return response.data;
        } catch (error) {
            return this.handleError(error, 'POST', url);
        }
    }
}

// Create default instance
const defaultClient = new HttpClient();

module.exports = {
    HttpClient,
    get: defaultClient.get.bind(defaultClient),
    post: defaultClient.post.bind(defaultClient)
};