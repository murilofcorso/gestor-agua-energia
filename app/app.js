const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;

// Configuração do Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configurando arquivos estáticos
app.use(express.static('public'));

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

// Rota principal
app.get('/', (req, res) => {
  res.render('main-page', {});
});
