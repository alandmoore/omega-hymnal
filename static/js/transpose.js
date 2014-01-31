/* A library for transposing chord symbols */
/* Written for Omega Hymnal by Alan D Moore */

function transpose_chord(chord, halfsteps){
    //Transposing down will give flats, transposing up gives sharps
    //Not necessarily theoretically correct, but close enough 
    //return if halfsteps is zero and there's nothing to do
    if (halfsteps === 0) {
	return chord;
    }else{
	var old_chord = chord;
    //this is pretty brute-force, there's probably a more clever way to do it
	var notes = { 
	    ''  : { up : '',   down : ''   },
	    'A' : { up : 'A<sup>♯</sup>', down : 'A<sup>♭</sup>' },
	    'A<sup>♯</sup>': { up : 'B',  down : 'A'  },
	    'B<sup>♭</sup>': { up : 'B',  down : 'A'  },
	    'B' : { up : 'C',  down : 'B<sup>♭</sup>' },
	    'C' : { up : 'C<sup>♯</sup>', down : 'B'  },
	    'C<sup>♯</sup>': { up : 'D',  down : 'C'  },
	    'D<sup>♭</sup>': { up : 'D',  down : 'C'  },
	    'D' : { up : 'D<sup>♯</sup>', down : 'D<sup>♭</sup>' },
	    'D<sup>♯</sup>': { up : 'E',  down : 'D'  }, 
	    'E<sup>♭</sup>': { up : 'E',  down : 'D'  }, 
	    'E' : { up : 'F',  down : 'E<sup>♭</sup>' }, 
	    'F' : { up : 'F<sup>♯</sup>', down : 'E'  },
	    'F<sup>♯</sup>': { up : 'G',  down : 'F'  },
	    'G<sup>♭</sup>': { up : 'G',  down : 'F'  },
	    'G' : { up : 'G<sup>♯</sup>', down : 'G<sup>♭</sup>' },
	    'G<sup>♯</sup>': { up : 'A',  down : 'G'  },
	    'A<sup>♭</sup>': { up : 'A',  down : 'G'  },
	};

	var direction = halfsteps > 0? "up":"down";
	//in case it's a slash chord, split it into top and bottom.
	//since javascript regex lacks lookbehind, we'll do some ugly workarounds
	chord = chord.replace(/<\//g, "<|");
	//console.log(chord);
	chord = chord.split(/(\/|-)/);
	//console.log(chord);
	for (c in chord){
	    //restore the mangling we did during the split
	    chord[c] = chord[c].replace(/<\|/g, "</");
	    for (i = 0; i < Math.abs(halfsteps); i++){
		var note = chord[c].match(/\s*([A-G](?:<sup>♯<\/sup>|<sup>♭<\/sup>)?)(.*)/);
		//console.log(chord[c] + " matches note: ", note);
		if (note){
		    note = note[1];
		    var new_note = notes[note][direction];
		    chord[c] = chord[c].replace(/(\s*)[A-G](?:<sup>♯<\/sup>|<sup>♭<\/sup>)?(.*)/, "$1" + new_note + "$2");
		}
	    }
	}

	return chord.join('');
    }
}
