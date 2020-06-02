const express = require('express');
const path = require("path")
const app = express();
var bodyParser = require('body-parser');
let parser = require('./parse')
const fs = require('fs')

app.use(bodyParser.json({limit: '1mb'})); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.all('*',function (req, res, next) {
  console.log('MINGXI_DEBUG_LOG>>>>>>>>>2121212','');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});
app.use('/', express.static(__dirname));
app.get('/', function (req, res) {
  res.send('Welcome!')
})
app.get('/check', (req, res)=>{
    console.log('MINGXI_DEBUG_LOG>>>>>>>>>111','');
    try {
        let channel_id = req.query.channel_id
        let env        = req.query.env
        if (channel_id && env) {
          console.log('开始解析')
          parser.parse(channel_id, env == 'test',()=>{
            res.send('解析完成')
            console.log('完成解析')
          })
        } else {
          res.send('无效参数')
        }
      } catch (error) {
        res.send(error)
    }
})

app.listen(9090, function () {
  console.log('Example app listening on port 9090!\n');
});