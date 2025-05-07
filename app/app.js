const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');

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
app.use(express.json());

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

// Rota principal
app.get('/', (req, res) => {
  res.render('main-page', {});
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

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Para ler JSON do body


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
        const conteudo = fs.readFileSync(dadosPath);
        dados = JSON.parse(conteudo);
    } catch (err) {
        // Se o arquivo não existir ou estiver vazio
        console.error('Erro ao ler dados:', err);
    }

    // Adiciona o novo dado
    dados.push(novoDado);

    // Salva de volta
    fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2));

    res.json({ sucesso: true });
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
        const conteudo = fs.readFileSync(dadosPath);
        dados = JSON.parse(conteudo);
    } catch (err) {
        // Se o arquivo não existir ou estiver vazio
        console.error('Erro ao ler dados:', err);
    }

    // Adiciona o novo dado
    dados.push(novoDado);

    // Salva de volta
    fs.writeFileSync(dadosPath, JSON.stringify(dados, null, 2));

    res.json({ sucesso: true });
});