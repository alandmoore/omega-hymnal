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

There are many ways to install Omega Hymnal, depending on how you want to use it and your level of technical ability.  The simplest way is to run it locally and connect to it on the same system.

Requirements
------------

- Python 3: http://www.python.org
- Flask 0.1.0: http://flask.pocoo.org
- Any modernish web-browser (Firefox/Chrome/Safari).  Not sure if IE will work.

Installation
------------

- Install the required software
- Download Omega Hymnal and unzip it to a folder
- Run omegahymnal.py
- Point your web browser to http://localhost:5000
- You'll be prompted to initialize a database file.  Click "initialize".
- If you want some initial songs to play with, go to Tools->Import.  You'll find an import file with songs in the "songs" folder.

Advanced
--------

If you want to run Omega Hymnal on a LAN for other computers to access, there are a couple of ways to do it:

- You can edit omegahymnal.conf and uncomment the "HOST=0.0.0.0" line.  Then run Omega Hymnal.  Other computers on the network can then browse to http://host:port where "host" is the hostname or IP address of the computer and "port" is whatever port you configure (5000 by default).

- You can also run Omega Hymnal behind a webserver like Apache just like any other WSGI application.  This takes a little more setup and fiddling; probably there's no need for this unless you're an advanced user.

Usage
=====

Omega Hymnal is pretty simple to use.  Select a song from the list and it displays in a new browser tab on the screen.  The text size is meant to auto-adjust to the available screen width.

By default the left and right arrow keys move you between pages of the song.  The spacebar can be used to "resize" the text if something goes bad.

Chords
------

Chords can be inserted into your music and display above the words like on a guitar sheet.  To add chords, insert the chord symbols between curly braces (that's "{" and "}") wherever they fall in the lyrics.  For example::

  {D}I know that {D7/F#}my re{G}deemer {A7}lives

Omega Hymnal will display each chord above the word following it.  
The following substitutions are made when the chords are displayed:

- The pound sign "#" becomes a sharp symbol
- The lower-case 'b' becomes a flat symbol


NOTE: the UI is currently in a state of flux, this documentation will try to keep up.


Contributing
============

Bugs
----

There are probably lots of bugs in Omega Hymnal.  Please report them to the project's GitHub page.


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
- Try to include chords if possible.  Please keep them simple and reasonably "campfire guitarist" friendly (I know, I love jazz too, but...).


If you intend to do a large contribution of songs, please discuss it with me first so we can set some standards and avoid a lot of wasted or duplicated effort.
