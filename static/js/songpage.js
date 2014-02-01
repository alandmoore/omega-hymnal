//Functions for the omega hymnal song page

function fitDivToPage(div) {
    var target_height =  window.innerHeight - $("NAV").outerHeight();
    var numbreaks = $(div +" > br").size() +1;
    var target_width = window.innerWidth * .95;
    var line_size = target_height / numbreaks;
    var font_size = line_size;
    var has_chords = $(div).find(".chord").length > 0;
    //console.log("Has chords: ", has_chords);
    if (has_chords){
	font_size = .65 * line_size;
	$(div).css("padding-top", "1em");
	$(div).css("padding-bottom", "1em");
    }
    $(div).css("line-height", line_size+"px");
    $(div).css("white-space", "nowrap");
    $(div).css("font-size", font_size+"px");
    //console.log("Area WxH: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    //The basic concept here is to shrink the text by 10% until the scrollwidth is less than the target width, and scrollheight likewise.  
    //This would indicate a lack of scrollbars.
    while (($(div)[0].scrollWidth > target_width || $(div)[0].scrollHeight > target_height) && font_size > 12){
	//	console.log(font_size);
	font_size *= .9;
	$(div).css("font-size", font_size+"px");
 
	//console.log("fontsize: ", font_size, "; Line height: ", line_size, "; Div target W,H: ", target_width, target_height, "; Div scroll W, H: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    }
    $(div).width($(div)[0].scrollWidth);
    $(".chord").css("bottom", (line_size * .3)+"px");
}


$(document).ready(function(){
    var page = 1;
    var numpages = $('.songpage').size();
    document.original_chords = $(".chord").clone();
    document.listwindow = window.opener;
    document.transpose = 0;
    //page movment function
    function move_to_page(pagenumber){
	var div = "#page"+pagenumber;
	$('.songpage').stop().fadeOut(100);
	$(div).stop().fadeIn(200);
	$("#songtitle").html("<span>&quot;" + $(div).attr("data-songtitle") + "&quot;</span>");
	$('#pagecounter').html("<span>Page " + pagenumber + " / " + numpages + "</span>");
	if (document.transpose !== 0){
	    var sign = (document.transpose > 0)?"♯":"♭";
	    $("#transpose").html("Tr: " + sign + Math.abs(document.transpose));
	}else{
	    $("#transpose").html("Tr: ♮ ");
	}
	$(".chord").each(function(i, el){
	    $(el).html(transpose_chord(document.original_chords[i].innerHTML, document.transpose));
	});
	setTimeout( function(){fitDivToPage(div);}, 50);
    }
    
    if (numpages > 0){
	move_to_page(1);
	//var firstpage = function(){move_to_page(1)};
	//setTimeout('firstpage()', 500);
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
	    if (page < numpages){ page++;}
	}
	//Page backwards
	else if (("page_backward_key" in window && e.which == parseInt(page_backward_key,10) )
		 || e.which == $.ui.keyCode.LEFT){
	    if (page > 1) page--;
	}
	//Go home
	else if (e.which == $.ui.keyCode.BACKSPACE && e.shiftKey){
	    $("#link_home").trigger("click");
	}
	// Go directly to a page
	else if (e.which >= 49 && e.which <=57 && (e.which - 48) <= numpages){
	    //if you hit 1-9, go to that page.
	    page = e.which - 48;
	}
	// Transpose chords
	else if (e.which === 38){
	    document.transpose = (document.transpose + 1) % 12;
	}
	else if (e.which === 40){
	    document.transpose = (document.transpose -1) % 12;
	}
	move_to_page(page);
    });
    }
    
    $(document).on("click", "#edit_song A", function(){
	$.get("/edit_song/"+document.song_id, function(data){
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
		document.listwindow.location.reload();
		setTimeout(window.close, 500);
	    });
	    return false;
	}
    });
});
