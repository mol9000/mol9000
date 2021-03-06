var request = new XMLHttpRequest();

request.onreadystatechange = function() {
	// console.log("onreadystatechange: " + request.readyState + ", " +  request.status);
	// console.log(request.responseText);
	if (request.readyState == 4) {
		if (request.status == 200) {
			var response = JSON.parse(request.responseText);
			handlers[response._id](response);
		}
		if (request.status == 404) {
			console.log("not found: " + request.responseText);
		}
	}
};



function get(variable) {
	// console.log("get " + variable);
	request.open("GET", dburl + variable, false);
	request.send();
}

function update() {
	for (var name in handlers) {
		// console.log("updating " + name);
		get(name);
	}
}

// request updates at a fixed interval (ms)
var intervalID = setInterval(update, 1000);

///////////////////////////////////////////////////////////////////////////////
// your code below

var dbname = "gmci";
var dburl = "http://127.0.0.1:5984/" + dbname + "/";
var handlers = {
	"events" : setEvents,
	"user" : setUser
	// add further handlers here
};

var dbLastEventRev = null;
var model = null;

function setUser(response) {
	if(response.type === 'student') {
		model.username('stud123');
	} else {
		model.username('dozentAllwissend');
	}
	model.role(response.type);
}

function setEvents(response) {
	if(dbLastEventRev && dbLastEventRev === response._rev) {
		return;
	}
	dbLastEventRev = response._rev;
	if(!courseExists(response.events)) {
		response.events.forEach(course => {
			addCourse(course.name);
			course.questions.forEach(q => {
				addQuestion(q.title, q.description, q.user, course.name, q.answers, q.points);
			})
		})
		
	}

}

function addCourse(name) {
	model.courses.push({name: name});
	var announcement = {course: name, author: 'dozentAllwissend', name: 'Themen für die Klausur', score: 100};
	model.announcements.push(announcement);
}

function deselectCourse() {
	model.viewCourse(null);
}

function courseExists(name) {
	return model.courses().some(x => x.name === name);
}

function selectCourse(name) {
	gotoModule(name);
	model.viewCourse(name);
}

function selectQuestion(question) {
	selectCourse(question.course);
	gotoQuestion(question.name);
	model.viewQuestion(question);
}

function addQuestion(name, description, author, course, comments, score) {
	var commentsArray = ko.observableArray();
	comments.forEach(x => {
		x.badge = x.user.toLowerCase().includes('dozent')
		commentsArray.push(x)
	});
	commentsArray.sort((a, b) => b.points - a.points)
	commentsArray.sort((a, b) => b.badge - a.badge) // this works because lol javascript
	var question = {name: name,
					description: description,
					author: author,
					course: course,
					comments: commentsArray,
					badge: commentsArray().some(x => x.badge),
					score: score};
	model.questions.push(question);
}

function addQuestionFromModal() {
	var question = {name: $("#modalQuestionTitle").val(),
		description: $("#modalQuestionText").val(),
		author: model.username(),
		course: model.viewCourse(),
		comments: ko.observableArray(),
		badge: false,
		score: 0};
	model.questions.push(question);
}

function addAnnouncementFromModal() {
	var announcement = {course: model.viewCourse(), author: 'dozentAllwissend', name: $("#modalQuestionTitle").val(), score: 0};
	model.announcements.push(announcement);
}

function modalClickClick() {
	if(model.role() === "student") {
		addQuestionFromModal();
	} else {
		addAnnouncementFromModal();
	}
}

var ViewModel = function() {
	var self = this; // "this" context in javascript is a fucking joke
	this.role = ko.observable("student");
	this.username = ko.observable("student123");
	this.viewCourse = ko.observable(null); // null -> alle kurse. nicht null -> name vom momentanen kurs
	this.viewQuestion = ko.observable(null);
	this.courses = ko.observableArray();
	this.questions = ko.observableArray();
	this.courseQuestions = ko.pureComputed(function() {
		var visibleQuestions = [];
		self.questions().forEach(q => {
			if(q.course === self.viewCourse()) {
				visibleQuestions.push(q);
			}
		});
		return visibleQuestions;
	});
	this.announcements = ko.observableArray();
	this.courseAnnouncements = ko.pureComputed(function() {
		var visibleAnnouncements = [];
		self.announcements().forEach(a => {
			if(a.course === self.viewCourse()) {
				visibleAnnouncements.push(a);
			}
		});
		return visibleAnnouncements;
	});
	this.isLecturer = ko.pureComputed(function() {
		return self.role() === 'dozent';
	});
};

$(document).ready(function() {
	model = new ViewModel();
	ko.applyBindings(model);

	var array = [
		{ name : "Programmieren 1" },
		{ name : "Programmieren 2" },
		{ name : "Komplexität von Algorithmen" },
		{ name : "Software-Projekt" },
	]

	var courses = $.map(array, function(item) {
					return { value: item.name};
				})

	$('#autocomplete').autocomplete({ //TODO: on enter choose topmost course and always display ghost of topmost course in input body
		lookup: courses,
		onSelect: function (suggestion) {
			console.log(suggestion)
			selectCourse(suggestion.value)
		}
	  });
})
