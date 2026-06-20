const db = require('../config/db');
const bcrypt = require('bcryptjs');

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
    
    return { ...session, Quota, salaire, tempsCalcule, tauxHoraire, username: user.username };
}

exports.getDashboard = async (req, res) => {
    try {
        const users = await db.getUsers();
        const sessions = await db.getSessions();
        
        const allSessions = sessions.map(session => {
            const user = users.find(u => u.id === session.userId) || { username: 'Inconnu', tauxHoraire: 15 };
            return calculateSalary(session, user);
        });

        const magasiniers = users.filter(u => u.role === 'Magasiner');
        
        res.render('admin/dashboard', { users: magasiniers, sessions: allSessions });
    } catch (error) {
        res.status(500).send("Erreur serveur");
    }
};

exports.markError = async (req, res) => {
    const sessionId = req.params.id;
    try {
        const sessions = await db.getSessions();
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        
        if (sessionIndex !== -1) {
            sessions[sessionIndex].erreur = true;
            await db.saveSessions(sessions);
        }
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erreur lors de la modification");
    }
};

exports.createUser = async (req, res) => {
    const { username, password, tauxHoraire } = req.body;
    try {
        const users = await db.getUsers();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            role: 'Magasiner',
            tauxHoraire: parseFloat(tauxHoraire) || 15
        };
        users.push(newUser);
        await db.saveUsers(users);
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erreur création utilisateur");
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, tauxHoraire } = req.body;
    try {
        let users = await db.getUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].username = username;
            users[userIndex].tauxHoraire = parseFloat(tauxHoraire) || 15;
            
            if (password && password.trim() !== '') {
                users[userIndex].password = await bcrypt.hash(password, 10);
            }
            
            await db.saveUsers(users);
        }
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erreur lors de la modification de l'utilisateur");
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        let users = await db.getUsers();
        users = users.filter(u => u.id !== userId);
        await db.saveUsers(users);
        
        // Supprimer aussi ses sessions
        let sessions = await db.getSessions();
        sessions = sessions.filter(s => s.userId !== userId);
        await db.saveSessions(sessions);
        
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).send("Erreur suppression utilisateur");
    }
};
