
const area = document.querySelector('#areaPageView');
const gcRoot = document.createElement("div");
gcRoot.classList.add('gc-root');
gcRoot.innerHTML = "POUET";
area.parentNode.insertBefore(gcRoot, area.nextSibling);