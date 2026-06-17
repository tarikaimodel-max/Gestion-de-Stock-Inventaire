exports.isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    if (req.originalUrl.startsWith('/api') || ['POST', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(401).json({ error: "Non authentifié" });
    }
    res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
    if (req.session.role === 'Admin') {
        return next();
    }
    res.status(403).send('Accès refusé : Administrateur uniquement.');
};

exports.isMagasiner = (req, res, next) => {
    if (req.session.role === 'Magasiner') {
        return next();
    }
    res.status(403).send('Accès refusé : Magasinier uniquement.');
};

// Middleware pour la "Ligne rouge du professeur"
exports.preventUnauthorizedModifications = (req, res, next) => {
    // Exclure les routes d'authentification pour éviter les boucles infinies
    if (req.originalUrl.startsWith('/auth')) {
        return next();
    }

    if (!req.session.userId) {
        if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
            return res.status(401).json({ error: "Non authentifié" });
        }
        return res.redirect('/auth/login');
    }

    if (req.session.role === 'Magasiner') {
        // Un magasinier n'a le droit à aucun PUT ou DELETE globalement
        if (['PUT', 'DELETE'].includes(req.method)) {
            return res.status(403).json({ error: "Interdit : Les magasiniers ne peuvent pas modifier ou supprimer des ressources." });
        }
        
        // Pour les requêtes POST, il n'a le droit que de soumettre sa session
        if (req.method === 'POST') {
            if (req.originalUrl !== '/magasinier/sessions') {
                return res.status(403).json({ error: "Interdit : Vous n'avez pas les droits pour créer cette ressource." });
            }
        }
    }

    next();
};
