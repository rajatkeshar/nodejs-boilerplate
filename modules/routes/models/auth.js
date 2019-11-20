const auth = require(global.appDir + '/lib/auth')();
const mailer = require(global.appDir + '/lib/mailer')();
const Users = require(global.appDir + '/models/users');

module.exports = function() {

    return {
        login: async function(request, response) {
            try {
                let user = await Users.getUserByUsername(request.body.username);
                if(!user) {
                    return response.json({ error: true, code: 4004, msg: "Unknown User!", data: request.body });
                }
                if(user && !user.status) {
                    return response.json({ error: true, code: 4004, msg: "User Not Verified!", data: request.body });
                }
                let isMatch = await Users.comparePassword(request.body.password, user.password);
                if(isMatch) {
                    response.json(auth.authorize(request, user));
                } else {
                    response.json({ error: true, code: 4004, msg: "Incorrect Password", data: null });
                }
            } catch (e) {
                response.json({ error: true, code: 400, msg: "Something went wrong!", data: request.body });
            }
        },
        verifyAccount: async function(request, response) {
            try {
                request.headers.token = request.params.token;
                let parseToken = auth.parseRequestToken(request);
                let valid = auth.isAuthorized(request);
                if(!valid) {
                    return response.json({ error: true, code: 4004, msg: "Unauthorized access", data: request.body });
                }
                let user = await Users.getUserByUsername(request.headers.username);
                if(user && user.status) {
                    return response.json({ error: true, code: 4004, msg: "User Already Verified!", data: request.body });
                }
                res = await Users.updateUser({userId: request.userId}, {status: true});
                response.json({ error: true, code: 400, msg: "Status Updated Successfully", data: res });
            } catch (e) {
                response.json({ error: true, code: 400, msg: "Something went wrong!", data: request.body });
            }
        },
        forgetPassword: function(request, response) {
            Users.resetPasswordToken(function(err, token) {
                Users.getUserByEmailId(request.body.email, function(err, user) {
                    if (user) {
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                        user.save(function(err, user) {
                            response.json({
                                error: false,
                                code: 2000,
                                msg: "A Link Has Been Sent To Your Email Id, Check Now",
                                data: user
                            });

                            var link = '<a href="' + process.env.SITE_URL + '/resetPassword?code=' + user.resetPasswordToken + '">' + process.env.SITE_URL + '/resetPassword?code=' + user.resetPasswordToken + '</a>';
                            var email = request.body.email;
                            var subject = "Forget Password";
                            var messBody = "Hi " + user.name + "\n click on the following link to reset password " + link;
                            mailer.sendEmail(email, subject, messBody, function(info) {
                                console.log(info);
                            });
                        });
                    } else {
                        response.json({
                            error: true,
                            code: 4004,
                            msg: "No account with that email address exists.",
                            data: ''
                        });
                    }
                });
            });
        },
        confirmPassword: function(request, response) {
            Users.getUserByResetPasswordToken(request.params.resetPasswordToken, function(err, userData) {
                if(userData) {
                    Users.updateUserPasswordByResetPasswordToken(request.params.resetPasswordToken, request.body.password, function(err, user) {
                        response.json({
                            error: false,
                            code: 2000,
                            msg: "Your password Updated Successfully",
                            data: user.resetPasswordToken
                        });
                        var email = userData.email;
                        var subject = "Password Change Successfully";
                        var messBody = "Hi " + userData.name + "\n You Password Has Been Changed Successfully ";
                        mailer.sendEmail(email, subject, messBody, function(info) {
                            console.log(info);
                        });
                    });
                } else {
                    response.json({
                        error: true,
                        code: 4004,
                        msg: "Your password reset code is Expired",
                        data: null
                    });
                }
            });
        },
        logout: function(request, response) {

            delete request.headers.token;
            delete request.headers.userId;

            response.json({
                error: false,
                code: 2000,
                msg: "Successfully Logout From Application",
                data: null
            });
        }
    };
};
