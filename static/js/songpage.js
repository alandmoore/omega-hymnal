//Functions for the omega hymnal song page

function fitDivToPage(div) {
    var page_width = window.innerWidth;
    var page_height =  window.innerHeight - $("NAV").outerHeight();
    var numbreaks = $(div +" > br").size() +1;
    //the proper size according to height
    var target_width = $(div).innerWidth();
    //var target_width = page_width;
    var target_height = page_height;
    var line_size = target_height / numbreaks;
    var font_size = line_size;
    var has_chords = $(".chord").length > 0;
    console.log("Has chords: ", has_chords);
    if (has_chords){
	font_size = .65 * line_size;
    }
    $(div).css("white-space", "nowrap");
    $(div).css("font-size", font_size+"px");
    //console.log("Area WxH: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    while (($(div)[0].scrollWidth > target_width || $(div)[0].scrollHeight > target_height) && font_size > 12){
	//	console.log(font_size);
	font_size *= .9;
	$(div).css("font-size", font_size+"px");
 
    //console.log("fontsize: ", font_size, "; Line height: ", line_size, "; Div target W,H: ", target_width, target_height, "; Div W, H: ", $(div)[0].scrollWidth, $(div)[0].scrollHeight);
    }
    $(div).css("line-height", line_size+"px");
    $(".chord").css("bottom", (line_size * .3)+"px");
}


$(document).ready(function(){
    var page = 1;
    var numpages = $('.songpage').size();
    document.listwindow = window.opener;
    //page movment function
    function move_to_page(pagenumber){
	var div = "#page"+pagenumber;
	$('.songpage').stop().fadeOut(100);
	$(div).stop().fadeIn(200);
	$("#songtitle").html("<span>&quot;" + $(div).attr("data-songtitle") + "&quot;</span>");
	$('#pagecounter').html("<span>Page " + pagenumber + " / " + numpages + "</span>");
	setTimeout( function(){fitDivToPage(div);}, 100);
    }
    
    if (numpages > 0){
	move_to_page(1);
	//var firstpage = function(){move_to_page(1)};
	//setTimeout('firstpage()', 500);
    $(document).keydown(function(e){
	console.log(e);
	console.log("keycode pressed:" + e.which);
	if (("page_forward_key" in window && e.which == parseInt(page_forward_key, 10) )
	    || e.which == $.ui.keyCode.RIGHT){
	    //forward page
	    if (page < numpages){ page++;}
	}
	else if (("page_backward_key" in window && e.which == parseInt(page_backward_key,10) )
		 || e.which == $.ui.keyCode.LEFT){
	    if (page > 1) page--;
	}
	else if (e.which == $.ui.keyCode.BACKSPACE && e.shiftKey){
	    $("#link_home").trigger("click");
	}else if (e.which >= 49 && e.which <=57 && (e.which - 48) <= numpages){
	    //if you hit 1-9, go to that page.
	    page = e.which - 48;
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
		console.log(window.opener);
		document.listwindow.location.reload();
		setTimeout(window.close, 500);
	    });
	    return false;
	}
    });
});
