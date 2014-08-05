"""
Miscellaneous utility functions for Omega Hymnal
"""

import re, sys
from flask import g


def prep_lyrics(lyrics):
    """Convert markup-format lyrics to HTML.

    Arguments:
      lyrics -- a string containing a page of lyrics.
    """
    chord_replacements = [
    ("{", "<span class=chord>"),
    ("}", "</span>"),
    ("#", "<sup>&#x266F;</sup>"),
    ("b", "<sup>&#x266D;</sup>")
    ]
    chord_regex = re.compile("(\{.*?\})")

    # Insert Breaks at newlines and wrap each line in a span
    lines = [u"<span class='songline'>{}</span><br />"
             .format(line) for line in lyrics.split("\n")]
    lyrics = "\n".join(lines)


    #process chords
    chords = set(chord_regex.findall(lyrics))
    for chord in chords:
        html = chord
        for replacement in chord_replacements:
            html = html.replace(*replacement)
        lyrics = lyrics.replace(chord, html)

    return lyrics

def remove_chords(lyrics):
    """Remove chords from a page of lyrics.

    Arguments:
      lyrics -- a string containing lyrics.
    """
    chord_regex = re.compile("(\{.*?\})")
    lyrics = chord_regex.sub('', lyrics)
    return lyrics

def debug(*messages):
    """Log a message or messages to stderr if debugging is enabled.
    
    Arguments:
      messages -- any number of strings to write to stderr
    """
    if g.debug:
        sys.stderr.write("\n".join([str(m) for m in messages]))
    else:
        pass
    
