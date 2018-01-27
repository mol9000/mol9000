/*
Install:
--------
http://couchdb.apache.org download
    double click to start CouchDB server locally
configure CouchDB via: http://127.0.0.1:5984/_utils/#_config/couchdb@localhost
    add options enable_cors, bind_address, origins:
      [httpd] <-- section
        enable_cors = true
        bind_address = 0.0.0.0
      [cors] <-- section
        origins = *

Resources:
----------
XMLHttpRequest:
https://en.wikipedia.org/wiki/XMLHttpRequest

CouchDB:
http://guide.couchdb.org/draft/tour.html
https://wiki.apache.org/couchdb/HTTP_Document_API
http://docs.couchdb.org/en/1.6.1/config/intro.html
http://docs.couchdb.org/en/1.6.1/config/http.html#cross-origin-resource-sharing
http://docs.couchdb.org/en/1.6.1/intro/curl.html

HTML(5):
http://www.w3schools.com/html/default.asp
http://www.w3schools.com/jsref/default.asp

Local HTTP server (not strictly needed):
python -m SimpleHTTPServer 8080

CouchDB configuration (Mac OS X):
~/Library/Application Support/CouchDB/etc/couchdb/local.ini
/Applications/Apache CouchDB.app/Contents/Resources/couchdbx-core/etc/couchdb/local.ini
CouchDB configuration (Windows):
C:\Program Files (x86)\Apache Software Foundation\CouchDB\etc\couchdb\local.ini
start/stop/restart: Control Panel --> Services --> Apache CouchDB

[httpd]
enable_cors = true
bind_address = 0.0.0.0
[cors]
origins = *
*/

var request = new XMLHttpRequest();

request.onreadystatechange = function() {
    console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
    console.log(request.responseText);
    if (request.readyState == 4) {
        if (request.status == 200) {
            var response = JSON.parse(request.responseText);
            handlers[response._id](response);
        }
        if (request.status == 404) {
            var json = JSON.parse(request.responseText);
            if (json.reason === "no_db_file") {
                createDB();
            } else {
                var url = request.responseURL
//              console.log(typeof(url));
                var i = url.lastIndexOf("/", url.length - 1);
                var name = url.substring(i + 1);
                handlers[name]({ "_id" : name });
            }
        }
    }
};

function getCheckedRadio(name) {
    var options = document.getElementsByName(name);
    for (i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.checked) {
            return option.value;
        }
    }
    return null;
}

function set(name) {
    console.log("set::name = " + name);
    console.log("set::GET = " + dburl + name);
    request.open("GET", dburl + name, false);
    request.send();
}

function put(response, message) {
    console.log("put::response = " + response);
    console.log("put::message = " + message);
    request.open("PUT", dburl + response._id, false);
    request.setRequestHeader("Content-type", "application/json");
    message["_id"] = response._id;
    if (response._rev) {
        message["_rev"] = response._rev;
    }
    var s = JSON.stringify(message);
//  console.log("put: " + s);
    request.send(s);
}

function createDB() {
    request.open("PUT", dburl, false);
    request.send();
}

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
    "user" : setUser,
    "events": setEvents
    // add further handlers here
};

function setUser(response) {
    var type = getCheckedRadio("usertype");
    put(response, {"type" : type});
}

function setEvents(response) {
    const events = [
      {
        name: "Programmieren 1",
        questions: [
        {
            title: "Wieso Postfix?",
            description: "Wiesoooo???",
            points: 5, 
            user: "Student123",
            answers: [
                {text: "Wieso nicht?", points: -2, user: "Student666"},
                {text: "Weil es sehr cool ist.", points: 10, user: "Dozent999"}
            ]
        },
        {
            title: "Wieso C?",
            description: "Wiesoooo???",
            points: 5,
            user: "StudentCpp",
            answers:[
                {text: "Wieso nicht?", points: -2, user: "Student666"},
                {text: "Weil es sehr cool ist.", points: 10, user: "Dozent999"}
            ]
        }
        ]
      },
      {
        name: "Komplexität von Algorithmen",
        questions: [
          {title: "Was kommt in der KL dran?", description: "Welche Themen kommen in der Klausur dran? Nur die Sachen aus der Übung?", points: 15, user: "Student123",
            answers: [{text: "Ich schätze alles, also Vorlesung und Übung.", points: -2, user: "Student666"},
                      {text: "Also alles aus der Vorlesung, Übung und aus meinem coolen Buch :)", points: 15, user: "DrDozent"}]
          }]
      },
      {
        name: "Programmieren 2",
        questions: [
          {title: "Was kommt im Testat dran?", description: "Welche Themen?", points: 2, user: "Student544",
            answers: [{text: "Keine Ahnung", points: -4, user: "KeineAhnungStudent"},
                      {text: "Möglich ist alles was wir in Java gemacht haben (siehe Abgaben)", points: 10, user: "StudentMitVielAhnung"}]
          }]
      }
    ]
    put(response, {"events": events});
}
