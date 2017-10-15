var webdriver = require('selenium-webdriver');
var promise = require('selenium-webdriver').promise;
var fs = require("fs");

var save_track = false;

var start = 0;
var end = -1;

var elems;
var spotsdata = {};
var country_code = "IN";

var query_source = "data/country/"+country_code+".json";
var queries = fetchData(query_source);

var output = "data/spots.json";

end = queries.length;

function getSpots(index) {
    var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

    driver.get(queries[index].name);
    var pendingElements = driver.findElements(webdriver.By.className('_Iho mlo-c'))

    pendingElements.then(function(elements) {
        var pendingHtml = elements.map(function(elem) {
            return elem.getAttribute('innerHTML');
        });

        promise.all(pendingHtml).then(function(allHTML) {
            var spots = processHTML(allHTML);
            console.log("processed " + index + "/" + queries.length + " queries");
            if (index < end) {
                driver.close();
                getSpots(index + 1);
                addData(output, JSON.stringify(spots));
            } else {
                addData(output, JSON.stringify(spots));
                driver.close();
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

function addData(filepath, content){
    fs.appendFileSync(filepath, "\n"+content);
}

function putData(filepath, content, callback) {
    fs.writeFile(filepath, "\n"+content, function(err) {
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
        description = description.replace("\"", "'");
        description = description.replace(/<\/?[^>]+(>|$)/g, "");
       
        if (description.indexOf('undefined') == -1 && description.indexOf("<") == -1 && description.indexOf("_") == -1)
            results.push([title, description]);
        else
            results.push([title, ""]);
    }

    return results;
}