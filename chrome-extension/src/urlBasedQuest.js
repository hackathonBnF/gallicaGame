import 'whatwg-fetch';
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
        this.userId = localStorage.userId;
    }

    isInitialized() {
        return this.targetUrls;
    }

    hasEnded() {
        return _.size(this.targetUrls) > 0 && _.every(this.targetUrls);
    }

    initialize() {
        this.targetUrls = {
            'http://gallica.bnf.fr/ark:/12148/bpt6k5551207g': false,
            'http://gallica.bnf.fr/ark:/12148/bpt6k5459562z': false,
            'http://gallica.bnf.fr/ark:/12148/bpt6k70159b': false,
        };
        fetch('http://gallicagame.herokuapp.com/quests').then(r => r.json()).then(jsonBody => {
            this.userId = jsonBody.user_id;
            localStorage.userId = this.userId;
            return this.userId;
        }).then(userId => {
            fetch(`http://gallicagame.herokuapp.com/quest/start/1/${this.userId}`);
        });
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
            fetch(`http://gallicagame.herokuapp.com/quest/finish/1/${this.userId}`);
            this.onQuestEnded();
        }
    }

    getCurrentQuestHtml() {
        const currentUrl = window.location.href;
        if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k5551207g')) {
            return `Blablablablabla <a href="http://gallica.bnf.fr/ark:/12148/bpt6k5459562z">Cliquer ici pour la seconde oeuvre</a>`;
        } else if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k5459562z')) {
            return `Blablablablabla <a href="http://gallica.bnf.fr/ark:/12148/bpt6k70159b">Troisieme oeuvre</a>`
        } else if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k70159b')) {
            return 'C\'est bon, fini !';
        } else {
            return '';
        }
    }
}