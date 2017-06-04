//Functions for the omega hymnal song page


/* global $ transpose_chord */


function fitDivToPage($div) {
    // This function takes an element and stretches it
    // to fit the parent element, expanding text to maximum size.

    var target_height =  window.innerHeight - $("NAV").outerHeight();
    var numbreaks = $div.find(" > br").size() +1;
    var target_width = window.innerWidth * .95;
    var line_size = target_height / numbreaks;
    var font_size = line_size;
    var has_chords = $div.find(".chord").length > 0;
    //console.log("Has chords: ", has_chords);
    if (has_chords){
	font_size = .65 * line_size;
	$div.css("padding-top", "1em");
	$div.css("padding-bottom", "1em");
    }
    $div.css("line-height", line_size+"px");
    $div.css("white-space", "nowrap");
    $div.css("font-size", font_size+"px");
    //console.log("Area WxH: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    //The basic concept here is to shrink the text by 10% until the scrollwidth is less than the target width, and scrollheight likewise.
    //This would indicate a lack of scrollbars.
    while (($div[0].scrollWidth > target_width || $div[0].scrollHeight > target_height) && font_size > 12){
	//	console.log(font_size);
	font_size *= .9;
	$div.css("font-size", font_size+"px");

	//console.log("fontsize: ", font_size, "; Line height: ", line_size, "; Div target W,H: ", target_width, target_height, "; Div scroll W, H: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    }
    $div.width($div[0].scrollWidth);
    $(".chord").css("bottom", (line_size * .3)+"px");
}

function Song(container_id) {
    var $song = $(container_id);
    if ($song.length === 0){
	return null;
    }

    $song.move_to_page = function(pagenumber){
	var $div = $song.find("#page"+pagenumber);
	$('.songpage').stop().fadeOut(100);
	$div.stop().fadeIn(200);
	$("#songtitle").html("<span>&quot;" + $div.attr("data-songtitle") + "&quot;</span>");
	$('#pagecounter').html("<span>Page " + pagenumber + " / " + $song.numpages + "</span>");
	if ($song.transpose !== 0){
	    var sign = ($song.transpose > 0)?"♯":"♭";
	    $("#transpose").html("Tr: " + sign + Math.abs($song.transpose));
	}else{
	    $("#transpose").html("Tr: ♮ ");
	}
	$(".chord").each(function(i, el){
	    $(el).html(transpose_chord($song.original_chords[i].innerHTML, $song.transpose));
	});
	window.setTimeout(
	    function(){
		fitDivToPage($div);
	    },
	    50
	);
    };

    $song.init = function(){
	$song.page = 1;
	$song.numpages = $song.find('.songpage').size();
	$song.original_chords = $(".chord").clone();
	$song.transpose = 0;
	if ($song.numpages > 0){
	    $song.move_to_page(1);
	}
	$(document).keydown(function(e){
	    //console.log(e);
	    //console.log("keycode pressed:" + e.which);
	    //If we have an input in focus, we don't need to do any of these.
	    if ($(":input:focus").length > 0){
		return true;
	    }
	    //Page forward
	    if (("page_forward_key" in window && e.which == parseInt(page_forward_key, 10) )
		|| e.which == $.ui.keyCode.RIGHT){
		//forward page
		if ($song.page < $song.numpages){ $song.page++;}
	    }else if (("page_backward_key" in window && e.which == parseInt(page_backward_key,10) )
		      || e.which == $.ui.keyCode.LEFT){
		//Page backwards
		if ($song.page > 1) $song.page--;
	    }else if (e.which == $.ui.keyCode.BACKSPACE && e.shiftKey){
	    //Go home
		$("#link_home").trigger("click");
	    }else if (e.which >= 49 && e.which <=57 && (e.which - 48) <= numpages){
		// Go directly to a page
		//if you hit 1-9, go to that page.
		$song.page = e.which - 48;
	    }else if (e.which === 38){ // Transpose chords
		$song.transpose = ($song.transpose + 1) % 12;
	    }else if (e.which === 40){
		$song.transpose = ($song.transpose -1) % 12;
	    }
	    $song.move_to_page($song.page);
	});

	$song.show();
    };

    $song.show_song = function(href){
	$.get(href, function(html){
	    $song.html(html);
	    $song.init();
	});
    };

    return $song;
}

$(document).ready(function(){
    $(document).on("click", "#edit_song A", function(){
	$.get("/edit_song/" + document.song_id, function(data){
	    $("#_dialog_").html(data).dialog(default_dialog_options);
	    $("#_dialog_ INPUT[name=category]").autocomplete({
		source:"/json/categories",
		minLength: 2
	    });

	});
    });
    //delete button
    $(document).on("click", "#delete", function(){
	var really = confirm("You can't UNDO this.  Are you really certain you wish to annihilate this song?");
	if (really){
	    var formdata = $(this).closest("FORM").serialize();
	    $.post("/post/delete", data=formdata, function(){
		//console.log(window.opener);
		document.location.reload();
	    });
	    return false;
	}
    });
});
