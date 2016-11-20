import 'whatwg-fetch';
import _ from 'lodash';
import UrlBasedQuest from './urlBasedQuest';


const urlBasedQuest = new UrlBasedQuest(() => console.log('Quest has ended'));
if (!urlBasedQuest.isInitialized()) {
    urlBasedQuest.initialize();
}
urlBasedQuest.onPageVisit();
console.log(urlBasedQuest.getCurrentQuestHtml());

const assetsPath = chrome.extension.getURL('assets/images');

console.log(assetsPath);
const toolbar = document.querySelector('#leftToolbar');
console.log(toolbar);
const toolbarGrp = document.createElement("div");
toolbarGrp.setAttribute('class','gg-tool');
toolbarGrp.innerHTML = `
    <div class="gg-tool-title">Gallica Scope</div>
    <nav>
        <a href="#">
            <img src="${assetsPath}/bodies.png">
        </a>
        <a href="#">
            <img src="${assetsPath}/fiole.png">
        </a> 
        <a class="js-open-gg-quests selected" href="#">
            <img src="${assetsPath}/star.png">
        </a> 
    </nav>
`;
document.body.insertBefore(toolbarGrp,toolbar);

const quests = document.createElement("div");
quests.setAttribute('class','gg-quests gg-hide');
quests.innerHTML = `
    <div class="gg-quests-label">Quête ÉvÉnementielle</div>
    <div class="gg-quests-content">
        <dl>
            <dt>L'incendie du bazar de la Charité</dt>
            <dd>${urlBasedQuest.getCurrentQuestHtml()}</dd>
        </dl>
        <dl>
            <dt>Il était une foi dans l’Ouest</dt>
            <dd>Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit.</dd>
        </dl>
        <dl>
            <dt>Vol au-dessus d’un nid de courroux</dt>
            <dd>Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit.</dd>
        </dl>
    </div>
`;
document.body.insertBefore(quests,toolbar);


fetch('http://gallicagame.herokuapp.com/quests').then(response => response.json()).then((jsonBody) => {
    console.log(jsonBody);
});
// remember visited pages -> as all pages on one quest are visited, validate the quest.

document.querySelector('.js-open-gg-quests').addEventListener('click',(event)=>{
    console.log("pouet");
    quests.classList.toggle('gg-hide');
});

_.each(document.querySelectorAll('.js-quests-toggle'),(item)=>{
   // item.classList.toggle('gg-quests-open');
    const label = item.querySelector('span');
    label.addEventListener('click',(event)=>{
        console.log("pouet",event);
        const icon = event.target.querySelector('i');
        icon.classList.toggle('ion-plus');
        icon.classList.toggle('ion-minus');
        item.classList.toggle('gg-quests-open');
    });
});



const pathnameRE = /^\/ark:\/[0-9]\/[a-z0-9]/;  


