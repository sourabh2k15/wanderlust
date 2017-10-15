var map; 
var map_key = 'JZo1Uqz4Z9MlLYP5oPwu~VYDNW7mVzdzzBJDpm3A2xA~AvXLaoIboRB7L-3stqKgzYl0J5YRfaRHQWewd86ikXTNgtCCpFm7FJUVkEX7XQFS';
var imgs = [];
var current = 0;

function loadMapScenario() { 
	map = new Microsoft.Maps.Map(document.getElementById('myMap'), { 
		credentials: map_key 
	}); 

    map.setOptions({
        maxZoom: 12,
        minZoom: 1
    });

    map.setView({
        center: new Microsoft.Maps.Location(36.69938369, -4.421396876),
        zoom: 3
    });

    var infobox = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
    infobox.setMap(map);
    
    getLocations(function(positions){
        for(var position in positions){
            if(positions.hasOwnProperty(position)){
                var latitude = positions[position]['latitude']; 
                var longitude = positions[position]['longitude'];
                var location = new Microsoft.Maps.Location(latitude, longitude);

                var pushpin = new Microsoft.Maps.Pushpin(location, {title : position, color:'purple'});
                pushpin.setOptions({ enableHoverStyle: true, enableClickedStyle: true });
                pushpin.metadata = {
                    name : position                
                };
                map.entities.push(pushpin);

                Microsoft.Maps.Events.addHandler(pushpin, 'click', function(args){
                    var loc = args.target.getLocation();
                    var t = args.target.metadata.name;
                    var imghtml = "";
                    
                    imgs = [];
                    current = 0;

                    bingImageSearch(t, function(data){
                        console.log(data);
                        var urls = data['value'];
            
                        for(var i = 0; i < urls.length; i++){
                            imgs.push([urls[i]['contentUrl'], urls[i]['thumbnailUrl'], urls[i]['name']]);
                        }
                        
                        console.log(imgs);
                        var carousel = "<div class='container'><div class='top' id='title' >"+imgs[current][2]+"</div><div class='top'><div class='left'><img onClick = 'left()' src='https://cdn1.iconfinder.com/data/icons/media-controls/32/circle-play-512.png'/></div><div class='i'><img id='image' src="+imgs[current][1]+" /></div><div class='right'><img onClick='right()' src='https://cdn1.iconfinder.com/data/icons/media-controls/32/circle-play-512.png'/></div></div></div>";

                        infobox.setOptions({
                            htmlContent : carousel
                        });
                    });

                    infobox.setOptions({
                        location: loc,
                        title: t,
                        visible: true,
                        htmlContent : "<div style='background:white; padding:2%; border:1px solid blue; width:100px;'>"+t+"</div>"
                    });
                });
            }
        }
    });
}

function left(){
    console.log("left");
    current--;
    if(current < 0) current += imgs.length;
    document.getElementById('image').src = imgs[current][1];
    document.getElementById('title').innerHTML = imgs[current][2];
}

function right(){
    console.log("right");
    current++;
    current = current%imgs.length;
    document.getElementById('image').src = imgs[current][1];
    document.getElementById('title').innerHTML = imgs[current][2];
}

function bingImageSearch(q, cb){
	var params = {
        "q": q,
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
        cb(data);
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