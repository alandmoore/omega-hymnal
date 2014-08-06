"""
Database model for OMEGA HYMNAL.
"""

import sqlite3
from .util import prep_lyrics, debug
from itertools import chain
import re


class Database:

    """The database model

    This defines all methods for accessing data in the data file.
    """

    def __init__(self, dbfile):
        """Construct a database instance.

        Arguments:
          dbfile -- A path to sqlite3 file.  It need not actually exist.
        """
        self.dbfile = dbfile
        self.cx_obj = None
        self.cu_obj = None

    def cx(self):
        """Return a connection object to the database.

        Use this method in place of the connection object
        to ensure a valid connection.
        """
        if not self.cx_obj:
            self.cx_obj = sqlite3.connect(self.dbfile)
            self.cx_obj.row_factory = sqlite3.Row
        return self.cx_obj

    def cu(self):
        """Return a cursor object for the current connection.

        Use this method in place of a cursor object to ensure a valid cursor.
        """
        if not self.cu_obj:
            self.cu_obj = self.cx().cursor()
        return self.cu_obj

    def query(self, query, data=None, return_results=True):
        """Run a query and return the results.

        Arguments:
          query -- The query to run.
          data -- a dict or iterable containing parameter data for the query
          return_results -- Whether or not results should be returned.
                            Implies a "SELECT" statement, basically.
        """
        if data is None:
            self.cu().execute(query)
        else:
            self.cu().execute(query, data)
        if return_results:
            results = self.cu().fetchall()
            return [dict(x) for x in results]
        else:
            self.cx().commit()
            return None

    def initialize(self):
        """Create a fresh, empty database."""
        with open("sql/schema.sql", 'r') as sqlfile:
            self.cu().executescript(sqlfile.read())

    def do_initialize_db(self, formdata, *args, **kwargs):
        """Check confirmation before initializing the database.
        
        Arguments:
          formdata -- a dict or hashable containing submitted form data.
        *args and **kwargs are thrown away, they're there to consume 
        any extra args sent by the controller.
        """
        confirm = formdata.get("init_db")
        if confirm:
            self.initialize()
        return ''

    def get_missing_tables(self):
        """Check the database for any missing tables.

        Return a list of missing tables, if any.
        """
        query = """SELECT name FROM sqlite_master WHERE type='table'"""
        are_tables = [x.get("name") for x in self.query(query)]
        debug("Tables that exist: " + str(are_tables))
        should_be_tables = ["settings", "songs", "pages"]
        missing = [table for table in should_be_tables
                   if table not in are_tables]
        return missing

    ###########
    # Getters #
    ###########

    def get_songlist(self, *args, **kwargs):
        """Return a list of information about the songs in the database

        Used for building the main song list.  *args and **kwargs are not
        used, but consume extra args from the controller.
        """
        songs = self.query("SELECT * FROM song_list_v ORDER BY name")
        for i, song in enumerate(songs):
            songs[i]["first_page"] = re.sub("\{.*?\}", "",
                                            song["first_page"] or '')
        return songs

    def get_categories(self, *args, **kwargs):
        """Return a list of the song categories.

        Keyword Arguments:
          term -- string to match categories against
        """
        term = kwargs.get("term", '') + '%'
        categories = self.query(
            """SELECT DISTINCT category
            FROM songs WHERE category like ?
            ORDER BY category""", 
            (term,)
        )
        categories = [x["category"] for x in categories]
        return categories

    def get_names(self, *args, **kwargs):
        """Return a list of song names.

        Keyword Arguments:
          term -- string to match names against
        """
        debug(kwargs)
        term = kwargs.get("term", '') + "%"
        names = self.query(
            """SELECT DISTINCT name """
            """FROM songs WHERE name like ? """
            """ORDER BY name""", (term,))
        names = [x["name"] for x in names]
        return names

    def get_song(self, id, *args, **kwargs):
        """Return all information about a song.

        Arguments:
          id -- song id (integer)
        *args and **kwargs aren't used, they just consume extra args
        from the controller.
        """
        song = self.query("""SELECT * FROM songs WHERE id=?""", (id,))
        if not song:
            return {}
        song = song[0]
        song["pages"] = self.query(
            """SELECT page_number, lyrics """
            """FROM pages WHERE song_id=? """
            """ORDER BY page_number ASC""", (id,))
        if not kwargs.get("no_prep_lyrics"):
            for i, page in enumerate(song.get("pages")):
                lyrics = page.get("lyrics")
                song["pages"][i]["lyrics_prepped"] = prep_lyrics(lyrics)
        return song

    def get_export_song_ids(self, formdata=None, *args, **kwargs):
        """Return a list of ids and names of songs to be exported.

        Takes the export form data and matches songs against those parameters.
        Arguments:
          formdata -- data from the export song form.
        """
        if formdata is None:
            formdata = kwargs
        export_type = formdata.get("type")
        debug(export_type)
        if export_type == "name":
            qdata = {"name": formdata.get("name")}
            query = "SELECT id, name FROM songs WHERE name like :name"
        elif export_type == "category":
            qdata = {"category": formdata.get("category")}
            query = "SELECT id, name FROM songs WHERE category like :category"
        elif export_type == "keyword":
            qdata = {"keywords": "%{}%".format(formdata.get("keywords"))}
            query = "SELECT id,name FROM songs WHERE keywords like :keywords"
        elif export_type == "author":
            qdata = {"authors": "%{}%".format(formdata.get("authors"))}
            query = "SELECT id,name FROM songs WHERE authors like :authors"
        else:  # Default to "all"
            qdata = {}
            query = "SELECT id,name FROM songs"
        print(query)
        print(qdata)
        idlist = self.query(query, qdata)
        idlist = dict([(x["id"], x["name"]) for x in idlist])

        return idlist

    def export_songs(self, formdata, *args, **kwargs):
        """Return all data about songs matching export form data. 

        Arguments:
          formdata -- data from the export song form.
        """
        idlist = self.get_export_song_ids(formdata)
        export = []
        for song_id in idlist.keys():
            export.append(self.get_song(song_id, no_prep_lyrics=True))
        return export

    def get_settings(self):
        """Return all settings stored in the database."""
        settings = self.query("SELECT * FROM settings ORDER BY setting_name")
        settings = dict([(x["setting_name"], x["setting_value"])
                         for x in settings])
        return settings

    ###########
    # Setters #
    ###########

    def save_posted_song(self, formdata):
        """Prepare POSTed song data and save it to the database.

        This is for a song received from http POST.  If an "id" is present,
        it will try to update a song with that id.
        
        Arguments:
          formdata -- data from a song form.
        """
        new_record = formdata.get("id") == 'None'
        pages = [p for p in formdata.getlist("page") if p]
        formdata = dict([(key,  value) for key, value in formdata.items()])
        formdata["pages"] = pages
        return self.save_song(formdata, new_record)

    def save_imported_song(self, formdata):
        """Prepare song data from an import file
        and save it to the database.

        Arguments:
          formdata -- data from the import songs form.
        """
        new_record = True
        pages = []
        for page in sorted(formdata.get("pages"),
                           key=lambda k: k["page_number"]):
            pages.append(page.get("lyrics"))
        formdata["pages"] = pages
        return self.save_song(formdata, new_record)

    def save_song(self, formdata, new_record=True):
        """Actually write prepped song data to the database.
 
        Arguments:
          formdata -- a dict containing the song data.
          new_record -- indicates if this is a new song to be added, 
                        or an exising one being edited.
        """
        qdata = {
            "name": formdata.get("name"),
            "authors": formdata.get("authors"),
            "category": formdata.get("category"),
            "keywords": formdata.get("keywords"),
            }
        if new_record:
            query = (
                """INSERT INTO songs (name, authors, category, keywords)
                VALUES (:name, :authors, :category, :keywords)"""
            )
        else:
            query = (
                """UPDATE songs
                SET name=:name, authors=:authors,
                category=:category, keywords=:keywords
                WHERE id=:id """
            )
            qdata["id"] = formdata.get("id")
        debug(query, qdata)
        self.query(query, qdata, False)
        song_id = (
            (new_record 
            and self.cu().lastrowid)
            or int(formdata.get("id"))
        )

        pages = formdata.get("pages")
        # Process pagebreaks in the lyric pages
        pages = [page.strip() for page in
                 chain(*[p.split("[pagebreak]") for p in pages])
                 if page.strip()]
        for pagenum, page in enumerate(pages):
            qdata = {
                "song_id": song_id,
                "page_number": pagenum + 1,
                "lyrics": page
                }
            query = (
                """INSERT OR REPLACE INTO pages
                (song_id, page_number, lyrics)
                VALUES (:song_id, :page_number, :lyrics)"""
            )
            debug(query)
            debug(qdata)
            self.query(query, qdata, False)
        # remove orphan pages from the song
        num_pages = len(pages)
        self.query(
            """DELETE FROM pages
            WHERE song_id=:song_id and page_number > :num_pages""",
            {"song_id": song_id, "num_pages": num_pages}, False)

        return str(song_id)

    def delete_song(self, formdata):
        """Delete a song from the database, as defined by <id>.

        Arguments:
          formdata -- data from the delete song form.  Should contain an "id"
        """
        song_id = int(formdata.get("id"))
        query = "DELETE FROM pages WHERE song_id=?"
        self.query(query, (song_id,), False)
        query = "DELETE FROM songs WHERE id=?"
        self.query(query, (song_id,), False)

        return ""

    def save_settings(self, formdata):
        """Write POSTed settings data to the database.

        Arguments:
          formdata -- data from the settings form.
        """
        query = (
            """INSERT OR REPLACE INTO
            settings(setting_name, setting_value)
            VALUES(?, ?)"""
        )
        for key, value in formdata.items():
            self.query(query, (key, value), False)
        return ""
