const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/angular/dist/'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/angular/dist/index.html'));
  });
  
app.listen(3000, ()=>{
    console.log('Listening on port 3000');
});