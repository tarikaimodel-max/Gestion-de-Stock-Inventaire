# 📦 Système de Gestion de Stock / Inventaire (Magasiner)

Ce projet est une application web de gestion de sessions de travail pour les magasiniers, réalisée dans le cadre du module **Développement Digital** à l'**OFPPT**. 

L'application respecte STRICTEMENT une architecture **MVC**, utilise des fichiers **JSON** pour la persistance des données (sans SGBD), et intègre des contrôles de sécurité avancés au niveau du Back-end.

---

## 🚀 Fonctionnalités Principales

### 🔐 Authentification & Sécurité (Ligne rouge du professeur)
* **Système d'authentification** complet géré par session côté serveur (`express-session`).
* **Hachage sécurisé** des mots de passe des utilisateurs via `bcryptjs`.
* **Middleware de protection contre le contournement** (`authMiddleware`) : bloque toute tentative d'accès ou de modification non autorisée (HTTP 401/403) via des outils comme Postman.

### ⚙️ Règles Métier & Calculs (Projet 10)
* **Calcul de Quota automatique** : l'objectif attendu est de 100 articles scannés par heure.
* **Gestion du Bonus (Avance)** : si le magasinier termine sa session en avance, il bénéficie d'un bonus de **50% de son taux horaire** sur le temps gagné.
* **Gestion du Malus (Erreur)** : si l'Administrateur signale une erreur d'inventaire sur une session, un malus de **+1 heure virtuelle** est appliqué sur le temps passé, recalculant automatiquement les gains.

---

## 📂 Architecture du Projet (MVC)

La structure des fichiers suit fidèlement l'exemple de référence fourni par le professeur :

```text
├── config/
│   └── db.js                 # Helper asynchrone pour lire/écrire les fichiers JSON
├── controllers/
│   ├── authController.js     # Gestion des connexions / déconnexions
│   ├── adminController.js    # Logique du Dashboard Administrateur (CRUD Magasinier)
│   └── magasinierController.js # Logique des sessions et formules mathématiques
├── middlewares/
│   └── authMiddleware.js     # Sécurisation des routes et vérification des rôles
├── models/
│   ├── users.json            # Base de données JSON - Utilisateurs (Admin/Magasiner)
│   └── sessions.json         # Base de données JSON - Sessions de stock
├── routes/
│   ├── authRoutes.js         # Routes d'authentification
│   ├── adminRoutes.js        # Routes réservées à l'administrateur
│   └── magasinierRoutes.js   # Routes réservées aux magasiniers
├── views/
│   ├── header.ejs            # Structure HTML globale (Haut et navigation)
│   ├── footer.ejs            # Structure HTML globale (Bas)
│   ├── login.ejs             # Interface de connexion
│   ├── admin/                # Vues du tableau de bord Admin
│   └── magasinier/           # Vues du tableau de bord Magasiner
├── app.js                    # Point d'entrée principal de l'application Express
└── package.json              # Dépendances et scripts du projet
```

---

## 🛠️ Installation et Démarrage Local

Pour tester le projet sur votre machine, suivez ces étapes :

1. **Cloner le projet** :
```bash
git clone https://github.com/tarikaimodel-max/Gestion-de-Stock-Inventaire.git
cd Gestion-de-Stock-Inventaire
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Démarrer l'application** :
```bash
node app.js
```

Le serveur sera alors accessible à l'adresse : **http://localhost:3000**

### Comptes par défaut

Lors du tout premier lancement, la base de données est initialisée avec ces deux comptes :
* **Administrateur** : `admin` / `admin`
* **Magasinier** : `magasinier` / `magasinier`
