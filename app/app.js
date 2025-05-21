const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
const db = require('./db');
const { error } = require('console');
const session = require('express-session');



const app = express();
const PORT = 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configs
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'chave-secreta', // coloque algo mais seguro em produção
    resave: false,
    saveUninitialized: false
}));


// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

// Rota principal
app.get('/', (req, res) => {
    res.render('login', {});
});

app.get('/main-page', (req, res) => {
    res.render('main-page', {});
});

app.get('/dados-energia', async (req, res) => {
    const idUsuario = req.session.idUsuario;

    if (!idUsuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT mes, consumo FROM contas_de_energia WHERE id_usuario = ? ORDER BY mes',
            [idUsuario]
        );
        console.log(rows)

        // Se tempo estiver no formato DATE, formatar para "YYYY-MM"
        const dados = rows.map(r => ({
            tempo: r.mes.toISOString().slice(0, 7), // para DATE
            consumo: r.consumo
        }));

        res.json(dados);

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao obter dados de energia' });
    }
});

app.get('/dados-agua', async (req, res) => {
    const idUsuario = req.session.idUsuario;

    if (!idUsuario) {
        return res.status(401).json({ erro: 'Não autenticado' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT mes, consumo FROM contas_de_agua WHERE id_usuario = ? ORDER BY mes',
            [idUsuario]
        );
        console.log(rows)

        // Se tempo estiver no formato DATE, formatar para "YYYY-MM"
        const dados = rows.map(r => ({
            tempo: r.mes.toISOString().slice(0, 7), // para DATE
            consumo: r.consumo
        }));

        res.json(dados);

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao obter dados de agua' });
    }
});


// Rota de cadastro de usuário
app.post('/cadastrar', async (req, res) => {
    const { email, senha, nome } = req.body;

    if (!email || !senha || !nome) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    try {
        const [result] = await db.execute('INSERT INTO usuarios (email, senha, username) VALUES (?, ?, ?)', [email, senha, nome]);

        // result.insertId contém o id do registro inserido
        res.status(201).json({ mensagem: 'Usuário criado com sucesso', id: result.insertId });

    } catch (error) {
        console.error(error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ erro: 'Email ou username já cadastrado' });
        }

        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// Rota de login
app.post('/login', async (req, res) => {
    const email = req.body.email;
    const senha = req.body.senha;

    try {
        const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        req.session.idUsuario = rows[0].id_usuario;
        req.session.username = rows[0].username;
        const senhaUsuario = rows[0].senha;

        if (senha !== senhaUsuario) {
            return res.status(401).json({ erro: 'Senha incorreta' });
        }

        // Login bem-sucedido
        res.redirect('main-page')

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

app.post('/adicionar-conta-agua', async (req, res) => {
    const idUsuario = req.session.idUsuario;
    const { mesAgua, consumoAgua } = req.body;
    const dataCompleta = mesAgua + '-01';

    if (!mesAgua || !consumoAgua) {
        return res.status(400).send('Data e consumo são obrigatórios.');
    }

    try {
        await db.execute(
            'INSERT INTO contas_de_agua (id_usuario, mes, consumo) VALUES (?, ?, ?)',
            [idUsuario, dataCompleta, consumoAgua]
        );
        res.redirect('main-page'); // Redireciona para a mesma página após envio
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar conta de água.');
    }
});

app.post('/adicionar-conta-energia', async (req, res) => {
    const idUsuario = req.session.idUsuario;
    const { mesEnergia, consumoEnergia } = req.body;
    const dataCompleta = mesEnergia + '-01';

    if (!mesEnergia || !consumoEnergia) {
        return res.status(400).send('Data e consumo são obrigatórios.');
    }

    try {
        await db.execute(
            'INSERT INTO contas_de_energia (id_usuario, mes, consumo) VALUES (?, ?, ?)',
            [idUsuario, dataCompleta, consumoEnergia]
        );
        res.redirect('main-page'); // Redireciona para a mesma página após envio
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar conta de energia.');
    }
});
