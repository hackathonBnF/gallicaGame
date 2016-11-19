
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
    Pouet
`;
document.body.insertBefore(quests,toolbar);
//js-gc-quests

document.querySelector('.js-open-gc-quests').addEventListener('click',(event)=>{
    console.log("pouet");
    quests.classList.toggle('gc-hide');
});

const pathnameRE = /^\/ark:\/[0-9]\/[a-z0-9]/; 


