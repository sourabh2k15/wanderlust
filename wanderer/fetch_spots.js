var webdriver = require('selenium-webdriver');
var promise = require('selenium-webdriver').promise;
var fs = require("fs");

var country_code = "IN";
var world_source = "data/world.json";
var world = fetchData(world_source);

var query_source = "data/country/"+country_code+".json";
var queries = fetchData(query_source);

var output = "data/spots.json";
var spots = {};

var query_url = "https://www.tripadvisor.com/";
var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

var start = 0;
var end = queries.length;

var province;
var country;

function getSpots(index) {
    driver.get(query_url);
    province = queries[index].name;
    country = world[country_code].name;
    var query = province + " "+ country;

    driver.executeScript("document.getElementsByClassName('typeahead_input')[0].value = ''; ");

    driver.findElement(webdriver.By.className('typeahead_input')).sendKeys(query);
    driver.findElement(webdriver.By.className('typeahead_input')).sendKeys(webdriver.Key.ENTER);

    driver.findElement(webdriver.By.id('SUBMIT_HOTELS')).click().catch(function(error){
        waitforurlchange(index);
    }); 
}

function waitforurlchange(index){
    driver.getCurrentUrl().then(function(url){
        if(url != query_url){
            console.log(url);
            var urlpieces = url.split("/")[3].split(".")[0].split("-");
            urlpieces[3] = "Vacations";
            urlpieces[0] = "Tourism";
            url = query_url+urlpieces.join("-")+".html";
            
            console.log(url);
            driver.get(url).then(function(){

                driver.executeAsyncScript(function(secondValue){  
                  var callback = arguments[arguments.length-1]; 
                  var a=[];
                  var b; 
                  var btn = document.getElementsByClassName('morePopularCities ui_button primary chevron');
                  
                  function clickthat(btn){ 
                    if(btn[0] != undefined){ 
                        btn[0].click(); 
                        setTimeout(function(){ clickthat(btn)}, 500); 
                    }
                    else{ 
                        b = document.getElementsByClassName('cityName'); 
                        if(b.length > 0){ 
                        
                            for(var z = 0; z < b.length; z++){ 
                                a.push(b[z].children[0].children[1].innerText); 
                            }

                            callback({'ans' : a, 'index' : secondValue+1}); 
                        }else{
                            callback({'ans': [], 'index' : secondValue+1});
                        }
                    }
                  } 

                  clickthat(btn); 
                  }, index).then(function(res){
                    var obj = {'province': province, 'country': country, 'spots': res.ans};

                    var counter = res.index;
                    addData(output, JSON.stringify(obj), function(){
                        console.log("written");
                        console.log(obj);
                        
                        if(counter < end){                        
                            getSpots(counter);
                        }else{
                            console.log("written");
                        }
                    });

                  });
            });
        }else waitforurlchange(index);
    });
}

getSpots(start);

/* Helper functions */

function addData(filepath, content, cb){
    fs.appendFile(filepath, "\n"+content, function(err){
        if(err) console.log("err");
        cb();
    });
}

function fetchData(filepath) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function fetchIndex(filepath) {
    return fs.readFileSync(filepath, "utf-8");
}

function putData(filepath, content, callback) {
    fs.writeFile(filepath, content, function(err) {
        if (!err) callback();
        else console.log(err);
    });
}

function updateTracker(index) {
    putData(tracker, index, function() {
        console.log("tracker index written");
    });
}