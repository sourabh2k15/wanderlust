var fs = require("fs");
var world = fetchData("data/world.json");
var countrycode = "IN";
var country = world[countrycode].provinces;

putData("data/country/"+countrycode+".json", JSON.stringify(country), function(){
	console.log("written");
})

function fetchData(filepath) {
    return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function putData(filepath, content, callback) {
    fs.writeFile(filepath, "\n"+content, function(err) {
        if (!err) callback();
        else console.log(err);
    });
}