
console.log(location.pathname);
const toolbar = document.querySelector('#leftToolbar');
console.log(toolbar);
const toolbarGrp = document.createElement("div");
toolbarGrp.setAttribute('class','gg-tool nav nav-pills nav-stacked pull-left persoToolbar');
toolbarGrp.innerHTML = `
    <div class="toolbarGroup">
        <a class="gg-icon js-open-gg-quests white" href="#">
            GG
        </a> 
    </div>
`;
document.body.insertBefore(toolbarGrp,toolbar);

const quests = document.createElement("div");
quests.setAttribute('class','gg-quests gg-hide');
quests.innerHTML = `
    Pouet
`;
document.body.insertBefore(quests,toolbar);
//js-gc-quests

document.querySelector('.js-open-gg-quests').addEventListener('click',(event)=>{
    console.log("pouet");
    quests.classList.toggle('gg-hide');
});

const pathnameRE = /^\/ark:\/[0-9]\/[a-z0-9]/; 


