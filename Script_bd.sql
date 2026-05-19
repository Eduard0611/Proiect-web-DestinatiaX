DROP TABLE IF EXISTS zboruri CASCADE;
DROP TYPE IF EXISTS continente CASCADE;
DROP TYPE IF EXISTS clase_zbor CASCADE;
DROP TYPE IF EXISTS tip_escala CASCADE;

CREATE TYPE continente AS ENUM('Asia', 'America', 'Europa', 'Africa', 'Australia');
CREATE TYPE clase_zbor AS ENUM('Economy', 'Premium Economy', 'Business', 'First Class');
CREATE TYPE tip_escala AS ENUM('Direct', '1 Escala', '2+ Escale');

CREATE TABLE zboruri (
   id serial PRIMARY KEY,

   titlu_zbor VARCHAR(100) UNIQUE NOT NULL, 

   descriere TEXT,

   imagine VARCHAR(300),

   continent continente,
   clasa clase_zbor,      
                       
   pret NUMERIC(8,2) NOT NULL CHECK (pret >= 0),      
   locuri_disponibile INT NOT NULL CHECK (locuri_disponibile >= 0),
   
   data_plecare TIMESTAMP NOT NULL,                   
   data_sosire TIMESTAMP NOT NULL,
   
   companie_aeriana VARCHAR(50) NOT NULL,              

   facilitati VARCHAR(200),                           

   zbor_international BOOLEAN NOT NULL DEFAULT FALSE,

   tip_zbor tip_escala DEFAULT 'Direct',

   oras_plecare VARCHAR(100) DEFAULT 'București (OTP)',
   oras_sosire VARCHAR(100) NOT NULL

);


INSERT INTO zboruri (titlu_zbor, descriere, imagine, continent, clasa, pret, locuri_disponibile, data_plecare, data_sosire, companie_aeriana, facilitati, zbor_international, oras_plecare, oras_sosire, tip_zbor) VALUES 

('City Break Paris', 'Zbor rapid spre inima Franței.', 'paris.jpg', 'Europa', 'Economy', 120.50, 45, '2026-06-10 08:30:00', '2026-06-10 11:30:00', 'WizzAir', 'bagaj mana, check-in online', TRUE, 'București (OTP)', 'Paris (CDG)', 'Direct'),

('Weekend la Roma', 'Pizza și istorie la un preț mic.', 'roma.jpg', 'Europa', 'Economy', 45.99, 120, '2026-06-05 14:00:00', '2026-06-05 15:00:00', 'Ryanair', 'bagaj mana', TRUE, 'Timișoara (TSR)', 'Roma (FCO)', 'Direct'),

('Aventura la New York', 'Zbor transatlantic spre orașul care nu doarme.', 'new-york.jpg', 'America', 'Premium Economy', 650.00, 15, '2026-08-01 10:00:00', '2026-08-01 22:00:00', 'Lufthansa', 'bagaj cala, filme, meniu cald, wifi', TRUE, 'București (OTP)', 'New York (JFK)', '1 Escala'),

('Zbor Intern Cluj', 'Cea mai rapidă cale între capitală și Ardeal.', 'cluj.jpg', 'Europa', 'Economy', 65.00, 80, '2026-05-20 07:00:00', '2026-05-20 07:50:00', 'Tarom', 'bagaj mana, cafea inclusa', FALSE, 'București (OTP)', 'Cluj-Napoca (CLJ)', 'Direct'),

('Vacanta in Maldive', 'Evadați pe o insulă pustie.', 'maldive.jpg', 'Asia', 'Business', 1250.00, 8, '2026-07-15 22:00:00', '2026-07-16 10:00:00', 'Qatar Airways', 'bagaj cala, meniu cald, patura, ecran, sampanie', TRUE, 'București (OTP)', 'Male (MLE)', '1 Escala'),

('Afaceri in Londra', 'Ideal pentru întâlniri.', 'londra.jpg', 'Europa', 'Business', 210.00, 12, '2026-05-20 06:15:00', '2026-05-20 08:00:00', 'British Airways', 'bagaj cala, prioritate, lounge', TRUE, 'București (OTP)', 'Londra (LHR)', 'Direct'),

('Safari in Kenya', 'Întâlnire cu leii.', 'kenya.jpg', 'Africa', 'Economy', 740.00, 25, '2026-09-10 23:30:00', '2026-09-11 10:30:00', 'Turkish Airlines', 'bagaj cala, meniu cald, perna', TRUE, 'București (OTP)', 'Nairobi (NBO)', '1 Escala'),

('Descoperă Tokyo', 'O călătorie lungă, dar merită.', 'tokyo.jpg', 'Asia', 'First Class', 1980.00, 4, '2026-10-12 18:00:00', '2026-10-13 16:00:00', 'Emirates', 'bagaj cala mare, spatiu extra, filme, pat, caviar', TRUE, 'București (OTP)', 'Tokyo (HND)', '1 Escala'),

('Plaje in Tenerife', 'Soarele spaniol vă așteaptă.', 'tenerife.jpg', 'Africa', 'Economy', 350.00, 50, '2026-07-02 09:00:00', '2026-07-02 14:00:00', 'Tarom', 'bagaj cala, bauturi', TRUE, 'București (OTP)', 'Tenerife (TFS)', 'Direct'),

('Naveta spre Iași', 'Dimineața pleci, seara te întorci.', 'iasi.jpg', 'Europa', 'Economy', 40.00, 60, '2026-06-15 08:00:00', '2026-06-15 08:55:00', 'Tarom', 'bagaj mana mic, check-in aeroport', FALSE, 'București (OTP)', 'Iași (IAS)', 'Direct'),

('Misterul din Cairo', 'Piramidele la un zbor distanță.', 'cairo.jpg', 'Africa', 'Economy', 180.00, 35, '2026-11-05 13:45:00', '2026-11-05 18:00:00', 'WizzAir', 'bagaj mana, check-in prioritar', TRUE, 'București (OTP)', 'Cairo (CAI)', 'Direct'),

('Zbor spre Sydney', 'Canguri și surfing.', 'sydney.jpg', 'Australia', 'Business', 1450.00, 10, '2026-12-01 22:45:00', '2026-12-03 08:00:00', 'Qatar Airways', 'bagaj cala, meniu cald, filme, wifi', TRUE, 'București (OTP)', 'Sydney (SYD)', '2+ Escale'),

('Excursie in Barcelona', 'Arhitectura lui Gaudi.', 'barcelona.jpg', 'Europa', 'Premium Economy', 185.00, 22, '2026-06-25 11:30:00', '2026-06-25 13:50:00', 'Ryanair', 'bagaj cala mic, scaun fata', TRUE, 'București (OTP)', 'Barcelona (BCN)', 'Direct'),

('Relaxare in Bali', 'Paradisul pe pământ.', 'bali.jpg', 'Asia', 'Business', 1100.00, 6, '2026-08-20 23:00:00', '2026-08-21 18:00:00', 'Emirates', 'bagaj cala, meniu vegan, patura, kit somn', TRUE, 'București (OTP)', 'Bali (DPS)', '1 Escala'),

('Deplasare Timișoara', 'În vizită în capitala Banatului.', 'timisoara.jpg', 'Europa', 'Economy', 55.00, 40, '2026-07-10 10:00:00', '2026-07-10 11:00:00', 'Tarom', 'bagaj mana', FALSE, 'București (OTP)', 'Timișoara (TSR)', 'Direct');