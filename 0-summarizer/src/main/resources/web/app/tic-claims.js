import { LitElement, html, css} from 'lit';
import '@vaadin/progress-bar';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-sort-column.js';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import '@vaadin/split-layout';
import '@vaadin/details';
import '@vaadin/upload';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

/**
 * This component shows the claims screen
 */
export class TicClaims extends LitElement {

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
        
        .claimsList {
            height: 100%;
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
    
        .claimsList vaadin-grid{
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
        _claims: {state: true},
        _selectedClaim: {state: true}
    }

    constructor() {
        super();
        this._handleServerResponse = this._handleServerResponse.bind(this);
        this._claims = null;
        this._selectedClaim = null;
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('serverResponseEvent', this._handleServerResponse);
        this._fetchClaims();
    }

    disconnectedCallback() {
        document.removeEventListener('serverResponseEvent', this._handleServerResponse);
        super.disconnectedCallback();
    }

    _fetchClaims(){
        fetch('/claims').then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error fetching all claims');
                                    }
                                    return response.json();
                            }).then(data => {
                                this._claims = data;
                            }).catch(error => {
                                throw new Error('Error fetching all claims' + error);
                            });
    }

    render() {
        if(this._selectedClaim){
            return html`${this._renderClaim()}`;
        }else if(this._claims){
            return html`${this._renderClaims()}`;
        }else{
            return html`Loading claims
            <vaadin-progress-bar indeterminate></vaadin-progress-bar>`;
        }
    }

    _renderClaim(){
        return html`
                    
                    <div class="claim">
                        <div class="claimHeading">
                            
                            <div class="claimHeadingLeft">
                                <vaadin-button @click="${this._backToList}">
                                    <vaadin-icon icon="vaadin:list" slot="prefix"></vaadin-icon>
                                    Back
                                </vaadin-button>
                                <h2>Claim ${this._selectedClaim.id}</h2>
                            </div>
                            <div class="claimHeadingRight">
                                <vaadin-button @click="${this._prevClaim}">
                                    <vaadin-icon icon="vaadin:arrow-left" slot="prefix"></vaadin-icon>
                                    Previous  Claim
                                </vaadin-button>
                                <vaadin-button @click="${this._nextClaim}">
                                    Next Claim
                                    <vaadin-icon icon="vaadin:arrow-right" slot="suffix"></vaadin-icon>    
                                </vaadin-button>
                            </div>    
                        </div>
                        <div class="claimSummary">
                            <vaadin-split-layout>
                                <master-content class="claimSummaryLeft">
                                    <h3>Subject</h3>
                                    <strong>${this._selectedClaim.title}</strong>

                                    <h3>Summary</h3>
                                    <div class="preLine">${this._selectedClaim.summary}</div>

                                    <h3>Customer sentiment: ${this._renderSentiment()}</h3>
                                </master-content>
                            </vaadin-split-layout>
                        </div>
                        
                        <vaadin-details summary="Original claim content">
                            <div><b>Subject: </b>${this._selectedClaim.title}</div>
                            <div>
                                ${unsafeHTML(this._selectedClaim.original)}
                            </div>
                        </vaadin-details>
    
                    </div>`;
    }

    _renderSentiment(){
        if(this._selectedClaim.sentiment === "POSITIVE"){
            return html`<vaadin-icon icon="vaadin:smiley-o" style="color: var(--lumo-success-color);"></vaadin-icon>`;
        }else if(this._selectedClaim.sentiment === "NEUTRAL"){
            return html`<vaadin-icon icon="vaadin:meh-o" style="color: var(--lumo-warning-text-color);"></vaadin-icon>`;
        }else if(this._selectedClaim.sentiment === "NEGATIVE"){
            return html`<vaadin-icon icon="vaadin:frown-o" style="color: var(--lumo-error-color);"></vaadin-icon>`;
        }else {
            return html`<span>${this._selectedClaim.sentiment}</span>`;
        }
    }

    _renderClaims(){
        return html`<div class="claimsList">
                        <vaadin-grid 
                                .items="${this._claims}" 
                                .selectedItems="${[this._selectedClaim]}"
                                @active-item-changed="${(e) => {
                                    this._setSelectedClaim(e.detail.value);
                                }}">
                            <vaadin-grid-sort-column path="id" auto-width></vaadin-grid-sort-column>
                            <vaadin-grid-sort-column path="account" header="Policy Number" auto-width></vaadin-grid-sort-column>
                            <vaadin-grid-sort-column path="title" header="Subject" auto-width></vaadin-grid-sort-column>
                        </vaadin-grid>
                        <vaadin-upload target="/claims" @upload-success="${(e) => this._fileUploaded(e)}"></vaadin-upload>
                    </div>`;
    }

    // Here you have two options if the upload button is on the same page (like it is now)
    // 1) _fileUploaded : Just fetch the claims again one the new claim has been uploaded. This will fetch all claims and repopulate the grid
    // 2) _handleServerResponse : Listen for the event (from tic-nav via ws) and just add the one row. This is also how you would do it if the upload is on another page.
    
    // For now I commented out the event / ws one. 

    _fileUploaded(e){
        // Refresh the claims
        this._fetchClaims();
    }

    _handleServerResponse(e){
        //this._addToClaims(JSON.parse(e.detail));
    }

    _addToClaims(item) {
        if (this._claims && this._claims.length > 0) {
            this._claims = [...this._claims, item];
        } else {
            this._claims = [item];
        }
    }

    _setSelectedClaim(selected){
        if(selected){
            this._selectedClaim = selected;
        }else {
            this._selectedClaim = null;
        }
    }

    _backToList(){
        this._selectedClaim = null;
    }

    _nextClaim(){
        let currentIndex = this._claims.findIndex(claim => claim.claimId === this._selectedClaim.claimId);
        if(currentIndex === this._claims.length-1){
            this._selectedClaim = this._claims[0];
        }else{
            this._selectedClaim = this._claims[currentIndex+1];
        }
    }

    _prevClaim(){
        let currentIndex = this._claims.findIndex(claim => claim.claimId === this._selectedClaim.claimId);
        if(currentIndex === 0){
            this._selectedClaim = this._claims[this._claims.length-1];
        }else{
            this._selectedClaim = this._claims[currentIndex-1];
        }
    }

}
customElements.define('tic-claims', TicClaims);