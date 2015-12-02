var newbacklogBinded = false;
var selectedBacklogItemID = "";
var uploadBtnBinded = false;
var content, html;

$(document).on("pagebeforechange", function(e, data) {
    if (typeof data.toPage === "object") {
        var pageid = data.toPage.attr("id");
        switch (pageid) {
            case "picUpload":
            case "backlogdetail":
                if (selectedBacklogItemID === "") {
                    data.toPage[0] = $("#backlog")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                }
                break;
        }
    }
});

$(document).on("pagecontainerbeforeshow", function(e, ui) {
    var pageid = ui.toPage.attr("id");
    switch (pageid) {
        case "backlog":
            //....
            load_backlog_data(ui.toPage);
            break;
        case "newbacklog":
            //....
            if (!newbacklogBinded) {
                newbacklogBinded = true;
                $("#btnNewStory").on("click", btnNewStory_onclicked);
            }
            break;
        case "backlogdetail":
            if (selectedBacklogItemID !== "") {
                load_backlogitem_data(ui.toPage);
            }
            break;
        case "picUpload":
            if (!uploadBtnBinded) {
                uploadBtnBinded = true;
                $("#userpic").on("change", userpic_onchange);
                $("#btnUploadPic").on("click", btnUpload_onClicked);
            }
            break;
    }
});

function load_backlog_data(backlog_page) {
    $.get(
        "/api/getbacklog", {},
        function(docs, success, xhr) {
            if (docs) {
                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    var backlogitem = docs[i];
                    htmlstr += '<li><a href="#backlogdetail" data-id="' + backlogitem._id + '">' + backlogitem.description + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
        },
        "json"
    );
}

function load_backlogitem_data(backlogitem_page) {
    $.get(
        "/api/getOneBacklog/" + selectedBacklogItemID, {},
        function(doc, status, xhr) {
            if(!content){
                content = $(backlogitem_page).find(".ui-content");
                html = content.html();
            }

            var htmlObj = $(html);
            for (var i in doc) {
                htmlObj.find("#d_" + i).html(doc[i]);
            }
            if(doc.evidences){
                for (var k = 0; k< doc.evidences.length ; k ++){
                    htmlObj.append('<div><img src="'+doc.evidences[k]+'" /></div>');
                }
            }
            content.html(htmlObj);
        },
        "json"
    ).fail(
        function(xhr, status, doc) {
            change_page("backlog");
        }
    );
}

function btnNewStory_onclicked(e) {
    e.preventDefault();
    e.stopPropagation();
    //Primer obtener los datos del formulario
    var formValuesArray = $("#newbacklog_form").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post(
        "api/addtobacklog",
        formObject,
        function(data, sucess, xhr) {
            if (data.resultado.ok) {
                $("#newbacklog_form").get()[0].reset();
                alert("Historia Ingresada!");
                change_page("backlog");
            } else {
                alert("Error al Insertar!");
            }
        },
        "json"
    ).fail(function(xhr, failtxt, data) {
        alert("Error al Insertar!");
    });
}

var picFile;

function userpic_onchange(e) {
    picFile = e.target.files;
}

function btnUpload_onClicked(e) {
    e.preventDefault();
    e.stopPropagation();
    if (picFile) {
        var formBody = new FormData();
        $.each(picFile, function(llave, valor) {
            formBody.append("userpic", valor);
        });
        formBody.append("backlogid", selectedBacklogItemID);
        $.ajax({
            url: "api/upload",
            type: "POST",
            data: formBody,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, success, xhr) {
                change_page("backlogdetail");
            },
            error: function(xhr, fail, data) {
                alert("Error while uploading evidence file. Try again latter!");
            }
        });
    } else {
        alert("Must select an evidence file!");
    }
}

// Funcion para cambiar de pagina
function change_page(to) {
    $(":mobile-pagecontainer").pagecontainer("change", "#" + to);
}
