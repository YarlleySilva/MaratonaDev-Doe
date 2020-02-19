const express = require("express");
const server = express();
const nunjucks = require("nunjucks");
const Pool = require("pg").Pool;

//Configurando servidor para apresentar arquivos staticos
server.use(express.static("src"));

//habilitar body do express
server.use(express.urlencoded({ extended: true }));

//Configurando a conexão com o Banco de dados
const db = new Pool({
  user: "postgres",
  password: "0000",
  host: "localhost",
  port: 5432,
  database: "doe"
});

//Configurando a template engine (nunjucks)
nunjucks.configure("./", {
  express: server,
  noCache: true,
});



server.get("/", (req, res) => {
  db.query(`SELECT * FROM donors`, (err, result) => {
    if(err) return res.send("Erro de Banco de Dados.");

    const donors = result.rows;
    return res.render("index.html", { donors });
  });
});


server.post("/", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if(name == "" || email == "" || blood == ""){
    return res.send("Todos os campos são obrigatórios.");
  }

  //Colocando valores dentro do db
  const query = `
    INSERT INTO donors ("name", "email", "blood") 
    VALUES ($1, $2, $3)`;

  
  const values = [name, email, blood];
  
  db.query(query, values, (err) => {
    if(err) return res.send("Erro no Banco de Dados.");

    return res.redirect("/");
  });

});


server.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});





