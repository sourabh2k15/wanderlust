var webdriver = require('selenium-webdriver');
var promise = require('selenium-webdriver').promise;
var fs = require("fs");

//initialization
var countries_source = "data/countries.json";
var provinces_source = "data/provinces.json";
var output = "data/world.json";

var countries = fetchData(countries_source);
var provinces = fetchData(provinces_source);

var countryhash = {};

//build country hashtable
for (var i = 0; i < countries.length; i++) {
    countryhash[countries[i].code] = { name: countries[i].name, provinces: [] };
}

for (var i = 0; i < provinces.length; i++) {
    var province = provinces[i];
    var obj = {};
    obj.name = province.name;

    if (province.english != undefined) obj.name = province.english;
    if (province.region != undefined) obj.region = province.region;

    countryhash[province.country].provinces.push(obj);
}

fs.writeFile(output, JSON.stringify(countryhash), function(err) {
    if (!err) console.log("written");
    else console.log(err);
});

/* Helper functions */

function fetchData(filepath) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}
//var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

//driver.get('https://www.google.com');