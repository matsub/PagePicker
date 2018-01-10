function* getAllowed(targetExtensions) {
  for (let ext of targetExtensions) {
    if (ext.isChecked){
      yield ext.name;
    }
  }
}

function download(tab){
  chrome.downloads.download({url: tab.url});
  chrome.tabs.remove(tab.id);
}

function downloadAll(){
  chrome.storage.sync.get({
    targetExtensions: [
      { name: "png", isChecked: true },
      { name: "jpg", isChecked: true },
      { name: "jpeg", isChecked: true }
    ],
  }, (items) => {
    let allowed = Array.from(getAllowed(items.targetExtensions));

    /* Download match MIME Types */
    let pattern = new RegExp(".*(" + allowed.join('|') + ")$");
    chrome.tabs.query({}, (tabs) => {
      for (let tab of tabs){
        withMIMEType(tab, pattern, download);
      }
    });
  });
}

function withMIMEType(tab, pattern, callback){
  let client = new XMLHttpRequest();
  client.open("GET", tab.url, true);
  client.send();
  client.onreadystatechange = function(){
    if (this.readyState == this.HEADERS_RECEIVED) {
      let ContentType = client.getResponseHeader("Content-Type");
      let MIMEType = ContentType.split(';')[0];
      if (pattern.exec(MIMEType) !== null) {
        callback(tab);
      }
    }
  }
}


chrome.browserAction.onClicked.addListener(downloadAll);
