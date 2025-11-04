import API_CONFIG from './api-config.js';

class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.timeout = API_CONFIG.timeout;
        this.defaultHeaders = API_CONFIG.headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            timeout: this.timeout,
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP! status: ${response.status}`);
            }
            
            // Verifica se a resposta tem conteúdo
            const contentLength = response.headers.get('content-length');
            const contentType = response.headers.get('content-type');
            
            // Se não há conteúdo ou o conteúdo é muito pequeno, retorna null
            if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
                return { data: null, status: response.status };
            }
            
            try {
                const data = await response.json();
                return { data, status: response.status };
            } catch (jsonError) {
                // Se falhar ao parsear JSON, mas a resposta foi bem-sucedida
                console.warn('Resposta não é JSON válido, retornando null:', jsonError);
                return { data: null, status: response.status };
            }
            
        } catch (error) {
            console.error('Requisição Fracassada:', error);
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    async put(endpoint, data, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

export default new ApiClient();