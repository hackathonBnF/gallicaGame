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
            'http://gallica.bnf.fr/ark:/12148/bpt6k716226w': false,
            'http://gallica.bnf.fr/ark:/12148/btv1b90150286': false,
            'http://gallica.bnf.fr/ark:/12148/bpt6k54932781/f136.image': false,
            'http://gallica.bnf.fr/ark:/12148/bpt6k716226w/f5.image': false,
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
        if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k716226w/f5.image')) {
            return 'Quelle avancée majeure en médecine légale ce tragique événement a-t-il amené ?'
        } else if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/btv1b90150286')) {
            return `<a href="http://gallica.bnf.fr/ark:/12148/bpt6k54932781/f136.image">Pourquoi a-t-on accusé cette tenue d’avoir précipité la mort d’une majorité de femmes dans le bazar ?</a>`;
        } else if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k54932781/f136.image')) {
            return '<a href="http://gallica.bnf.fr/ark:/12148/bpt6k716226w/f5.image">Pourquoi cet événement a-t-il failli porter un coup fatal au 7e art ? N’hésitez pas à chercher d’autres articles de presse</a>';
        } else if (currentUrl.startsWith('http://gallica.bnf.fr/ark:/12148/bpt6k716226w')) {
            return `<a href="http://gallica.bnf.fr/ark:/12148/btv1b90150286">Cherchez dans Gallica l’emplacement du bazar de la Charité dans Paris en 1897 ?</a>`;
        } else {
            return 'On sait depuis longtemps que travailler avec du texte lisible etcontenant du sens est source de distractions, et empêche de se concentrer sur la mise en page elle-même.';
        }
    }
}