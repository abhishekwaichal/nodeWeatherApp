
var express = require('express');

var router = express.Router(); 

var myCities = [{state: 'CA' ,city: 'Campbell'}, {state: 'NE' ,city: 'Omaha'}, {state: 'TX' ,city: 'Austin'}, {state: 'MD' ,city: 'Timonium'} ]
var request  = require('request');

myWeatherDataArr = [];
var key = 'f1ceb102ad8ae3df';
var urlPrefix = 'http://api.wunderground.com/api/'+key+'/conditions/q/';
var url;

router.get('/', function(req, res){

	var j = -1;
	for (var i = 0; i < myCities.length; i++) {			
		url = urlPrefix + myCities[i].state + '/' + myCities[i].city + '.json'; 
		getData(url, function(aWeatherData){
			myWeatherDataArr.push(aWeatherData);
			//console.log(j);
			j++;
			if(j == 3)
				res.render('index', { data: myWeatherDataArr });
		});	
	};

});


router.get('/add', function(req, res){

	var city = req.query.city;
	var state = req.query.state;

	city = city.split(' ').join('_');

//	console.log(myWeatherDataArr);	
//	console.log(city);
//	console.log(state);

	url = urlPrefix + state + '/' + city + '.json';

	// call to the interface to
	getData(url, function(aWeatherData){
		myWeatherDataArr.push(aWeatherData);
		res.render('index', { data: myWeatherDataArr });
	});				
});


function getData(apiCall, callback){

var myWeatherData = new Object();
var data;
//console.log(apiCall);

request(apiCall, function (error, response, body) {

	if (!error && response.statusCode == 200) {

	  	data = JSON.parse(body);

	  	myWeatherData.locationName = data.current_observation.display_location.full;
	  	myWeatherData.weather = data.current_observation.weather; 
	  	myWeatherData.temperature_string = data.current_observation.temperature_string;
	  	myWeatherData.relative_humidity = data.current_observation.relative_humidity;
	  	myWeatherData.wind_string = data.current_observation.wind_string;
	  	myWeatherData.feelslike_string = data.current_observation.feelslike_string;

	  	callback(myWeatherData);
	  }	
	  else {
	  	console.log('Invalid City/State'); 
	  };
	 //console.log(myWeatherData);
	});	
};

module.exports = router;