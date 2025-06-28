# Woodle

# 📚 Woodle — Plateforme de Gestion Universitaire

Projet Angular 19 / Node.js (Express) réalisé dans le cadre du module WE4A.

## 🚀 Objectif

Ce projet propose une plateforme web universitaire permettant :
- La gestion des publications, devoirs et forums.
- L'interaction entre étudiants et professeurs (soumissions, notations, forums...).

---

## 📁 Dépôt Git

Cloner le projet :
```bash
git clone https://github.com/mechwii/Woodle.git
```

---
## 🧩 Configuration du Backend

### 1. Base de données PostgreSQL (relationnelle)

📌 Dans `Woodle/backend/old_script.sql`, vous trouverez le script SQL à exécuter dans PostgreSQL.  
Il contient le jeu de données relationnelles : utilisateurs, rôles, inscriptions, etc.

### 2. Base de données MongoDB (NoSQL)

📌 Le fichier `Woodle/backend/configuration/script.sql` contient les données d'exemple à insérer dans MongoDB.  
La première collection utilisée est `"UE"`.

---
## ⚙️ Fichier `.env`

Créer un fichier `.env` à la racine du projet (`Woodle/.env`) avec le contenu suivant :

```env
PORT=3000

# PostgreSQL
DB_POSTGRES_USERNAME=VOTRE_UTILISATEUR
DB_POSTGRES_PORT=5432             # ou le port utilisé
DB_POSTGRES_HOST=localhost
DB_POSTGRES_DATABASE=we4b     # ou le nom donné à votre BDD
DB_POSTGRES_PASSWORD=VOTRE_MDP

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=we4b # ou le nom donné à votre BDD

# Sécurité
JWT_SECRET="WE4B_secret"
```

---

## ▶️ Lancer le Backend

Depuis le dossier `backend/` :

```bash
cd backend
npm install
npm start
```

Le backend tourne sur `http://localhost:3000`.

---

## 🖥️ Lancer le Frontend (Angular)

Depuis le dossier `front/` :

```bash
cd front
npm install
ng serve
```

Le frontend sera disponible sur `http://localhost:4200`.

---

## 👤 Comptes de test

### 👨‍🏫 Professeur (admin)

- **Email** : `thomas.martin@example.com`
- **Mot de passe** : `martinPass`

### 👨‍🎓 Étudiant

- **Email** : `mhammedu.san@example.com`
- **Mot de passe** : `password123`

---
## 🛠️ Dépendances techniques principales

- **Angular 19**
- **Node.js / Express**
- **PostgreSQL** pour les données structurées
- **MongoDB** pour les collections dynamiques
- **JWT** pour l'authentification sécurisée

---
## 📎 Remarques

- Utilisez [PgAdmin](https://www.pgadmin.org/) ou un autre outil SQL pour importer `old_script.sql`.
- Pour MongoDB, utilisez [MongoDB Compass](https://www.mongodb.com/try/download/compass) pour exécuter le script de données

---
## 🧑‍💻 Auteurs

Projet réalisé par **M'hammed MECHROUBI**,  et ses collaborateurs dans le cadre du module WE4B.