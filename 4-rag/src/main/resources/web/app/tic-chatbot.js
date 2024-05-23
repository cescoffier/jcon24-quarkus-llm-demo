import {css, html, LitElement} from 'lit';
import '@vaadin/progress-bar';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/split-layout';
import '@vaadin/details';
import '@vaadin/upload';
import '@vaadin/message-input';
import '@vaadin/message-list';

/**
 * This component shows the claims screen
 */
export class TicChatbot extends LitElement {
    static styles = css`

        :host {
            display: flex;
            gap: 10px;
            width: 100%;
            height: 100%;
            justify-content: space-around;
            flex-direction: column;
            background: var(--lumo-base-color);
            overflow: auto;
        }

        .hidden {
            visibility: hidden;
        }

        .show {
            visibility: visible;
        }

        .claimsList {
            height: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .claimsList vaadin-grid {
            height: 100%;
        }

        .claim {
            display: flex;
            width: 100%;
            height: 100%;
            flex-direction: column;
            align-items: center;
        }

        .claimHeading {
            display: flex;
            width: 85%;
            justify-content: space-between;
            align-items: center;
        }

        .claimSummary {
            background: var(--lumo-tint-5pct);
            width: 85%;
        }

        .claimSummaryLeft {
            display: flex;
            flex-direction: column;
            padding-left: 10px;
            padding-right: 10px;
            width: 80%;
        }

        .claimSummaryRight {
            width: 20%;
            padding-left: 10px;
            padding-right: 10px;
        }

        .claimHeadingLeft {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .claimHeadingRight {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .claim vaadin-details {
            width: 85%;
        }

        .preLine {
            white-space: pre-line;
        }

        .images {
            width: 100%;
        }
    `;

    static properties = {
        _chatItems: {state: true},
        _progressBarClass: {state: true},
    }

    constructor() {
        super();
        this._chatItems = [];
        this._progressBarClass = "hidden";
        this.ws = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.ws = new WebSocket("ws://localhost:8080/chat");
        this.ws.addEventListener("message", (event) => {
            console.log("Message from server ", event.data);
            this._hideProgressBar();
            this._chatItems = [
                ...this._chatItems,
                {
                    text: event.data,
                    userName: "Insurance Bob",
                    userColorIndex: 1
                }];
            this.requestUpdate();
        })
    }


    disconnectedCallback() {
        super.disconnectedCallback();
    }


    render() {
        if (this._chatItems) {
            return html`${this._renderChat()}`;
        } else {
            return html`Loading claims
            <vaadin-progress-bar indeterminate></vaadin-progress-bar>`;
        }
    }

    _renderChat() {
        return html`
            <div class="chat">
                <vaadin-message-list .items="${this._chatItems}"></vaadin-message-list>
                <vaadin-progress-bar class="${this._progressBarClass}" indeterminate></vaadin-progress-bar>
                <vaadin-message-input @submit="${this._handleSendChat}"></vaadin-message-input>
            </div>`;
    }

    _hideProgressBar() {
        this._progressBarClass = "hidden";
    }

    _showProgressBar() {
        this._progressBarClass = "show";
    }

    _handleSendChat(e) {
        let message = e.detail.value;
        if (message && message.trim().length > 0) {
            this._chatItems = [
                ...this._chatItems,
                {
                    text: message,
                    userName: "Me",
                    userColorIndex: 0
                }]
            this.requestUpdate();
            this._showProgressBar();
            this.ws.send(message);
        }

    }
}

customElements.define('tic-chatbot', TicChatbot);