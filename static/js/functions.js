//Javascript functions for the omega hymnal
//This file is loaded on every page

//copypasta code
(function($){
 
    $.fn.shuffle = function() {
 
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
 
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
 
        return $(shuffled);
 
    };
 
})(jQuery);


$.extend($.expr[':'], {
  'containsi': function(elem, i, match, array)
  {
    return (elem.textContent || elem.innerText || '').toLowerCase()
    .indexOf((match[3] || "").toLowerCase()) >= 0;
  }
});

var edit_dialog_options = {
    width : "90%",
    modal : true,
    title : "Edit song"
}

$(document).ready(function(){
        //even out the navigation
    setTimeout(function(){
	var navitems = $("NAV > UL > LI");
	navitems.css("width", Math.floor((window.innerWidth/navitems.size()) * .95));
    }, 200);

    $("#search").focus();
    $("#search").keyup(function(){
	var term = $(this).val();
	
	if (term.length > 0){
	$(".songlink").hide();
	$(".songlink:containsi("+term+")").show();
	}
	else
	{
	    $(".songlink").show();
	}
	$("#category_select").attr("value", "");
    });
    //category filter
    $("#category_select").change(function(){
	var category = $(this).val();
	console.log(category);
	if (category === ""){
	    $(".songlink").show();
	}else{
	$(".songlink").hide();
	$(".songlink[data-category=\"" + category + "\"]").show();
	}
    });
    
    //make the main page LI's clickable
    $("#songlist > LI").click(function(){
	var href = $(this).attr("data-href");
	window.open(href, '_blank');
	window.focus();
	return false;
    });
 
   //randomize button
    $("#randomize_list").click(function(){
	var orig_label = $(this).html();
	$(this).html("Hang on a sec").attr("disabled", "disabled");
	$("#content  #songlist  LI").shuffle();
	$(this).html(orig_label).removeAttr("disabled");
    });

    //If this is a song page, make "Home" close the window
    if ($("#songtitle").length > 0){
	$("#link_home").click(function(){
	    window.close();
	});
    }
    $("_dialog_").hide();

    //New song button
    $(document).on("click", "#new_song A", function(){
	$.get("edit_song/0", function(data){
	    $("#_dialog_").html(data).dialog(edit_dialog_options);
	    $("#_dialog_ INPUT[name=category]").autocomplete({
		source:"/json/categories",
		minLength: 2
	    });
	});
    });

    //Add a verse when the last textedit is edited on the song form
    $(document).on("keyup", "#edit_form .page_textarea:last", function(){
	if ($(this).val() !== ''){
	    var newpage = $(this).closest("LI").clone();
	    newpage.find("textarea").val("");
	    $(this).closest("UL").append(newpage);
	}
    });
    //Remove blank verses from the end
    $(document).on("keyup", "#edit_form .page_textarea:eq(-2)", function(){
	if ($(this).val()===''){
	    $("#edit_form .page_textarea:last").remove();
	}
    });
    
    //Post a song edit
    $(document).on("submit", "#edit_form", function(){
	var formdata = $(this).serialize();
	var new_song = $(this).find("INPUT[name=id]").val() === 'None';
	$.post("/post/song", formdata, function(song_id){
	    console.log(song_id);
	    if (new_song){
		window.open("/song/"+song_id);
		$("#_dialog_").dialog("close");
	    }else{
		window.location = "/song/"+song_id;
	    }
	});
	return false;
    });

});
