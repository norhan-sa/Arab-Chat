
const router = require("./authentication");

const route = require('express').Router();

route.post('/test',(req,res)=>{
  req.session.name = req.body.name;
  return res.send('saved');
});

route.get('/test1',(req,res)=>{
    let name = req.session.id;
    return res.send(name);
});

module.exports = route;