var auth = require(global.appDir + '/lib/auth')();
var Users = require(global.appDir + '/models/users');
var mailer = require(global.appDir + '/lib/mailer')();
module.exports = function() {

    return {
        register: function(request, response) {
            newUser = new Users({
    			name: request.body.name,
    			username: request.body.username,
    			email:request.body.email,
    			password: request.body.password
    		});

    		Users.createUser(newUser, function(err, user) {
    			if(err) {
                    if(err.code == 11000) {
                        response.json({
            				error: true,
            				code: 1100,
            				msg: "User Already Exist",
            				data: null
            			});
                    } else {
                        response.json({
            				error: true,
            				code: 1100,
            				msg: "User Registration Failed",
            				data: null
            			});
                    }
                } else {
                    response.json({
        				error: false,
        				code: 2000,
        				msg: "User Resisteration Successful",
        				data: user._id
        			});
                }
    		});
        },
        getUserInfo: function(request, response) {
            console.log(request.headers.userId);
            Users.getUserByUserId(request.headers.userId, function(err, user) {
                if(user) {
                    response.json({
        				error: false,
        				code: 2000,
        				msg: "User Data",
        				data: user
        			});
                } else {
                    response.json({
                        error: true,
                        code: 1100,
                        msg: "Error Occured In Getting Users Data",
                        data: null
                    });
                }
            });
        }
    };
};
