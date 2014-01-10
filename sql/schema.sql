-- SQL schema for OMEGA HYMNAL
-- Designed for sqlite3

-- Songs table

CREATE TABLE IF NOT EXISTS songs (
       id    	   INTEGER PRIMARY KEY AUTOINCREMENT
       ,name 	   TEXT NOT NULL
       ,authors	   TEXT
       ,category   TEXT
       ,keywords   TEXT
);

-- Pages table

CREATE TABLE IF NOT EXISTS pages (
       song_id	    INTEGER REFERENCES songs(id)
       ,page_number INT
       ,lyrics	    TEXT
       ,CONSTRAINT pages_pk PRIMARY KEY (song_id, page_number)
);


-- Settings table

CREATE TABLE IF NOT EXISTS settings(
       setting_name TEXT PRIMARY KEY
       ,setting_value TEXT
);


-- Song list view

CREATE VIEW IF NOT EXISTS song_list_v AS
SELECT s.id
       ,s.name
       ,s.authors
       ,s.category
       ,s.keywords
       ,p.lyrics as first_page
       ,p.lyrics LIKE '%{%}%' AS has_chords
FROM songs s
LEFT OUTER JOIN pages p ON s.id = p.song_id AND p.page_number = 1
;
