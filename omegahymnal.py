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


from flask import Flask, g, render_template, request, url_for, redirect, session, abort
from includes.database import Database

app = Flask(__name__)


@app.before_request
def before_request():
    g.db = Database(app.config.get("DATABASE_FILE"))

@app.route("/")
def index():
    songs = g.db.get_songlist()
    categories = g.db.get_categories()
    return render_template("main.jinja2", songs=songs, categories=categories)

@app.route("/song/<id>")
def song(id):
    song = g.db.get_song(int(id))
    return render_template("song.jinja2", song=song)

@app.route("/edit_song/<id>")
def edit_song(id):
    song = g.db.get_song(int(id))
    return render_template("edit_form.jinja2", song=song)

@app.route("/settings")
def settings():
    return render_template("base.jinja2")

@app.route("/post/<callback>", methods=["POST"])
def post(callback):
    callbacks = {
        "song" : g.db.save_song
                 }
    if callback not in callbacks.keys():
        abort(403)
    else:
        result = callbacks.get(callback)(request.form)
        return result

if __name__ == "__main__":
    app.debug = True
    app.config.from_pyfile("omegahymnal.conf", silent=True)
    app.run(
        host=app.config.get("HOST", 'localhost'),
        port=app.config.get("PORT", 5000)
            )
