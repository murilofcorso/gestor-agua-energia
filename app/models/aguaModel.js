const db = require('../db');

module.exports = {
  async todos() {
    const [rows] = await db.execute('SELECT * FROM agua');
    return rows;
  },
  async adicionar(tempo, consumo) {
    await db.execute('INSERT INTO agua (tempo, consumo) VALUES (?, ?)', [tempo, consumo]);
  },
  async existeRegistro(tempo) {
    const [rows] = await db.execute('SELECT COUNT(*) as total FROM agua WHERE tempo = ?', [tempo]);
    return rows[0].total > 0;
  }
};