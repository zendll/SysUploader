
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db/sistemas.db', (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('Banco de dados conectado.');
    }
});

const CriarTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS sistemas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            criadorId TEXT NOT NULL,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            link TEXT NOT NULL
        )
    `;
    db.run(query, (err) => {
        if (err) 
            console.error('Erro ao criar a tabela', err.message);
    });
};
/* 

edit sistema 

const On_AtualizarSistema = (id, nome, descricao, link, callback) => {
    const sql = `UPDATE sistemas SET nome = ?, descricao = ?, link = ? WHERE id = ?`;

    db.run(sql, [nome, descricao, link, id], function(err) {
        if (err) {
            return callback(err);
        }
        callback(null, this.changes);
    });
};*/


const VerificarSlotVazio = (callback) => {
    
    const query = `
        SELECT id FROM sistemas
        WHERE id NOT IN (SELECT id FROM sistemas WHERE id > 0)
        LIMIT 1
    `;
    db.get(query, [], (err, row) => {

        if (err) 
            return callback(err);
        
        callback(null, row ? row.id : null);
    });
};

const On_SistemasPaginados = (page, callback) => {

    const spag 
        = 10; 
    
    const offset = (page - 1) * spag;

    const query = `SELECT * FROM sistemas ORDER BY id LIMIT ? OFFSET ?`;
    db.all(query, [spag, offset], callback);
};

const On_AddSistema = (criadorId, nome, descricao, link, callback) => {

    VerificarSlotVazio((err, nextAvailableId) => {

        if (err) 
                return callback(err);

        const query = nextAvailableId
            ? `INSERT INTO sistemas (id, criadorId, nome, descricao, link) VALUES (?, ?, ?, ?, ?)`
            : `INSERT INTO sistemas (criadorId, nome, descricao, link) VALUES (?, ?, ?, ?)`;

        db.run(query, nextAvailableId ? [nextAvailableId, criadorId, nome, descricao, link] : [criadorId, nome, descricao, link], function(err) {
            
            if (err) {
                console.error('Erro ao adicionar sistema:', err.message);
                return callback(err);
            }
            callback(null);  
        });
    });
};

const On_Sistemas = (callback) => {
    const query = `SELECT * FROM sistemas`;
    db.all(query, [], callback);
};

const On_RemoverSistemaID = (id, callback) => {
    const query = `DELETE FROM sistemas WHERE id = ?`;
    db.run(query, [id], callback);
};

const On_PegarSistemaID = (id, callback) => {
    const query = 'SELECT * FROM sistemas WHERE id = ?';
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Erro ao consultar o sistema:', err);
            return callback(err);
        }
        callback(null, row); 
    });
};

module.exports = {
    CriarTable,
    On_AddSistema,
    On_SistemasPaginados,
    On_RemoverSistemaID,
    On_PegarSistemaID,
    VerificarSlotVazio
};
