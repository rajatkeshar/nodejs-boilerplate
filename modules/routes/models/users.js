var auth = require(global.appDir + '/lib/auth')();
var Users = require(global.appDir + '/models/users');
var mailer = require(global.appDir + '/lib/mailer')();
module.exports = function() {

    return {
        register: async function(request, response) {
            try {
                let user = await Users.registerUser(
                    new Users({
            			name: request.body.name,
            			username: request.body.username,
            			email:request.body.email,
            			password: request.body.password
        		    })
                );
                let token = auth.generateToken(user);
                let URL = process.env.SITE_URL + '/verifyAccount/' + token;
                let info = mailer.sendEmail(user.email, "Node Boilerplate - Verify Email", URL);
                response.json({ error: false, code: 2000, msg: "Resisteration Successful, Check Your Email", data: user._id });
            } catch (e) {
                if(e.code == 11000) {
                    response.json({ error: true, code: e.code, data: null, msg: "User Already Exist" });
                } else {
                    response.json({ error: true, code: e.code, data: null, msg: "User Registration Failed" });
                }
            }
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
