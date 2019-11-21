module.exports.controller = function(app, model, auth) {

    app.post('/login', (request, response)=> {
		model.auth.login(request, response);
	});

    app.get('/verifyAccount/:token', (request, response)=> {
		model.auth.verifyAccount(request, response);
	});

	app.post('/forgetPassword', (request, response)=> {
		model.auth.forgetPassword(request, response);
	});

	app.post('/confirmPassword/:token', (request, response)=> {
		model.auth.confirmPassword(request, response);
	});

	app.post('/logout', (request, response)=> {
		model.auth.logout(request, response);
	});
};
