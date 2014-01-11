"""
Database model for OMEGA HYMNAL.
"""

import sqlite3
from .util import prep_lyrics

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

        
    ###########
    # Getters #
    ###########

    def get_songlist(self):
        songs = self.query("SELECT * FROM song_list_v ORDER BY name")
        return songs

    def get_categories(self):
        categories = self.query("SELECT DISTINCT category FROM songs ORDER BY category")
        categories = [x["category"] for x in categories]
        return categories
    

    def get_song(self, id):
        song = self.query("""SELECT * FROM songs WHERE id=?""", (id,))
        if not song:
            return {}
        song = song[0]
        song["pages"] = self.query("""SELECT * FROM pages WHERE song_id=? ORDER BY page_number ASC""", (id,))
        for i, page in enumerate(song.get("pages")):
            lyrics = page.get("lyrics")
            song["pages"][i]["lyrics_prepped"] = prep_lyrics(lyrics)
        return song

    ###########
    # Setters #
    ###########

    def save_song(self, formdata):
        new_record = not formdata.get("id")
        print(new_record)
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
        self.query(query, qdata, False)
        song_id = (new_record and self.cu().lastrowid) or int(formdata.get("id"))

        pages = [p for p in formdata.getlist("page") if p]
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
