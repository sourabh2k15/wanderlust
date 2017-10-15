var map; 
var map_key = 'JZo1Uqz4Z9MlLYP5oPwu~VYDNW7mVzdzzBJDpm3A2xA~AvXLaoIboRB7L-3stqKgzYl0J5YRfaRHQWewd86ikXTNgtCCpFm7FJUVkEX7XQFS';

function loadMapScenario() { 
	map = new Microsoft.Maps.Map(document.getElementById('myMap'), { 
		credentials: map_key 
	}); 

    map.setOptions({
        maxZoom: 12,
        minZoom: 1
    });

    map.setView({
        center: new Microsoft.Maps.Location(39.601579130, -42.810403254),
        zoom: 3
    });

    getLocations(function(positions){
        for(var position in positions){
            if(positions.hasOwnProperty(position)){
                var latitude = positions[position]['latitude']; 
                var longitude = positions[position]['longitude'];
                
                var pushpin = new Microsoft.Maps.Pushpin({'latitude':latitude, 'longitude':longitude}, null);
                map.entities.push(pushpin);
            }
        }
    });
}

function bingImageSearch(){
	var params = {
        "q": "Himachal pradesh must visit spots",
        "count": "100",
        "offset": "0",
        "mkt": "en-us",
        "safeSearch": "Moderate",
    };

	var endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/images/search?"+$.param(params);

	$.ajax({
		url : endpoint,
		beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","5acf393925124e37a57af73df43dfbf6");
        },
        type : "GET",
        data : "" 
    }).done(function(data) {
        console.log(data);
    }).fail(function() {
        console.log("error");
    });
}

function getLocations(cb){
    $.ajax({
        url     : '/locations',
        data    : {'name' : 'sourabh'},
        method  : "GET",
        success : function(data){
            var positions = JSON.parse(data);
            cb(positions);
        },
        error   : function(err){
            console.log("error occurred!");
        }
    })
}