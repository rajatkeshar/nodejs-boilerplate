var express = require('express');

module.exports.controller = function(app, model, auth) {

	app.post('/register', (request, response)=> {
		model.users.register(request, response);
	});

	app.post('/about', auth, (request, response)=> {
			response.json({
				"error": true,
				"msg": "permission access",
				"code": 2000,
				"data": "About"
			});
	});

	app.get('/user', auth, (request, response)=> {
		model.users.getUserInfo(request, response);
	});
};
