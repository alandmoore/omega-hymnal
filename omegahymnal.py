#!/usr/bin/env python
"""
OMEGA HYMNAL
Copyright 2014 Alan D Moore
www.alandmoore.com
Licensed to you under the terms of the GNU GPL v3.
See the included COPYING file for details.

OMEGA HYMNAL is a song lyrics display program designed for use
in informal settings such as small group meetings, jam sessions,
rehearsals, or anywhere else you might have wasted a lot of paper
printing up lyrics and chords for everyone.

It's written in python and requires the python flask framework
and your favorite standards-compliant web browser.

"""


from flask import Flask, g, render_template, request, url_for, redirect, session
from includes.database import Database

app = Flask(__name__)


@app.before_request
def before_request():
    g.db = Database(app.config.get("DATABASE_FILE"))

@app.route("/")
def index():
    songs = g.db.query("SELECT * FROM song_list_v ORDER BY name")
    songs = [dict(x) for x in songs]
    return songs.__str__()

if __name__ == "__main__":
    app.debug = True
    app.config.from_pyfile("omegahymnal.conf", silent=True)
    app.run()
