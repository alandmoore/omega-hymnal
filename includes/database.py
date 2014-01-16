"""
Database model for OMEGA HYMNAL.
"""

import sqlite3
from .util import prep_lyrics
from flask import json


class Database:

    def __init__(self, dbfile):
        self.dbfile = dbfile
        self.cx_obj = None
        self.cu_obj = None

    def cx(self):
        if not self.cx_obj:
            self.cx_obj = sqlite3.connect(self.dbfile)
            self.cx_obj.row_factory = sqlite3.Row
        return self.cx_obj

    def cu(self):
        if not self.cu_obj:
            self.cu_obj = self.cx().cursor()
        return self.cu_obj

    def query(self, query, data=None, return_results=True):
        if data is None:
            self.cu().execute(query)
        else:
            self.cu().execute(query, data)
        if return_results:
            results =  self.cu().fetchall()
            return [dict(x) for x in results]
        else:
            self.cx().commit()
            return None

    def initialize(self):
        """
        Creates a fresh, empty database.
        """
        with open("sql/schema.sql", 'r') as sqlfile:
            self.cu().executescript(sqlfile.read())

    def do_initialize_db(self, formdata, *args, **kwargs):
        confirm = formdata.get("init_db")
        if confirm:
            self.initialize()
        return ''

    def get_missing_tables(self):
        query = """SELECT name FROM sqlite_master WHERE type='table'"""
        are_tables = [x.get("name") for x in self.query(query)]
        print("Tables that exist: " + are_tables.__str__())
        should_be_tables = ["settings", "songs", "pages"]
        missing = [table for table in should_be_tables if table not in are_tables]
        return missing
    
    ###########
    # Getters #
    ###########

    def get_songlist(self, *args, **kwargs):
        songs = self.query("SELECT * FROM song_list_v ORDER BY name")
        return songs

    def get_categories(self, *args, **kwargs):
        term = kwargs.get("term", '') + '%'
        categories = self.query("SELECT DISTINCT category FROM songs WHERE category like ? ORDER BY category", (term,))
        categories = [x["category"] for x in categories]
        return categories

    def get_names(self, *args, **kwargs):
        print(kwargs)
        term = kwargs.get("term", '') + "%"
        names = self.query("SELECT DISTINCT name FROM songs WHERE name like ? ORDER BY name", (term,))
        names = [x["name"] for x in names]
        return names

    def get_song(self, id, *args, **kwargs):
        song = self.query("""SELECT * FROM songs WHERE id=?""", (id,))
        if not song:
            return {}
        song = song[0]
        song["pages"] = self.query("""SELECT page_number, lyrics FROM pages WHERE song_id=? ORDER BY page_number ASC""", (id,))
        if not kwargs.get("no_prep_lyrics"):
            for i, page in enumerate(song.get("pages")):
                lyrics = page.get("lyrics")
                song["pages"][i]["lyrics_prepped"] = prep_lyrics(lyrics)
        return song

    
    def get_export_song_ids(self, formdata=None, *args, **kwargs):
        if formdata is None:
            formdata = kwargs
        export_type = formdata.get("type")
        print(export_type)
        if export_type == "name":
            qdata = {"name" : formdata.get("name")}
            query = "SELECT id, name FROM songs WHERE name like :name"
        elif export_type == "category":
            qdata = {"category" :formdata.get("category")}
            query = "SELECT id, name FROM songs WHERE category like :category"
        elif export_type == "keyword":
            qdata = {"keywords" : "%{}%".format(formdata.get("keywords"))}
            query = "SELECT id,name FROM songs WHERE keywords like :keywords"
        elif export_type == "author":
            qdata = {"authors" : "%{}%".format(formdata.get("authors"))}
            query = "SELECT id,name FROM songs WHERE authors like :authors"
        else:  #Default to "all"
            qdata = {}
            query = "SELECT id,name FROM songs"
        print (query)
        print (qdata)
        idlist = self.query(query, qdata)
        idlist = dict([(x["id"], x["name"]) for x in idlist])

        return idlist

    def export_songs(self, formdata, *args, **kwargs):
        idlist = self.get_export_song_ids(formdata)
        export = []
        for song_id in idlist.keys():
            export.append(self.get_song(song_id, no_prep_lyrics=True))
        return export
            
    def get_settings(self):
        settings = self.query("SELECT * FROM settings ORDER BY setting_name")
        settings = dict([(x["setting_name"], x["setting_value"]) for x in settings])
        return settings
    
        
    
    ###########
    # Setters #
    ###########

    def save_posted_song(self, formdata):
        new_record = formdata.get("id") == 'None'
        pages = [p for p in formdata.getlist("page") if p]
        formdata = dict([(key,  value) for key, value in formdata.items()])
        formdata["pages"] = pages
        return self.save_song(formdata, new_record)

    def save_imported_song(self, formdata):
        new_record = True
        pages = []
        for page in sorted(formdata.get("pages"), key= lambda k: k["page_number"]):
            pages.append(page.get("lyrics"))
        formdata["pages"] = pages
        return self.save_song(formdata, new_record)

    def save_song(self, formdata, new_record=True):
        qdata = {
            "name" : formdata.get("name"),
            "authors" : formdata.get("authors"),
            "category" : formdata.get("category"),
            "keywords" : formdata.get("keywords"),
            }
        if new_record:
            query = """INSERT INTO songs (name, authors, category, keywords)
            VALUES (:name, :authors, :category, :keywords)"""
        else:
            query = """UPDATE songs SET name=:name, authors=:authors, category=:category, keywords=:keywords WHERE id=:id """
            qdata["id"] = formdata.get("id")
        print(query, qdata)
        self.query(query, qdata, False)
        song_id = (new_record and self.cu().lastrowid) or int(formdata.get("id"))

        pages = formdata.get("pages")
        for pagenum, page in enumerate(pages):
            qdata = {
                "song_id" : song_id,
                "page_number" : pagenum +1,
                "lyrics" : page
                }
            query = "INSERT OR REPLACE INTO pages (song_id, page_number, lyrics) VALUES (:song_id, :page_number, :lyrics)"
            print(query)
            print(qdata)
            self.query(query, qdata, False)
        #remove orphan pages from the song
        num_pages = len(pages)
        self.query("""DELETE FROM pages WHERE song_id=:song_id and page_number > :num_pages""", {"song_id":song_id, "num_pages":num_pages}, False)
        
        return song_id.__str__()

    def delete_song(self, formdata):
        song_id = int(formdata.get("id"))
        query = "DELETE FROM pages WHERE song_id=?"
        self.query(query, (song_id,), False)
        query = "DELETE FROM songs WHERE id=?"
        self.query(query, (song_id,), False)

        return ""

    def save_settings(self, formdata):
        query = """INSERT OR REPLACE INTO settings(setting_name, setting_value) VALUES(?, ?)"""
        for key, value in formdata.items():
            self.query(query, (key, value), False)
        return ""
        
