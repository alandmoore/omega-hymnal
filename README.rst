==============
 OMEGA HYMNAL
==============

About
=====

Omega Hymnal is a program for displaying song lyrics (and optionally chords), such as you might do in a church setting, but aimed at more informal worship or singing scenarios like home fellowships, rehearsals, holiday caroling, retreats, and so on.

Omega Hymnal is written in Python and designed to run as a web service, so it can be used on a single computer, or run as a server so that any device on a LAN with a web browser can use it.

Omega Hymnal is free software released under the GNU GPL version 3.

Installation
============

See the included INSTALL.rst file for information on how to install Omega Hymnal to your system.

Usage
=====

Omega Hymnal is pretty simple to use.  Select a song from the list and it displays in a new browser tab on the screen.  The text size is meant to auto-adjust to the available screen width.

By default the left and right arrow keys move you between pages of the song.  Shift+Backspace closes the song tab.  The spacebar can be used to "resize" the text if something goes bad, and you can hit a number from 1 to 9 to go directly to that page, if it exists.

Transpose
---------

You can also transpose chords using the up-arrow and down-arrow keys on your keyboard.  This will attempt to transpose all the chords up or down (respectively) one half-step.  You can do this repeatedly until you get to the key you want.  Transposition is temporary and only lasts while you have the song's tab open.

The transpose isn't terribly smart about key signature and doing proper flats or sharps; it will basically do sharps if you go up, and flats if you go down.  It won't do things like double sharps, double flats, or accidentals that refer to regular notes (e.g., it won't do "C flat", it'll just do "B").  It works pretty well for moving simple songs between "natural" keys, though; I don't know many people who want to play in G flat, anyway.

If the transpose gets out of whack and you want to go back to the original chords, just refresh the page.

If you intend to use the transpose feature, follow the guidelines below for writing compatible chords.

Editing Songs
-------------

Clicking "New Song" on the main screen or "Edit" on a song screen will let you edit the song.  You can fill in the name, authors, category, and kewords at the top.  Each page is represented by a text box under the "Pages" header.  As you put lyrics in the last empty text box, a new empty text box will appear after it.  The order of pages will be as you enter.

Alternately, you can insert a "[pagebreak]" tag (lowercase, in square brackets as shown) to break a page within a single text box.  This is useful if you want to edit your lyrics in an external text editor, or if you need to break up a page in the middle of a long song.  Note that the "[pagebreak]" tag will not be saved with the song, but rather the pages will be saved broken out at that point.


Chords
------

Chords can be inserted into your music and display above the words like on a guitar sheet.  To add chords, insert the chord symbols between curly braces (that's "{" and "}") wherever they fall in the lyrics.  For example::

  {D}I know that {D7/F#}my re{G}deemer {A7}lives

Omega Hymnal will display each chord above the word following it.  
The following substitutions are made when the chords are displayed:

- The pound sign "#" becomes a sharp symbol
- The lower-case 'b' becomes a flat symbol

If you want transpose to work reliably, you need to follow these guidelines:

- Don't put anything that isn't a chord in the curly braces.
- Don't use "-" for "minor".  Just use a lowercase "m", or "min", because...
- If you need to have a sequence of chords together, separate each chord with a "-" (and spaces, if you like), like so::

    {D - A/C#}All our {Bm}sins and griefs to {A - Asus4 - A}bear.

- Use capitol letters A through G for the note names.  Use only flat (b) or sharp (#) as accidentals.
- Don't put HTML tags in your chords.  I don't think this works anyway.


Contributing
============

Bugs
----

There are probably lots of bugs in Omega Hymnal.  Please report them to the project's GitHub page.

Be aware that Omega Hymnal is developed and tested on Linux (Arch and Debian) and not routinely tested on Windows or OSX.


Feature Requests
----------------

As always, there are three ways to get a feature added to Omega Hymnal:

- Fork it on GitHub, write the code, and submit a pull request
- Contact me and offer to sponsor the feature's development in some way (money, gifts, coffee, etc).
- Pray earnestly that someone else does one of the other two things.

Songs
-----

It would be really nice for users if Omega Hymnal came with a useful selection of songs.  If you would like to contribute some, you can send me the .omegahymnal (export) file and I'll add it if it meets standards.

Songs must meet these requirements:

- They must be *Public Domain* or otherwise licensed in a way that's compatible with the project's GPL3 license.  Songs from before 1930 are usually safe.  The hot new song on Christian radio is usually not. :-)  Note that many old hymns have been "modernized" recently with added sections; these are probably under copyright and shouldn't be included.
- Stick to well-known, mainstream songs.  There's no reason to load the database with obscure stuff nobody will know.  
- Include authors when available.  Include keywords too.  Keywords are words a person might associate with the song that aren't part of the title but you'd want to search on.  For example, "The First Noel" might have keywords "christmas angels shepherds star nativity".  Include a category only if it's obvious (e.g. Christmas, Easter, or Children).
- I've included Christian hymns so far, but nonreligious songs or songs from other faith traditions are also fine; if any are submitted I will probably split these out into multiple files organized by faith.  I reserve the right not to include offensive or objectionable songs.
- Until I have a way to vet non-English songs for copyright or content problems, I'm going to have to accept only English songs.  I'm open to discussion on this if you have a solution to the potential problems it poses.
- Try to include chords if possible.  Please keep them simple and reasonably "campfire guitarist" friendly (I know, I love jazz too, but...).  Make sure they work reliably with the transpose feature.


If you intend to do a large contribution of songs, please discuss it with me first so we can set some standards and avoid a lot of wasted or duplicated effort.
