import React from 'react';
import ReactDOM from 'react-dom/client';
import { WebChatLM } from './WebChatLM';

class WebChatElement extends HTMLElement {
    root: ShadowRoot;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' }); // Shadow DOM для стилей
    }

    connectedCallback() {
        const userId = this.getAttribute('user-id') || '';
        const userToken = this.getAttribute('user-token') || '';
        const channelId = this.getAttribute('channelId') || '';

        // Подключаем скомпилированный CSS файл в Shadow DOM
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/WebChatLastMessages/index-web.css';
        this.root.appendChild(link);

        // Рендерим ваш React-компонент
        ReactDOM.createRoot(this.root).render(
            <React.StrictMode>
                <WebChatLM userId={userId} userToken={userToken} channelId={channelId} />
            </React.StrictMode>
        );
    }

    static get observedAttributes() {
        return ['user-id', 'user-token'];
    }

}

customElements.define('web-chat-lm', WebChatElement);