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
- Flask 1.0: http://flask.pocoo.org
- Any modernish web-browser (Firefox/Chrome/Safari)

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

