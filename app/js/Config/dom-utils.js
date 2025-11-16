export class DOMUtils {
    
    static showLoading(element) {
        element.innerHTML = '<div class="loading">Carregando...</div>';
    }

    static showError(element, message) {
        element.innerHTML = `<div class="error">Erro: ${message}</div>`;
    }

    static createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    static clearElement(element) {
        element.innerHTML = '';
    }

    static bindButton(buttonId, callback) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', callback);
        }
    }
}