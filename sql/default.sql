-- Default data for OMEGA HYMNAL

-- Default Settings

INSERT OR REPLACE INTO settings(setting_name, setting_value) VALUES
       ('page_forward_key', '.')
       ,('page_backward_key', ',')
       ,('show_author', '0')
       ,('search_author', '1')
       ,('search_category', '1')
;
-- Default Songs

INSERT OR REPLACE INTO songs(id, name, authors, category, keywords) VALUES
       (1, 'Amazing Grace', 'John Newton', 'Hymns', 'grace found hymn traditional') 
       ,(2, 'Joy to the World', 'Isaac Watts, George F. Handel', 'Christmas', 'birth joy traditional christmas')
       ,(3, 'Leaning on the Everlasting Arms', 'Elisha A Hoffman, Anthony J. Showalter', 'Hymns', 'traditional hymn')
;

INSERT OR REPLACE INTO pages(song_id, page_number, lyrics) VALUES

-- Amazing Grace
       (1, 1, 'A{G}mazing {G7}grace! 
How {C}sweet the {G}sound
that {Em}saved a {A7/C#}wretch like {D}me!
I {G}once was {G/B}lost but {C}now am {G}found, 
Was {Em}blind but {Am7}now {D}I {G}see.')
    ,(1, 2, '''Twas {G}grace that {G7}taught 
my {C}heart to {G}fear,
and {Em}grace my {A7}fears {D}relieved;{D7}
How {G}precious {G/B}did that {C}grace 
ap{G}pear the {Em}hour I {Am7}first {D}be{G}lieved!')
    ,(1, 3, 'Through {G}many {G7}dangers, 
{C}toils and {G}snares 
I {Em}have al{A7}ready {D}come;
''Tis {G}grace hath {G/B}brought 
me {C}safe thus {G}far, 
and {Em}grace will {C}lead {D}me {G}home.')
    ,(1, 4, 'When {G}we''ve been {G7}there
ten {C}thousand {G}years,
bright {Em7}shining {A7}as the {D}sun,
We''ve {G}no less {G/B}days to 
{C}sing God''s {G}praise 
then {Em}when we''d {Am7}first {D}be{C}gun.{G}')

-- Joy to the world
    ,(2,1, 'Joy to the world!
the Lord is come;
        Let earth receive her King;
Let every heart prepare Him room,')
    ,(2, 2, 'And heaven and nature sing,
and heaven and nature sing,
and heaven, and heaven 
and nature sing.')
    ,(2, 3, 'Joy to the earth!
the Saviour reigns;
Let men their songs employ;
While fields and floods,
rocks, hills and plains')
    ,(2, 4, 'Repeat the sounding joy,
repeat the sounding joy,
repeat, repeat 
the sounding joy.')
    ,(2, 5, 'He rules the world
with truth and grace,
And makes the nations prove
The glories of His righteousness,')
    ,(2, 6, 'And wonders of His love,
and wonders of His love,
and wonders, and wonders
of His love.')
-- Everlasting Arms
    ,(3, 1, 'What a fellowship, what a joy divine,
Leaning on the everlasting arms;
What a blessedness, what a peace is mine,
Leaning on the everlasting arms.')
    ,(3, 2, 'Leaning, leaning, 
safe and secure from all alarms;
Leaning, leaning, 
leaning on the everlasting arms.')
    ,(3, 3, 'O how sweet to walk in this pilgrim way,
Leaning on the everlasting arms;
O how bright the path grows from day to day,
Leaning on the everlasting arms.')
    ,(3, 4, 'Leaning, leaning, 
safe and secure from all alarms;
Leaning, leaning, 
leaning on the everlasting arms.')
    ,(3, 5, 'What have I to dread, what have I to fear,
Leaning on the everlasting arms;
I have blessed peace with my Lord so near,
Leaning on the everlasting arms.')
    ,(3, 6, 'Leaning, leaning, 
safe and secure from all alarms;
Leaning, leaning, 
leaning on the everlasting arms.')
;
