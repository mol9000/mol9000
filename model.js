var model = null;

function addCourse(name) {
	model.courses.push({name: name});
}

function deselectCourse() {
	model.viewCourse(null);
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

function addQuestion(name, author, course, comments, score) {
	var question = {name: name,
					author: author,
					course: course,
					comments: comments,
					score: score};
	model.questions.push(question);
}

var ViewModel = function() {
	var self = this; // "this" context in javascript is a fucking joke
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
	})
};

$(document).ready(function() {
	model = new ViewModel();
	ko.applyBindings(model);
	addQuestion('Warum?', 'pupsgesicht24', 'Programmieren 3', 64, 128);
	addCourse('Programmieren 3')
	addCourse('Komplexität von Kaffee')
})