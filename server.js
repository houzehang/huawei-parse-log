const express = require('express');
const path = require("path")
const app = express();
var bodyParser = require('body-parser');
const fs = require('fs')

app.use(bodyParser.json({limit: '1mb'})); 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use('/', express.static(__dirname));
app.get('/check', (req, res)=>{
    try {
        let channel_id = req.query.channel_id
        let env        = req.query.env
        console.log('MINGXI_DEBUG_LOG>>>>>>>>>channel_id',channel_id,env);
    } catch (error) {}
})

app.listen(9090, function () {
  console.log('Example app listening on port 9090!\n');
});