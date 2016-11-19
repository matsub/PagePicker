function getAllowed(ext) {
    if (ext.isChecked){
        return ext.name;
    } else {
        return false;
    }
}

function getExtension(url){
    return url.split('.').pop();
}

function dealImage(tabs, callback){
    chrome.storage.sync.get({
        targetExtensions: [
            { name: "png", isChecked: true },
            { name: "jpg", isChecked: true },
            { name: "jpeg", isChecked: true }
        ]
    }, (items) => {
        allowed = items.targetExtensions
            .map(getAllowed)
            .filter((item) => { return item });
        console.log(tabs);

        for (let tab of tabs) {
            if ( allowed.includes(getExtension(tab.url)) ) {
                callback(tab);
                chrome.tabs.remove(tab.id);
            }
        }
    });
}

function download(tab){
    chrome.downloads.download({url: tab.url});
}

function downloadAll(tab){
    chrome.tabs.query({}, (tabs) => {
        dealImage(tabs, download);
    });
}

chrome.browserAction.onClicked.addListener(downloadAll);
