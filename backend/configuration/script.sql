DROP TABLE IF EXISTS Epingle CASCADE;
DROP TABLE IF EXISTS Est_affecte CASCADE;
DROP TABLE IF EXISTS Note CASCADE;
DROP TABLE IF EXISTS Possede CASCADE;
DROP TABLE IF EXISTS Notification CASCADE;
DROP TABLE IF EXISTS Publication CASCADE;
DROP TABLE IF EXISTS Section CASCADE;
DROP TABLE IF EXISTS Priorite CASCADE;
DROP TABLE IF EXISTS Controle CASCADE;
DROP TABLE IF EXISTS UE CASCADE;
DROP TABLE IF EXISTS Type_notification CASCADE;
DROP TABLE IF EXISTS Type_publication CASCADE;
DROP TABLE IF EXISTS Role CASCADE;
DROP TABLE IF EXISTS Utilisateur CASCADE;

CREATE TABLE Utilisateur
(
    id_utilisateur    SERIAL PRIMARY KEY,
    nom               VARCHAR(100) NOT NULL,
    prenom            VARCHAR(100) NOT NULL,
    email             VARCHAR(255) NOT NULL,
    mot_de_passe      VARCHAR(255) NOT NULL,
    date_creation     TIMESTAMP,
    date_modification TIMESTAMP,
    image             VARCHAR(255) NOT NULL
);

CREATE TABLE Role
(
    id_role SERIAL PRIMARY KEY,
    nom     VARCHAR(100) NOT NULL
);



CREATE TABLE Possede
(
    utilisateur_id INT,
    role_id        INT,
    PRIMARY KEY (utilisateur_id, role_id),
    FOREIGN KEY (utilisateur_id) REFERENCES Utilisateur (id_utilisateur) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role (id_role)
);




CREATE OR REPLACE FUNCTION maj_dates_utilisateur()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        NEW.date_creation := NOW();
        NEW.date_modification := NOW();
    ELSIF (TG_OP = 'UPDATE') THEN
        NEW.date_modification := NOW();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_maj_dates_utilisateur
    BEFORE INSERT OR UPDATE ON Utilisateur
        FOR EACH ROW
            EXECUTE FUNCTION maj_dates_utilisateur();

CREATE OR REPLACE FUNCTION maj_date_affection()
RETURNS TRIGGER AS $$
BEGIN
    IF(TG_OP = 'INSERT') THEN
      NEW.date_inscription := NOW();
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- INSERT

INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, date_creation, date_modification, image)
VALUES ('San', 'M''hammedu', 'mhammedu.san@example.com', 'password123', '2024-01-15', '2024-01-15',
        'mhammed.jpeg'),
       ('Balonu', 'Elmiru', 'elmiru.balonu@example.com', 'securePass456', '2024-01-20', '2024-02-05',
        'elmir.jpg'),
       ('Alpuren', 'Enessu', 'enessu.alpuren@example.com', 'alpuren2024', '2024-01-25', '2024-01-25',
        'enes.jpg'),
       ('Vazmazz', 'Evrensan', 'evrensan.vazmazz@example.com', 'vazmazz789!', '2024-02-01',
        '2024-03-10', 'evren.jpg'),
       ('Dubois', 'Marie', 'marie.dubois@example.com', 'dubois123', '2024-02-05', '2024-02-05',
        'marie.jpg'),
       ('Martin', 'Thomas', 'thomas.martin@example.com', 'martinPass', '2024-02-10', '2024-02-15',
        'thomas.jpg'),
       ('Bernard', 'Arthur', 'arthur.bernard@example.com', 'arthur2024', '2024-02-15', '2024-02-15',
        'bernard.jpg'),
       ('Petit', 'Lucas', 'lucas.petit@example.com', 'petitLucas!', '2024-02-20', '2024-02-20',
        'lucas.jpg'),
       ('Robert', 'Emma', 'emma.robert@example.com', 'emmaR2024',  '2024-02-25', '2024-03-01',
        'robert.jpeg'),
       ('Richard', 'Hugo', 'hugo.richard@example.com', 'hugoRich456', '2024-03-01', '2024-03-01',
        'hugo.jpeg'),
       ('Kaya', 'Mehmet', 'mehmet.kaya@example.com', 'kayaM2024',  '2024-03-15', '2024-03-15',
        'mehmet.jpg'),
       ('Yilmaz', 'Ayse', 'ayse.yilmaz@example.com', 'yilmazA456!', '2024-03-20', '2024-03-20',
        'ayse.jpeg');

INSERT INTO Role (nom)
VALUES ('ROLE_ADMINISTRATEUR'),
       ('ROLE_PROFESSEUR'),
       ('ROLE_ELEVE');

INSERT INTO Possede (utilisateur_id, role_id)
VALUES (4, 1), -- User 4 is an admin
       (7, 1), -- User 7 is an admin
       (11, 1); -- User 11 is an admin

INSERT INTO Possede (utilisateur_id, role_id)
VALUES (1, 3), -- User 1 is a student
       (3, 3), -- User 3 is a student
       (5, 3), -- User 5 is a student
       (8, 3), -- User 8 is a student
       (10, 3); -- User 10 is a student

INSERT INTO Possede (utilisateur_id, role_id)
VALUES (2, 2), -- User 2 is a professor
       (9, 2); -- User 9 is a professor

INSERT INTO Possede (utilisateur_id, role_id)
VALUES (6, 1),  -- User 6 is an admin
       (6, 2),  -- User 6 is also a professor
       (12, 1), -- User 12 is an admin
       (12, 2); -- User 12 is also a professor


