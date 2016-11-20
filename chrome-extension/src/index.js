import 'whatwg-fetch';
import UrlBasedQuest from './urlBasedQuest';

console.log(location.pathname);
const toolbar = document.querySelector('#leftToolbar');
console.log(toolbar);
const toolbarGrp = document.createElement("div");
toolbarGrp.setAttribute('class','gc-tool nav nav-pills nav-stacked pull-left persoToolbar');
toolbarGrp.innerHTML = `
    <div class="toolbarGroup">
        <a class="gc-icon js-open-gc-quests white" href="#">
            GC
        </a> 
    </div>
`;
document.body.insertBefore(toolbarGrp,toolbar);

const quests = document.createElement("div");
quests.setAttribute('class','gc-quests gc-hide');
quests.innerHTML = `
    <ul>
        <li>Quest 1</li>
        <li>Quest 2</li>
        <li>Quest 3</li>
    </ul>
`;
document.body.insertBefore(quests,toolbar);
//js-gc-quests

fetch('http://gallicagame.herokuapp.com/quests').then(response => response.json()).then((jsonBody) => {
    // console.log(jsonBody);
});

const urlBasedQuest = new UrlBasedQuest(() => console.log('Quest has ended'));
if (!urlBasedQuest.isInitialized()) {
    urlBasedQuest.initialize([
        'http://gallica.bnf.fr/ark:/12148/bpt6k5551207g',
        'http://gallica.bnf.fr/ark:/12148/bpt6k5459562z',
        'http://gallica.bnf.fr/ark:/12148/bpt6k70159b',
    ]);
}
urlBasedQuest.onPageVisit();
// remember visited pages -> as all pages on one quest are visited, validate the quest.

document.querySelector('.js-open-gc-quests').addEventListener('click',(event)=>{
    console.log("pouet");
    quests.classList.toggle('gc-hide');
});

const pathnameRE = /^\/ark:\/[0-9]\/[a-z0-9]/; 


