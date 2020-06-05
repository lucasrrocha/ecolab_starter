const express = require('express');
const server = express();

// pegar o db

const db = require('./database/db');

//Configurar pasta public

server.use(express.static('public'));

//Habilitar o uso do Request.body na nossa aplicaçao
server.use(express.urlencoded({ extended: true }));

//utilizando template engines
const nunjuks = require('nunjucks');
nunjuks.configure('src/views', {
  express: server,
  noCache: true
});

//configurar caminhos da minha aplicação
//pagina inicial

server.get('/', (request, response) => {
  return response.render('index.html');
});

server.get('/create-point', (request, response) => {
  //Request.query: Query Strings da nossa url
  // console.log(request.query);

  return response.render('create-point.html');
});

server.post('/savepoint', (request, response) => {
  //Request.body: o corpo do nosso formulario
  // console.log(request.body);

  //Inserir os dados do formulário no Banco de dados
  const query = `
  INSERT INT places (
    image,
    name,
    address,
    address2,
    state,
    city,
    items
  ) VALUES (?, ?, ?, ?, ?, ?, ?);`;

  const values = [
    request.body.image,
    request.body.name,
    request.body.address,
    request.body.address2,
    request.body.state,
    request.body.city,
    request.body.items
  ];

  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return response.send('Erro no cadastro');
    }
    console.log('Cadastrado com sucesso');
    console.log(this);
    return response.render('create-point.html', { saved: true });
  }
  db.run(query, values, afterInsertData);
});

server.get('/search-results', (request, response) => {
  const search = request.query.search;

  if (search == '') {
    //Pesquisa vazia
    return response.render('search-results.html', {
      total: 0
    });
  }

  //Consultar dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(
    err,
    rows
  ) {
    if (err) {
      return console.log(err);
    }
    const total = rows.length;
    //mostra a página html com os dados do banco de dados
    return response.render('search-results.html', {
      places: rows,
      total: total
    });
  });
});

//iniciar o servidor

server.listen(3000);
