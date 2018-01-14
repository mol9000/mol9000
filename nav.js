function gotoModule(id){
    //server yadayada mit id
    var text="Programmieren 1";
    $("#gt1").show();
    $("#moduleli").show();
    $("#modulelink").text(text);
    $("#modulelink").click();

}
function gotoQuestion(id){
    //server yadayada mit id
    var text="Bitte hilf mir";
    $("#gt2").show();
    $("#questionli").show();
    $("#questionlink").text(text);
    $("#questionlink").click();

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

