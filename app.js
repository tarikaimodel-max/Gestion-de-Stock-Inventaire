const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const db = require('./config/db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'super-secret-key-pour-ce-projet',
    resave: false,
    saveUninitialized: false
}));

// Middlewares globaux
const { preventUnauthorizedModifications } = require('./middlewares/authMiddleware');
app.use(preventUnauthorizedModifications);

// Ajouter des variables aux vues
app.use((req, res, next) => {
    res.locals.userRole = req.session.role;
    res.locals.username = req.session.username;
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const magasinierRoutes = require('./routes/magasinierRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/magasinier', magasinierRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Initialisation de la BDD
async function initDB() {
    try {
        const users = await db.getUsers();
        if (users.length === 0) {
            console.log("Aucun utilisateur trouvé, création des utilisateurs par défaut...");
            const adminHash = await bcrypt.hash('admin', 10);
            const magHash = await bcrypt.hash('magasinier', 10);
            
            await db.saveUsers([
                { id: "1", username: "admin", password: adminHash, role: "Admin", tauxHoraire: 0 },
                { id: "2", username: "magasinier", password: magHash, role: "Magasiner", tauxHoraire: 15 }
            ]);
            console.log("Utilisateurs créés avec succès (admin/admin, magasinier/magasinier)");
        }
    } catch (err) {
        console.error("Erreur d'initialisation de la base de données", err);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    await initDB();
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
