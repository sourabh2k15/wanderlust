var map; 
var map_key = 'JZo1Uqz4Z9MlLYP5oPwu~VYDNW7mVzdzzBJDpm3A2xA~AvXLaoIboRB7L-3stqKgzYl0J5YRfaRHQWewd86ikXTNgtCCpFm7FJUVkEX7XQFS';

function loadMapScenario() { 
	map = new Microsoft.Maps.Map(document.getElementById('myMap'), { 
		credentials: map_key 
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



//bingImageSearch();