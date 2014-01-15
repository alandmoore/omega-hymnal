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

var default_dialog_options = {
    width : "90%",
    modal : true
}

function show_popup_form(data){
    var title = $(data).attr("title")
    $("#_dialog_").html(data).attr("title", title).dialog(default_dialog_options);
}

$(document).ready(function(){
        //even out the navigation
    //setTimeout(function(){
//	var navitems = $("NAV > UL > LI");
//	navitems.css("width", Math.floor((window.innerWidth/navitems.size()) * .95));
  //  }, 200);

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

    //SONG EDITING
    //New song button
    $(document).on("click", "#new_song A", function(){
	$.get("edit_song/0", function(data){
	    show_popup_form(data);
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
	    if (new_song){
		window.open("/song/"+song_id);
		$("#_dialog_").dialog("close");
	    }else{
		window.location = "/song/"+song_id;
	    }
	});
	return false;
    });
    //EXPORT
    //Show the export dialog
    $(document).on("click", "#link_export", function(){
	$.get("/export", function(data){
	    show_popup_form(data);
	    $("#_dialog_ INPUT[name=name]").autocomplete({
		source:"/json/names",
		minLength: 2
	    });
	    //disable fields until the matching radio button is clicked.
	    $("#export_form INPUT[name=type]").change(function(){
		var selected = $("#export_form INPUT[name=type]:checked");
		$("#export_form INPUT[type=text], #export_form SELECT").attr("disabled", 1);
		selected.closest("LI").find("INPUT[type=text], SELECT").removeAttr("disabled");
		$("#export_form LI").removeClass("selected");
		selected.closest("LI").addClass("selected");
		if (selected.val()==='all'){
		    $("#songs_to_export").html("(All)");
		}else{
		$("#songs_to_export").html("");
		}
	    });
	    $("#export_form INPUT[name=type]").trigger("change");
	});
    });
    //When the export form is changed, display the songs to be exported
    $(document).on("change keyup autocompleteselect", 
		   "#export_form INPUT[type=text], #export_form SELECT", 
		   function(e, ui){
		       var value = (ui && ui.item.value)|| $(this).val();
		       if (value !== ''){
	    var formdata = $("#export_form").serialize();
	    $.getJSON("/json/export", formdata, function(data){
		var dest = $('#songs_to_export');
		dest.html('');
		$.each(data, function(i, val){
		    dest.append("<li>" + val + "</li>");
		});
	    })
	}else{
	    $("#song_to_export").html("");
	}
    });

    //IMPORT
    //Show the import dialog
    $(document).on("click", "#link_import", function(){
	$.get("/import", function(data){
	    show_popup_form(data);
	});
    });

    //Ajaxify the import dialog
    $(document).on("submit", "#import_form", function(event){
	event.preventDefault();
	var formdata = new FormData($(this)[0]);

	$.ajax({
	    url : $(this).attr("action"),
	    type: "POST",
	    data : formdata,
	    async : false,
	    cache : false,
	    contentType : false,
	    processData : false,
	    success : function(data){
		$("#_dialog_").html(data).dialog(default_dialog_options);
	    }
	});

	return false;
    });

    //SETTINGS
    //Show the settings dialog
    $(document).on("click", "#link_settings", function(event){
	$.get("/settings", function(data){
	    show_popup_form(data);
	});
    });
    //the "page forward key" and "page backward key" fields need to hold a keycode, not a character
    $(document).on("keydown", "INPUT[name=page_forward_key], INPUT[name=page_backward_key]", function(e){
	$(this).val(e.which);
	e.preventDefault();
	return false;
    });

    //submit settings
    $(document).on("submit", "#settings_form", function(e){
	e.preventDefault();
	var data = $(this).serialize();
	$.post(
	    $(this).attr("action"),
	    data,
	    function(){
		$("#_dialog_").dialog("close");
	    }
	)
	return false;
    });
});
