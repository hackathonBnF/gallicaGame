import 'whatwg-fetch';
import _ from 'lodash';
import UrlBasedQuest from './urlBasedQuest';


const assetsPath = chrome.extension.getURL('assets/images');

console.log(assetsPath);
const toolbar = document.querySelector('#leftToolbar');
console.log(toolbar);
const toolbarGrp = document.createElement("div");
toolbarGrp.setAttribute('class','gg-tool');
toolbarGrp.innerHTML = `
    <nav>
        <a href="#">
            <img src="${assetsPath}/bodies.png">
        </a>
        <a class="js-open-gg-quests" href="#">
            <img src="${assetsPath}/fiole.png">
        </a> 
        <a href="#">
            <img src="${assetsPath}/star.png">
        </a> 
    </nav>
`;
document.body.insertBefore(toolbarGrp,toolbar);

const quests = document.createElement("div");
quests.setAttribute('class','gg-quests gg-hide');
quests.innerHTML = `
    <ul>
        <li class="gg-quests-cat js-quests-toggle">
            <span><i class="icon ion-plus"></i> Cat 1</span>
            <nav>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
            </nav>
        </li>
        <li class="gg-quests-cat js-quests-toggle">
            <span><i class="icon ion-plus"></i> Cat 2 </span>
            <nav>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
            </nav>
        </li>
        <li class="gg-quests-cat js-quests-toggle">
            <span><i class="icon ion-plus"></i> Cat 3</span>
            <nav>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
                <a href="#">Quest Lorem ipsum dolor sit amet, consectetur adipiscing elit. </a>
            </nav>
        </li>
    </ul>
`;
document.body.insertBefore(quests,toolbar);


fetch('http://gallicagame.herokuapp.com/quests').then(response => response.json()).then((jsonBody) => {
    console.log(jsonBody);
});

const urlBasedQuest = new UrlBasedQuest(() => console.log('Quest has ended'));
if (!urlBasedQuest.isInitialized()) {
    urlBasedQuest.initialize();
}
urlBasedQuest.onPageVisit();
console.log(urlBasedQuest.getCurrentQuestHtml());
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


