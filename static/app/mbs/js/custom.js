//Javascript Document
/*$(document).ready(function(){
    var loaded = true;
    var top = $("#j-carinfobar").offset().top;
    function Add_Data()
    {              
        var scrolla=$(window).scrollTop();
        var cha=parseInt(top)-parseInt( scrolla);
        if(loaded && cha<=0)
        {                
            loaded=false;
        }
        if(!loaded && cha>0)
        {
            loaded=true;
        }
    }
    $(window).scroll(Add_Data);
});*/
$(function(){
    $("#j-reveal").click(function(){
        $("#j-rtvisit").slideToggle();
    });
});

$(function(){
    $("#j-btn-bydh").click(function(){
        $("#j-tr-bydh").slideToggle();
    });
});