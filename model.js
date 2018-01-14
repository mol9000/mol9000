var model = null;

var ViewModel = function() {
	this.username = ko.observable("student123");
	this.view = ko.observable(null); // null -> alle kurse. nicht null -> name vom momentanen kurs
};

$(document).ready(function() {
	model = new ViewModel();
	ko.applyBindings(model);
})