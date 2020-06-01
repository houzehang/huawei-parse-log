const express = require('express');
const path = require("path")
const app = express();
var bodyParser = require('body-parser');
let parser = require('./parse')
const fs = require('fs')

app.use(bodyParser.json({limit: '1mb'})); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use('/', express.static(__dirname));
app.get('/check', (req, res)=>{
    try {
        let channel_id = req.query.channel_id
        let env        = req.query.env
        if (channel_id && env) {
          console.log('开始解析')
          parser.parse(channel_id, env == 'test')
          console.log('完成解析')
        }
        res.send('解析完成')
      } catch (error) {
        res.send(error)
    }
})

app.listen(9090, function () {
  console.log('Example app listening on port 9090!\n');
});