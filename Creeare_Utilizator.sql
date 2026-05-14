CREATE USER admin_destinatiax WITH ENCRYPTED PASSWORD 'parola'; -- Cream utilizatorul (o singura data)

-- Ii oferim drepturi asupra datei de baze (o singura data)
GRANT ALL PRIVILEGES ON DATABASE destinatiax_bd TO admin_destinatiax;

-- Ii oferim drepturi asupra tuturor tabelelor existente in momentul executiei (adaugam un tabel, innoim drepturile)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_destinatiax;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_destinatiax;
