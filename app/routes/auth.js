const express = require('express');
const bcrypt = require('bcrypt'); // Para comparar senhas criptografadas
const router = express.Router();
const UserModel = require('../models/usuarioModel');

// Rota GET para exibir o formulário de login
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza a view login.handlebars
});

// Rota POST para processar o login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Busca o usuário no banco de dados pelo nome
    const user = await UserModel.findByUsername(username);

    // Se usuário não existe, retorna erro
    if (!user) {
        return res.render('login', { error: 'Usuário não encontrado' });
    }

    // Verifica se a senha está correta usando bcrypt
    //   const senhaCorreta = await bcrypt.compare(password, user.password_hash);
    //   if (!senhaCorreta) {
    //     return res.render('login', { error: 'Senha incorreta' });
    //   }

    if (user.senha != password) {
        return res.render('login', { error: 'Senha incorreta' });
    } 

    
    // Login bem-sucedido: salva o usuário na sessão
    req.session.user = { id: user.id, username: user.username };

    // Redireciona para o dashboard
    res.redirect('/main-page');
});

// Rota GET para logout
router.get('/logout', (req, res) => {
    // Destroi a sessão do usuário
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
