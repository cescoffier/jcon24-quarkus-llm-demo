import { LitElement, html, css} from 'lit';
import { Router } from '@vaadin/router';
import '@vaadin/tabs';
// Here add all pages you want in the router
import './tic-claims.js';

const indicator = document.querySelectorAll('.js-loading-indicator');
if (indicator.length > 0) {
  indicator[0].remove();
}

const router = new Router(document.getElementById('outlet'));
router.setRoutes([
    {path: '/', component: 'tic-claims', name: 'Claims'}
]);

/**
 * This component shows the navigation
 */
export class TicNav extends LitElement {

    static webSocket;
    static serverUri;
    static initQueue = [];

    constructor() {
      super();
      // if (!TicNav.webSocket) {
      //     if (window.location.protocol === "https:") {
      //       TicNav.serverUri = "wss:";
      //     } else {
      //       TicNav.serverUri = "ws:";
      //     }
      //     TicNav.serverUri += "//" + window.location.host + "/ws";
      //     TicNav.connect();
      // }
    }    

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('serverRequestEvent', this._handleServerRequest);
    }

    disconnectedCallback() {
        document.removeEventListener('serverRequestEvent', this._handleServerRequest);
        super.disconnectedCallback();
    }

    render() {
        const routes = router.getRoutes();
        return html`<vaadin-tabs> 
                        ${routes.map((r) => {
                            return html`<vaadin-tab>
                                    <a href="${r.path}">
                                        <span>${r.name}</span>
                                    </a>
                                </vaadin-tab>`;
                        })}
                    </vaadin-tabs>`;
    }

    _handleServerRequest(event){
        if(TicNav.webSocket){
            TicNav.webSocket.send(event.detail);
        }else{
            TicNav.initQueue.push(event.detail);
        }
    }
    
    static connect() {
        TicNav.webSocket = new WebSocket(TicNav.serverUri);

        TicNav.webSocket.onopen = function (event) {
            while (TicNav.initQueue.length > 0) {
                TicNav.webSocket.send(TicNav.initQueue.pop());
            }
        };

        TicNav.webSocket.onmessage = function (event) {
            const mesageEvent = new CustomEvent('serverResponseEvent', {detail: event.data});
            document.dispatchEvent(mesageEvent);
        }

        TicNav.webSocket.onclose = function (event) {
            setTimeout(function () {
                TicNav.connect();
            }, 100);
        };

        TicNav.webSocket.onerror = function (error) {
            const mesageEvent = new CustomEvent('serverResponseEvent', {detail: error});
            document.dispatchEvent(mesageEvent);
            TicNav.webSocket.close();
        }
    }
 }
 customElements.define('tic-nav', TicNav);