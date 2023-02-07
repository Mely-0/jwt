const express = require('express')
const app = express();
const jwt = require("jsonwebtoken")
const env = require("dotenv");
env.config();
const users = [
  { email: "admin@example.com", name: "admin", rol: "admin" },
  { email: "user@example.com", name: "user", rol: "user" },
];
function JWTValidation(req, res , next){
const token = req.header("Authorization");
try {
  const verify = jwt.verify(token, process.env.SECRET_KEY);
  if(verify.rol === "admin"){
    req.headers = { ...req.headers, rol: "admin" };
  }
  if(verify.rol === "user"){
    req.headers = { ...req.headers, rol: "user" };
  }
  next()
} catch (error) {
  res.json({ error })
} 
}
app.use(express.json());
app.post("/auth", (req,res)=>{
  const data = req.body.email
  const filtrado = users.filter((user) => {
    if (user.email === data) {
      return true;
    } else {
      return false;
    }
  });
  if (filtrado.length !== 0) {
    token = jwt.sign(
      {
        email:filtrado[0].email,
        name: filtrado[0].name,
        rol: filtrado[0].rol,
      },
      process.env.SECRET_KEY,
      {
        algorithm: "HS256",
      }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: "Invalid user name or password" });
  }
})
app.get("/premium-clients",JWTValidation,(req,res)=>{
if(req.header("rol") == "admin"){
  res.send("premium-clients list");
}else{
  res.status("403").json({ error: "Access not allowed" });
}
})

app.get("/medium-clients",JWTValidation,(req,res)=>{
if(req.headers("rol") == "admin"|| req.header("rol") === "user"){
  res.send("medium-clients list");
}else{
  res.status("403").json({ error: "Access not allowed" });
}
})
app.get("/", function (req, res) {
  res.send("Bienvenido a la api de ADA Cars");
});

module.exports = app;
