var webdriver = require('selenium-webdriver');
var promise = require('selenium-webdriver').promise;
var fs = require("fs");

var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

var save_track = false;

var start = 0;
var end = 3;

var elems;
var spotsdata = {};
var query_source = "data/queries.json";
var queries = fetchData(query_source);
var output = "data/spots.json";

console.log(queries[start]);

function getSpots(index) {
    driver.get(queries[index][0]);
    var pendingElements = driver.findElements(webdriver.By.className('_Iho mlo-c'))

    pendingElements.then(function(elements) {
        var pendingHtml = elements.map(function(elem) {
            return elem.getAttribute('innerHTML');
        });

        promise.all(pendingHtml).then(function(allHTML) {
            var spots = processHTML(allHTML);
            spotsdata[queries[index][1]] = spots;
            console.log("processed " + index + "/" + queries.length + " queries");
            if (index < end) getSpots(index + 1);
            else {
                putData(output, JSON.stringify(spotsdata), function() {
                    console.log("written");
                    driver.close();
                })
            }
        });
    });
}

getSpots(start);
//driver.close();
if (save_track) updateTracker(index);

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

function processHTML(allHTML) {
    var results = [];

    for (var i = 0; i < allHTML.length; i++) {
        var html = allHTML[i];
        var title = "";
        var description = "";

        var title_word = 'class="title">';
        var title_index = html.indexOf(title_word);
        title_index += title_word.length;
        var desc_start = false;
        var desc_word = '/div><div class="_Ajf"><span>';

        for (var j = title_index; j < title_index + 800; j++) {
            if (html[j] == '<' && desc_start == false) {
                desc_start = true;
                j += desc_word.length;
            } else if (html[j] == '<' && desc_start == true) {
                break;
            } else if (desc_start) description += html[j];
            else title += html[j];
        }

        description = description.replace("amp;", "");
        results.push([title, description]);
    }

    return results;
}