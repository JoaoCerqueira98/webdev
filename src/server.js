const express = require("express")
const server = express()

//pegar o banco de dados
db = require("./database/db.js")

//configurar pasta publica
server.use(express.static("public"))

//Habilitar o uso do req.body na aplicação
server.use(express.urlencoded({extended: true}))


//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//configurar caminhos da aplicação
//pagina inicial
//req: Requisição
//res: Resposta
server.get("/",(req, res)=>{
    return res.render("index.html",{title: "Um titulo"})
})

server.get("/create-point",(req, res)=>{
    //req.query: Query strings da url
    //console.log(req.query)
    return res.render("create-point.html")
})

server.post("/save-point", (req, res)=> {
    //req.body: O corpo do nosso formulario
    //console.log(req.body)
    

    //Inserir dados no banco de dados
    const query=`
    INSERT INTO places(
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) values(?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
        
    ]

    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")
        }
       console.log("Cadastrado com sucesso")
       console.log(this)

       return res.render("create-point.html",{saved:true})
    }
    db.run(query, values, afterInsertData)

})

server.get("/search",(req, res)=>{

    const search = req.query.search

    if(search == ""){
        //pesquisa vazia
        return res.render("search-results.html",{total: 0})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }
        const total = rows.length
        return res.render("search-results.html", {places:rows, total})
    })
})

//Ligar o servidor
server.listen(3005)
