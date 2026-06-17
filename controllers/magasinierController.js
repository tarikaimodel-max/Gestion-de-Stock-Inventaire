const db = require('../config/db');

function calculateSalary(session, user) {
    const tauxHoraire = user.tauxHoraire || 15;
    const Quota = session.nbArticles / 100;
    
    let tempsCalcule = session.tempsPasse;
    let salaire = 0;
    
    if (session.erreur) {
        tempsCalcule = session.tempsPasse + 1; // Malus
        salaire = tempsCalcule * tauxHoraire;
    } else {
        if (session.tempsPasse < Quota) {
            const tempsGagne = Quota - session.tempsPasse;
            salaire = (session.tempsPasse * tauxHoraire) + (tempsGagne * tauxHoraire * 0.5); // Bonus
        } else {
            salaire = session.tempsPasse * tauxHoraire;
        }
    }
    
    return { ...session, Quota, salaire, tempsCalcule, tauxHoraire };
}

exports.getDashboard = async (req, res) => {
    try {
        const sessions = await db.getSessions();
        const users = await db.getUsers();
        const user = users.find(u => u.id === req.session.userId);
        
        let userSessions = sessions.filter(s => s.userId === req.session.userId);
        userSessions = userSessions.map(session => calculateSalary(session, user));
        
        res.render('magasinier/dashboard', { userSessions, user });
    } catch (error) {
        res.status(500).send("Erreur serveur");
    }
};

exports.postSession = async (req, res) => {
    const { nbArticles, tempsPasse } = req.body;
    
    if (!nbArticles || !tempsPasse) {
        return res.status(400).send("Veuillez fournir le nombre d'articles et le temps passé");
    }

    try {
        const sessions = await db.getSessions();
        const newSession = {
            id: Date.now().toString(),
            userId: req.session.userId,
            nbArticles: parseFloat(nbArticles),
            tempsPasse: parseFloat(tempsPasse),
            erreur: false,
            date: new Date().toISOString()
        };
        
        sessions.push(newSession);
        await db.saveSessions(sessions);
        
        res.redirect('/magasinier/dashboard');
    } catch (error) {
        res.status(500).send("Erreur lors de la sauvegarde de la session");
    }
};
