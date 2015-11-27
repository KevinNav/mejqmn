$(document).on("pagecontainerbeforeshow", function(e,ui){
    var pageid = ui.toPage.attr("id");
    switch(pageid){
        case "backlog":
            //....
            load_backlog_data(ui.toPage);
            break;
        case "newbacklog":
            //....
            if(!newbacklogBinded){
                newbacklogBinded = true;
                $("#btnNewStory").on("click", btnNewStory_onclicked);
            }
            break;
        case "backlogdetail":
            if(selectedBacklogItemID!==""){
                load_backlogitem_data(ui.toPage);
            }
            break;
    }
});
var newbacklogBinded = false;
var selectedBacklogItemID = "";
function load_backlog_data(backlog_page){
    $.get(
        "/api/getbacklog",
        {},
        function(docs, success, xhr){
            if(docs){
                var htmlstr = '<ul>';
                for(var i = 0 ; i < docs.length ; i++){
                    var backlogitem = docs[i];
                    htmlstr += '<li><a href="#backlogdetail" data-id="'+backlogitem._id+'">'+backlogitem.description+'</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e){
                        selectedBacklogItemID = $(this).data("id");
                    })
                    ;
            }
        },
        "json"
    );
}

function load_backlogitem_data(backlogitem_page){
    $.get(
        "/api/getOneBacklog/" + selectedBacklogItemID,
        {},
        function(doc, status, xhr){
            var html = $(backlogitem_page).find(".ui-content").html();
            var htmlObj  = $(html);
            for (var i in doc) {
                htmlObj.find("#d_" + i).html(doc[i]);
            }
            $(backlogitem_page).find(".ui-content").html(htmlObj);
        },
        "json"
    ).fail(
        function(xhr, status, doc){
            console.log(doc);
            chage_page("backlog");
        }
    );
}

function btnNewStory_onclicked(e){
    e.preventDefault();
    e.stopPropagation();
    //Primer obtener los datos del formulario
    var formValuesArray = $("#newbacklog_form").serializeArray();
    var formObject = {};
    for(var i = 0; i< formValuesArray.length;i++){
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post(
        "api/addtobacklog",
        formObject,
        function(data,sucess,xhr){
            if(data.resultado.ok){
                $("#newbacklog_form").get()[0].reset();
                alert("Historia Ingresada!");
                chage_page("backlog");
            }else{
                alert("Error al Insertar!");
            }
        },
        "json"
    ).fail(function(xhr,failtxt,data){
        alert("Error al Insertar!");
    });
}

// Funcion para cambiar de pagina
function chage_page(to){
    $(":mobile-pagecontainer").pagecontainer("change", "#" + to);
}
