const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.getLogin = (req, res) => {
    if (req.session.userId) {
        return res.redirect(req.session.role === 'Admin' ? '/admin/dashboard' : '/magasinier/dashboard');
    }
    res.render('login', { error: null });
};

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const users = await db.getUsers();
        const user = users.find(u => u.username === username);
        
        if (!user) {
            return res.render('login', { error: 'Identifiants incorrects' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Identifiants incorrects' });
        }

        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.username = user.username;

        if (user.role === 'Admin') {
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/magasinier/dashboard');
        }
    } catch (error) {
        res.render('login', { error: 'Erreur lors de la connexion' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
};
