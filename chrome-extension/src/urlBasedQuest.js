import * as _ from 'lodash';

export default class {
    // liste d'urls
    // historique -> check si les urls ont ete visitees
    // event -> finit la quete

    constructor(onQuestEnded) {
        this.onQuestEnded = onQuestEnded;
        if (localStorage.targetUrls) {
            this.targetUrls = JSON.parse(localStorage.targetUrls);
        }
    }

    isInitialized() {
        return this.targetUrls;
    }

    hasEnded() {
        return _.size(this.targetUrls) > 0 && _.every(this.targetUrls);
    }

    initialize(targetUrls) {
        this.targetUrls = {};
        for (let targetUrl of targetUrls) {
            this.targetUrls[targetUrl] = false;
        }
    }

    onPageVisit() {
        const currentUrl = window.location.href;
        console.log(currentUrl);
        for (let targetUrl in this.targetUrls) {
            if (currentUrl.startsWith(targetUrl)) {
                this.targetUrls[targetUrl] = true;
            }
        }
        console.log(this.targetUrls);
        localStorage.targetUrls = JSON.stringify(this.targetUrls);
        if (this.hasEnded()) {
            localStorage.targetUrls = null;
            this.onQuestEnded();
        }
    }
}