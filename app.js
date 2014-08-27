

var express = require('express');
var path = require('path');
//var http  = require('http');
var bodyParser = require('body-parser');

var app = express();

//Configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) ;

//Use middleware
app.use(bodyParser());
//app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'images')));

app.use(function(req, res, next){                           // User defined Logging Middleware
    //Parameter(S)-form,url, etc.& Methods      
    console.log('\n\nMethod: '+req.method); 
    console.log('URL: '+req.url); 
    console.log('Form: '+req.form);
    if(typeof req.query.city === 'undefined')
        console.log('Query Parameters: None');  
    else
        console.log('Query Parameters: '+'city='+req.query.city+', '+'state='+req.query.state);
    next();
});


//Define routes

app.use(require('./routes/actions'));

// Start Server
app.listen(7997, function(){
    console.log('Ready on port 7997');
});

