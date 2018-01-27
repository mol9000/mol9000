function gotoModule(name){
    $("#gt1").show();
    $("#moduleli").show();
    $("#modulelink").text(name);
    $("#modulelink").click();
    $("#modTitle").text(name);

}
function gotoQuestion(name){
    $("#gt2").show();
    $("#questionli").show();
    $("#questionlink").text(name);
    $("#questionlink").click();
    $("#modTitleQ").text(name);
}

$(function(){
    $("#modulelink").on("click", function(){
        $("#gt2").hide()
        $("#questionli").hide();
    });
    $("#mainlink").on("click", function(){
        $("#gt1").hide()
        $("#moduleli").hide();
        $("#gt2").hide()
        $("#questionli").hide();
    });
})

