const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

const router = express.Router();

//ROTAS

app.use('/', router.get('/', (req, res, next) => {
    res.status(200).send("<h1>API-FARCHAT</h1>");
}));

app.use('/sobre', router.get('/sobre', (req, res, next) => {
    res.status(200).send({
        "nome" : "FARCHAT",
        "autor" : "Felipe Alves Garcia",
        "versao" : "0.1.3"
    });
}));

app.use("/entrar", router.post("/entrar", async(req, res, next)=>{
    const usuarioController = require("./controllers/usuarioController.js");
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
}));

app.use("/salas",router.get("/salas", async (req, res,next) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    const test = await token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick);
    if(test) {
        let resp = await salaController.get();
        res.status(200).send(resp);
    }else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));

app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
        let resp = await salaController.entrar(req.headers.iduser, req.query.idSala);
        res.status(200).send(resp);
    }else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));

app.use("/sala/sair", router.put("/sala/sair", async (req, res)=>{
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
        let resp = await salaController.sair(req.headers.iduser);
        res.status(200).send(resp);
    }
    else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));

app.use("/sala/mensagem", router.post("/sala/mensagem", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
        let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg,req.body.idSala);
        res.status(200).send(resp);
    }
    else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));
  
app.use("/sala/mensagens", router.get("/sala/mensagens", async (req, res) => {
    const token = require("./util/token");
    const salaController = require("./controllers/salaController");
    if(token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)){
        let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
        res.status(200).send(resp);
    }
    else{
        res.status(401).send({msg:"Usuário não autorizado"});
    }
}));

module.exports = app;