const fs = require('fs/promises');
const path = require('path');

const dataDir = path.join(__dirname, '../models');
const usersFile = path.join(dataDir, 'users.json');
const sessionsFile = path.join(dataDir, 'sessions.json');

async function readJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw err;
    }
}

async function writeJSON(filePath, data) {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

module.exports = {
    getUsers: () => readJSON(usersFile),
    saveUsers: (data) => writeJSON(usersFile, data),
    getSessions: () => readJSON(sessionsFile),
    saveSessions: (data) => writeJSON(sessionsFile, data)
};
