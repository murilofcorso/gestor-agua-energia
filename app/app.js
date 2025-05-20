const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
const db = require('./db');
const app = express();
const PORT = 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Para ler JSON do body


// Configs
app.use(express.static('public'));
app.use(express.json());
// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');




// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

// Rota principal
app.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM sua_tabela');
      res.render('login', { dados: rows });
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro no banco de dados');
    }
  });


// Rota adicionar conta de agua
app.post('/salvar-conta-agua', (req, res) => {
    const novoDado = req.body;

    let dados = [];
    if (fs.existsSync('dados-agua.json')) {
        const conteudo = fs.readFileSync('dados-agua.json', 'utf-8');
        const json = JSON.parse(conteudo);
        dados = Array.isArray(json) ? json : [];
    }
    dados.push(novoDado);
    console.log(dados);


    fs.writeFileSync('dados-agua.json', JSON.stringify(dados , null, 2));
    res.json(dados)
    res.send('Salvo com sucesso!');
});

app.get('/dados-energia', (req, res) => {
    const dados = fs.readFileSync('dados-energia.json');
    res.json(JSON.parse(dados));
  });


app.get('/dados-agua', (req, res) => {
    const dados = fs.readFileSync('dados-agua.json');
    res.json(JSON.parse(dados));
});

app.post('/adicionar-energia', (req, res) => {
    const dadosPath = path.join(__dirname, 'dados-energia.json');
    const novoDado = req.body;

    // Verificação básica
    if (!novoDado.tempo || !novoDado.consumo) {
        return res.status(400).json({ erro: 'Dados inválidos' });
    }

    // Lê os dados existentes
    let dados = [];
    try {
        const conteudo = fs.readFileSync(dadosPath, 'utf-8');
        dados = JSON.parse(conteudo);
    } catch (err) {
        // Se o arquivo não existir ou estiver vazio, continua com array vazio
        console.warn('Arquivo não encontrado ou inválido. Será criado.');
    }

    // Verifica duplicata
    const existe = dados.some(d => d.tempo === novoDado.tempo);
    if (existe) {
        return res.status(400).json({ erro: 'Já existe um registro para esse mês.' });
    }

    // Adiciona o novo dado
    dados.push(novoDado);

    // Salva de volta
    try {
        fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2));
        res.json({ sucesso: true });
    } catch (err) {
        console.error('Erro ao salvar:', err);
        res.status(500).json({ erro: 'Erro ao salvar os dados' });
    }
});


app.post('/adicionar-agua', (req, res) => {
    const dadosPath = path.join(__dirname, 'dados-agua.json');
    const novoDado = req.body;

    // Verificação básica
    if (!novoDado.tempo || !novoDado.consumo) {
        return res.status(400).json({ erro: 'Dados inválidos' });
    }

    // Lê os dados existentes
    let dados = [];
    try {
        const conteudo = fs.readFileSync(dadosPath, 'utf-8');
        dados = JSON.parse(conteudo);
    } catch (err) {
        // Se o arquivo não existir ou estiver vazio, continua com array vazio
        console.warn('Arquivo não encontrado ou inválido. Será criado.');
    }

    // Verifica duplicata
    const existe = dados.some(d => d.tempo === novoDado.tempo);
    if (existe) {
        return res.status(400).json({ erro: 'Já existe um registro para esse mês.' });
    }

    // Adiciona o novo dado
    dados.push(novoDado);

    // Salva de volta
    try {
        fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2));
        res.json({ sucesso: true });
    } catch (err) {
        console.error('Erro ao salvar:', err);
        res.status(500).json({ erro: 'Erro ao salvar os dados' });
    }
});

//cadastro usuario

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/cadastrar_usuario', urlencodedParser, async (req, res) => {
  const { nome, email, senha, data_nascimento } = req.body;

  try {
    const [resultado] = await db.query(
      'INSERT INTO usuarios (nome, email, senha, data_nascimento) VALUES (?, ?, ?, ?)',
      [nome, email, senha, data_nascimento]
    );
    console.log('Usuário cadastrado com ID:', resultado.insertId);
    res.render('main-page'); 
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro ao cadastrar usuário.');
  }
});

//login usuario


app.post('/login', urlencodedParser, async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (rows.length === 0) {
        res.status(500).render('login', { erro: 'Erro no servidor. Tente novamente.' });
    }

    const usuario = rows[0];

    // Caso esteja usando senha em texto puro (sem hash, por enquanto)
    if (senha !== usuario.senha) {
      
    }

    // Login OK → redireciona para main-page
    res.render('main-page', { usuario });  // você pode passar dados do usuário para a view se quiser
  } catch (err) {
    console.error(err);
    
  }
});