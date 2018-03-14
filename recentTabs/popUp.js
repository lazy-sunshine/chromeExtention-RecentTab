recentUrls = [];
var btn_show, btn_open, btn_del
document.addEventListener('DOMContentLoaded', () => {
  listToshow = [];
  var btn_show = document.getElementById("show");
  var btn_open = document.getElementById("open");
  var btn_del = document.getElementById("del");

  try{
  getRecentHistory((tabsHistory) => {

    tabsHistory.forEach(function (session) {
      if (session.window) {
        session.window.tabs.forEach(function (tab) {
          recentUrls.push(tab);
        });
      } else {
        recentUrls.push(session.tab);
      }
    });
    if(recentUrls.length === 0){
      document.getElementById("modal-oops").setAttribute('style', 'display:block');return;
    }
    createList("container", 0, 20);
    btn_show.classList.remove("button-disable");
    btn_open.classList.remove("button-disable");
    btn_del.classList.remove("button-disable");
    
  });
}catch(e){
  document.getElementById("modal-oops").setAttribute('style', 'display:block');
}

  btn_show.addEventListener("click", function () {
    if (listToshow.length === recentUrls.length) { btn_show.classList.add("button-disable"); return false; };
    createList("container", listToshow.length, recentUrls.length);
    document.getElementById("container").setAttribute('style', 'overflow-y:auto;height:auto');
   });

  btn_open.addEventListener("click", function () {

    try{
    listToshow.forEach(function (tab) {
      chrome.tabs.create({
        url: tab.url
      }, function () { });
    });
  }catch(e){
    document.getElementById("modal-oops").setAttribute('style', 'display:block');
}
});

});

function getRecentHistory(callback) {

  chrome.sessions.getRecentlyClosed((items) => {
    callback(items);
  });
}

function createList(container, stVal, endVal) {
  var k = stVal;
  var frag = document.createDocumentFragment();
  for (; k < recentUrls.length; k++) {
    var tab = recentUrls[k];
    listToshow.push(tab);
    if (k === endVal) break;
    var li = document.createElement("li");
    var aTag = document.createElement('a');
    aTag.setAttribute('href', tab.url);
    var x = document.createElement("IMG");
    x.setAttribute("src", tab.favIconUrl);

    aTag.appendChild(x);
    var para = document.createElement("span");
    para.innerHTML = tab.title;
    aTag.appendChild(para);
    li.appendChild(aTag);
    frag.appendChild(li);

  }

  document.getElementById(container).appendChild(frag);

}
