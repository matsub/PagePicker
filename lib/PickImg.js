function download(tab){
  chrome.downloads.download({url: tab.url})
  chrome.tabs.remove(tab.id)
}


function downloadAll(){
  chrome.storage.sync.get({
    targetExtensions: [
      { name: "png", isChecked: true },
      { name: "jpg", isChecked: true },
      { name: "jpeg", isChecked: true }
    ],
  }, items => {
    var target = items.targetExtensions.filter(ext => ext.isChecked)
    var pattern = new RegExp(`/(${target.join("|")})`)

    /* Download match MIME Types */
    chrome.tabs.query({}, tabs => {
      for (let tab of tabs) {
        withMIMEType(tab, pattern, download);
      }
    })
  })
}


async function withMIMEType(tab, pattern, resolve){
  var response = await fetch(tab.url)
  var contentType = response.headers.get("content-type")

  if (pattern.exec(contentType)) {
    resolve(tab)
  }
}


chrome.browserAction.onClicked.addListener(downloadAll)
