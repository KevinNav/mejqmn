$(document).on("pagecontainerbeforeshow", function(e,ui){
    var pageid = ui.toPage.attr("id");
    switch(pageid){
        case "backlog":
            //....
            load_backlog_data(ui.toPage);
            break;
        case "newbacklog":
            //....
            break;
    }
});

function load_backlog_data(backlog_page){
    $.get(
        "/api/getbacklog",
        {},
        function(docs, success, xhr){
            if(docs){
                var htmlstr = '<ul>';
                for(var i = 0 ; i < docs.length ; i++){
                    var backlogitem = docs[i];
                    htmlstr += '<li><a href data-id="'+backlogitem._id+'">'+backlogitem.description+'</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview();
            }
        },
        "json"
    );
}
