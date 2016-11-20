function save_options(){
    let targetExtensions = [];

    $(".ext").each((idx, elm) => {
        let $tr = $(elm);
        targetExtensions.push({
            name: $tr.find(".name").text(),
            isChecked: $tr.find("input").prop("checked")
        });
    });

    chrome.storage.sync.set({
        targetExtensions: targetExtensions
    }, () => {
        $("#message").fadeIn();
        setTimeout(() => { $("#message").fadeOut(); }, 1250);
    });
}

function add_extension(){
    let $input = $("input:last");
    let ext = $input.val()
    if (ext !== "") { append(ext, true) }
    $input.val("");
}

function remove_extension(){
    $(this).parent().parent().remove()
}

function restore_options(){
    $("#description").text(chrome.i18n.getMessage("Description"));

    chrome.storage.sync.get({
        targetExtensions: [
            { name: "png", isChecked: true },
            { name: "jpg", isChecked: true },
            { name: "jpeg", isChecked: true }
        ]
    }, (items) => {
        for(let ext of items.targetExtensions){
            append(ext.name, ext.isChecked);
        }
    });
}


var $last = $("#last");
function append(name, isChecked){
    let $tr = $("<tr></tr>").addClass("ext");
    let $label = $("<label></label>");
    $label.addClass("switch"); 

    let $input = $("<input>");
    $input.attr("type", "checkbox");
    if (isChecked) { $input.prop("checked", true); }

    $label.append($input);
    $label.append($("<div></div>").addClass("slider"));

    let $td = $("<td></td>");
    let $icon = $("<span></span>").addClass("icon icon-minus");
    $td.append($icon.on("click", remove_extension));
    $td.append($("<span></span>").addClass("name").text(name));
    $tr.append($td);
    $tr.append($("<td></td>").append($label));
    $last.before($tr);
}


$(restore_options);
$("button").on("click", save_options);
$(".icon-plus").on("click", add_extension);
$("input:last").keypress((e) => {
    if (e.which == 13){ add_extension(); }
});
