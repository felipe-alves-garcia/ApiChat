require("dotenv").config();
const  app = require("../src/api");

app.use((req, res, next)=>{
    next();
});

let port = process.env.API_PORT || 3333;

app.listen(port);

console.log("DB HOST: "+process.env.DB_HOST);   
console.log("Starting in port ... " + port + "\n");