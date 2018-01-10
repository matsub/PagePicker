function saveOption(){
  var targetExtensions = []
  var extentions = document.querySelectorAll(".ext")

  for (let ext of extentions) {
    targetExtensions.push({
      name: ext.querySelector(".name").innerText,
      isChecked: ext.querySelector("input").checked
    })
  }

  chrome.storage.sync.set({
    targetExtensions
  }, () => {
    var message = document.querySelector("#message")
    message.classList.toggle("flush")
    setTimeout(() => { message.classList.toggle("flush") }, 1200)
  })
}


function addExtension(){
  var input = document.querySelector("#new")

  if (input.value !== "") { append(input.value, true) }
  input.value = ""
}


function removeExtension(){
  this.parentNode.parentNode.remove()
}


function restoreOptions(){
  var desc = document.querySelector("#description")
  desc.innerText = chrome.i18n.getMessage("Description")

  chrome.storage.sync.get({
    targetExtensions: [
      { name: "png", isChecked: true },
      { name: "jpeg", isChecked: true },
      { name: "pdf", isChecked: true }
    ]
  }, items => {
    for (let ext of items.targetExtensions) {
      append(ext.name, ext.isChecked)
    }
  })
}


const appendForm = document.querySelector("#appendForm")
const table = appendForm.parentNode

function append(name, isChecked){
  var minusIcon = document.createElement("span")
  minusIcon.classList.add("icon")
  minusIcon.classList.add("icon-minus")
  minusIcon.onclick = removeExtension

  var extensionName = document.createElement("span")
  extensionName.classList.add("name")
  extensionName.innerText = name

  var titleCell = document.createElement("td")
  titleCell.appendChild(minusIcon)
  titleCell.appendChild(extensionName)

  var input = document.createElement("input")
  input.setAttribute("type", "checkbox")
  input.checked = isChecked

  var slider = document.createElement("div")
  slider.classList.add("slider")

  var checkbox = document.createElement("label")
  checkbox.classList.add("switch")
  checkbox.appendChild(input)
  checkbox.appendChild(slider)

  var checkboxCell = document.createElement("td")
  checkboxCell.appendChild(checkbox)

  var tr = document.createElement("tr")
  tr.classList.add("ext")
  tr.appendChild(titleCell)
  tr.appendChild(checkboxCell)

  table.insertBefore(tr, appendForm)
}


restoreOptions()
document.querySelector("button").onclick = saveOption
document.querySelector("#add").onclick = addExtension
document.querySelector("#new").onkeypress = evt => {
  if (evt.which === 13){ addExtension() }
}
document.querySelector("#new").focus()
