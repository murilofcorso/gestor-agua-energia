const express = require('express');
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

// Rota adicionar conta de energia
app.post('/salvar-conta-energia', (req, res) => {
    const novoDado = req.body;

    let dados = [];
    if (fs.existsSync('dados-energia.json')) {
        const conteudo = fs.readFileSync('dados-energia.json', 'utf-8');
        const json = JSON.parse(conteudo);
        dados = Array.isArray(json) ? json : [];
    }
    dados.push(novoDado);
    console.log(dados);


    fs.writeFileSync('dados-energia.json', JSON.stringify(dados , null, 2));
    res.json(dados)
    res.send('Salvo com sucesso!');
});



