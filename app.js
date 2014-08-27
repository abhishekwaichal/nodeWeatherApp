
/*
* 
* Declare all the Requirements( /Required Modules)
*
*/
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var port_no = 7997;

/*
* 
* Configure the App
*
*/
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) ;

/*
*
* Use Middleware
*
*/

// Express's Static Middleware to load Static Resources
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));

// Use this module to collect the request parameters
app.use(bodyParser());

// Logging Middleware -  to log request information (Helpful for Debugging)
app.use(function(req, res, next){                           
    console.log('\n\nMethod: '+req.method); 
    console.log('URL: '+req.url); 
    if(typeof req.query.city === 'undefined')
        console.log('Query Parameters: None');  
    else
        console.log('Query Parameters: '+'city='+req.query.city+', '+'state='+req.query.state);
    next();
});


/*
*
* Define routes
*
*/
// Leverage the router defined as 'action.js'
app.use(require('./routes/actions'));

/*
*
* Start Server
*
*/
app.listen(port_no, function(){
    console.log('\n\t\t\tServer is up and running at localhost:'+ port_no);
});

