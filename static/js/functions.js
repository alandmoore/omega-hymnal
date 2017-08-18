//Javascript functions for the omega hymnal
//This file is loaded on every page


//TODO: cleanup this spaghetti mess...

///////////////////////
// jQuery extensions //
///////////////////////

/* global $, jQuery, Song */

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


//////////////
// Settings //
//////////////
var default_dialog_options = {
    width : "90%",
    modal : true
};


///////////////
// Functions //
///////////////

//lifted from https://stackoverflow.com/a/19961519
HTMLTextAreaElement.prototype.insertAtCaret = function (text, post_offset) {
    post_offset = post_offset || 0;
    text = text || '';
    if (document.selection) {
	// IE
	this.focus();
	var sel = document.selection.createRange();
	sel.text = text;
    } else if (this.selectionStart || this.selectionStart === 0) {
	// Others
	var startPos = this.selectionStart;
	var endPos = this.selectionEnd;
	this.value = this.value.substring(0, startPos) +
	    text +
	    this.value.substring(endPos, this.value.length);
	this.selectionStart = startPos + text.length + post_offset;
	this.selectionEnd = startPos + text.length + post_offset;
  } else {
    this.value += text;
  }
};



function show_popup_form(data, onfinish){
    default_dialog_options.title = $(data).attr("title");
    $("#_dialog_").html(data).dialog(default_dialog_options);
    if(onfinish){
	onfinish();
    }
}

//////////////
// SongList //
//////////////

function SongList(songlist_id){
    var $sl = $(songlist_id);
    if ($sl.length == 0){
	return null;
    }
    $sl.songlinks = $sl.find('.songlink');
    $sl.category_select = $("#category_select");
    $sl.with_music_checkbox = $("#with_music_checkbox");
    $sl.search_inp = $("#search");
    $sl.randomize_btn = $("#randomize_list");

    //Song filters
    $sl.apply_filters = function(){
	$sl.songlinks.hide();
	var category = $sl.category_select.val();
	var show_with_music_only = $sl.with_music_checkbox.is(":checked");
	if (category === ''){
	    $sl.songlinks.show();
	}else{
	    $sl.songlinks.filter(function(i, el){
		categories = $(el).data("category").split(',').map(String.trim);
		return $.inArray(category, categories) !== -1;
	    }).show();
	}
	if (show_with_music_only){
	    $sl.songlinks.filter(":visible:not(:contains(♫))").hide();
	}
    };
    $sl.category_select.on("change", $sl.apply_filters);
    $sl.with_music_checkbox.on("change", $sl.apply_filters);
    $sl.apply_filters();

    //Song searching
    $sl.search = function(){
	var term = $sl.search_inp.val();
	if (term.length > 0){
	    $sl.songlinks.hide();
	    $sl.songlinks.filter(":containsi("+term+")").show();
	}else{
	    $sl.songlinks.show();
	}
	$sl.category_select.attr("value", "");
    };
    $sl.search_inp.on('keyup', $sl.search);
    $sl.search_inp.focus();


    //some jquery-ui magic
    $sl.with_music_checkbox.button();
    $sl.randomize_btn.button();
    $sl.category_select.selectmenu({
	position: {my: "bottom center", at: "top center"},
	width: "16em",
	change: function(){
	    $sl.category_select.trigger("change");
	}
    });
    $sl.search_inp.button().css({"text-align": "left"});

    //make the main page LI's clickable
    $sl.song_container = Song("#song_container");

    $sl.songlinks.click(function(){
	var href = $(this).attr("data-href");
	document.song_id = href.match(/\d+$/);
	$("#songlist_container").hide();
	$sl.song_container.show_song(href);
    });


   //randomize button
    $sl.randomize_btn.click(function(){
	var orig_label = $(this).html();
	$(this).html("Hang on a sec").attr("disabled", "disabled");
	$sl.songlinks = $sl.songlinks.shuffle();
	$(this).html(orig_label).removeAttr("disabled");
    });

    return $sl;
}


$(document).ready(function(){
    //even out the navigation
    //apply custom colors

    if (typeof bg_color != 'undefined' && bg_color){
	$(document).find("BODY").css({"background-color" : bg_color});
    }
    if (typeof fg_color != 'undefined' && fg_color){
	$(document).find("#content").css({"color": fg_color});
    }
    if (typeof ch_color != 'undefined' && ch_color){
	$(document).find(".chord").css({"color": ch_color});
    }

    document.songlist = SongList('#songlist');

    //If this is a song page, make "Home" close the window
    $("#link_home").click(function(){
	$("#song_container").hide();
	$("#songlist_container").show();
    });
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

    //insert a chord when ctrl+alt+[A-G] is pressed
    $(document).on("keydown", "#edit_form .page_textarea", function(e){
	if (e.altKey && e.ctrlKey && ($.inArray(e.key, ['a', 'b', 'c', 'd', 'e', 'f', 'g']) !== -1)){
	    var chordstring = "{" + e.key.toUpperCase() + "}";
	    e.target.insertAtCaret(chordstring, -1);
	}
    });

    //Post a song edit
    $(document).on("submit", "#edit_form", function(e){
	e.preventDefault();
	var formdata = $(this).serialize();
	var new_song = $(this).find("INPUT[name=id]").val() === 'None';
	$.post("/post/song", formdata, function(song_id){
	    $("#songlist_container").hide();
	    document.song_id = song_id;
	    document.songlist.song_container.show_song("/song/"+song_id);
	    $("#_dialog_").dialog("close");
	});
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
	    });
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
	    show_popup_form(data, check_color);
	});
    });
    //the "page forward key" and "page backward key" fields need to hold a keycode, not a character
    $(document).on("keydown", "INPUT[name=page_forward_key], INPUT[name=page_backward_key]", function(e){
	$(this).val(e.which);
	e.preventDefault();
	return false;
    });

    //Color default checkboxes should disable the color selects
    function check_color(){
	$("input[type=checkbox].color_default").each(function(i, el){
	    var name = $(el).attr("name");
	    if ($(el).is(":checked")){
		$("input[type=color][name="+name+"]").attr("disabled", true);
	    }else{
		$("input[type=color][name="+name+"]").removeAttr("disabled");
	    }
	});
    }
    $(document).on("change", "input.color_default", check_color);

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
	);
	return false;
    });

    //INITIALIZE
    //Call the initialize form
    $(document).on("click", "#link_initialize", function(event){
	event.preventDefault();
	$.get("/initialize", function(data){
	    show_popup_form(data);
	    $("#initialize_form INPUT[type=submit]").attr("disabled", 1);
	    $(document).on("change", "#init_db", function(){
		if ($(this).is(":checked")){
		    $("#initialize_form INPUT[type=submit]").removeAttr("disabled");
		}else{
		    $("#initialize_form INPUT[type=submit]").attr("disabled", 1);
		}
	    });
	});
    });
    //Handle submit
    $(document).on("submit", "#initialize_form", function(event){
	event.preventDefault();
	var location = window.location;
	var formdata = $(this).serialize();
	$.post($(this).attr("action"), formdata, function(){
	    window.location = location;
	    window.location.reload();
	});
	return false;
    });

    // LOGIN/LOGOUT
    $(document).on("click", "#link_login", function(event){
	$.get("/login", function(data){
	    show_popup_form(data);
	    $("#loginform").on("submit", function( event ){
		event.preventDefault();
		$.post("/login", $(this).serialize(), function(data){
		    show_popup_form(data);
		    window.location.reload();
		});
		return false;
	    });
	});
    });

    $(document).on("click", "#link_logout", function(event){
	$.get("/logout", function(data){
	    //show_popup_form(data);
	    window.location.reload();
	});
    });
});
