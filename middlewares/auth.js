exports.checkAuthenticated = function(request, response, next) {
	if(request.isAuthenticated()) {
		return next();
	}
	response.redirect('/signup');
}

exports.checkNotAuthenticated = function(request, response, next) {
	if (request.isAuthenticated()) {
		return response.redirect('/');
	}
	next();
}