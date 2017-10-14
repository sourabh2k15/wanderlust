var fs = require("fs");

var input = "data/world.json";
var tracker = "data/tracker.txt";

var world = fetchData(input);

var queries = [];
var query_url = "https://www.google.com/search?q=";

var output = "data/queries.json";

for (var country_code in world) {
    if (!world.hasOwnProperty(country_code)) continue;

    var country = world[country_code];
    var name = country.name;
    var provinces = country.provinces;

    if (provinces.length > 0) {
        for (var i = 0; i < provinces.length; i++) {

            var query = provinces[i].name + " ";
            if (provinces[i].region != undefined) query += provinces[i].region + " ";
            query += name + " ";

            query += "must visit spots";
            console.log(query_url + query);
            query = encodeURI(query_url + query);
            queries.push([query, provinces[i].name, country.name]);
        }
    }
}

putData(output, JSON.stringify(queries), function() {
    console.log("written");
})

/* Helper functions */

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