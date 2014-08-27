
/*
* Different Routes can be defined in different js files
* This helps in seperation of concerns.
* New dyncamically required routes can be defined, making new functionality developement more flexible.
**/


/*
* 
* Declare all the Requirements ( /Required Modeules)
*
*/
var express = require('express');
var request  = require('request');

var router = express.Router(); 

// Default Cities - whose data is pulled at startup
var myCities = [{state: 'CA' ,city: 'Campbell'}, {state: 'NE' ,city: 'Omaha'}, {state: 'TX' ,city: 'Austin'}, {state: 'MD' ,city: 'Timonium'} ]

myWeatherDataArr = [];

var apiKey = '61268b47323f369c';
var urlPrefix = 'http://api.wunderground.com/api/'+apiKey+'/conditions/q/';
var url;

/*
*
* Actual Routes
*
*/
router.get('/', function(req, res){

	var j = -1;

	for (var i = 0; i < myCities.length; i++) {			

		url = urlPrefix + myCities[i].state + '/' + myCities[i].city + '.json'; 

		// Delegate call to the method to handle request to the Wunderground API
		getData(url, function(aWeatherData){


		if(typeof aWeatherData === 'undefined'){
			j++;
			if(j == 3){
				res.render('index', { data: myWeatherDataArr, errMsg: 'ERROR: Wunderground Server not a responding.' });	
			}		
		}
		else{
				myWeatherDataArr.push(aWeatherData);
				//console.log(j);
				j++;
				// Only invoke the render function to render the view 
				if(j == 3){
					res.render('index', { data: myWeatherDataArr, errMsg:'' });
				}
			}	
		});	
	};
});


router.get('/add', function(req, res){

	var city = req.query.city;
	var state = req.query.state;
	var orig_city = city;

	city = city.split(' ').join('_');

//	console.log(myWeatherDataArr);	
//	console.log(city);
//	console.log(state);

	url = urlPrefix + state + '/' + city + '.json';

	// call to the interface to
	getData(url, function(aWeatherData){
		
		if(typeof aWeatherData === 'undefined'){
			res.render('index', { data: myWeatherDataArr, errMsg: 'ERROR:'+orig_city+', '+state+' not a recognized location.' });	
		}
		else{
			myWeatherDataArr.push(aWeatherData);
			res.render('index', { data: myWeatherDataArr, errMsg:'' });
		}
	});				
});


/*
*
* Utility Function - Requesting Wunderground API
*
*/
function getData(apiCall, callback){

var myWeatherData = new Object();
var data;
//console.log(apiCall);

request(apiCall, function (error, response, body) {

	if (!error && response.statusCode == 200) {
		
	  	data = JSON.parse(body);

		if(typeof data.current_observation === 'undefined'){
			console.error('\nERRROR: Invalid City/State\'s data requested ! \n');
			callback(undefined);
		}
		else{

		  	myWeatherData.locationName = data.current_observation.display_location.full;
		  	myWeatherData.weather = data.current_observation.weather; 
		  	myWeatherData.temperature_string = data.current_observation.temperature_string;
		  	myWeatherData.relative_humidity = data.current_observation.relative_humidity;
		  	myWeatherData.wind_string = data.current_observation.wind_string;
		  	myWeatherData.feelslike_string = data.current_observation.feelslike_string;

		  	callback(myWeatherData);
	  	}
	  }	
	 //console.log(myWeatherData);
	});	
};


/*
*
* Expose(/Export) this Router to the App
*
*/
module.exports = router;