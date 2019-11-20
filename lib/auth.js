const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = function() {

    const user = {
        userName: "test",
        email: "test@mailinator.com"
    };

    this.isAuthorized = function(request) {
        return( request.headers && request.headers.userId)? true: false;
    };

    this.parseRequestToken = function(request) {
        if (request.headers && request.headers.token) {
            try {
                const token = request.headers.token;
                const publickey = fs.readFileSync('keys/publickey.pem');
				const decode = jwt.verify(token, publickey);
				request.headers.userId = (decode.userId)? decode.userId: null;
                request.headers.username = (decode.username)? decode.username: null;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    this.authorize = function(request, output) {
        const result = {};
        if(output && output._id && output.email) {
            const privatekey = fs.readFileSync('keys/privatekey.pem');

            const token = jwt.sign({"userId": output._id, "username": output.username}, privatekey, {
                algorithm: 'RS256',
                expiresIn: 60 * 60
            });

            result.msg = "Logged in successfully";
            result.code =2000;
            result.userInfo = {
                "name": output.name,
                "userId": output._id,
                "email": output.email,
                "username": output.username,
                "data": {
                    "token": token
                }
            };
            return result;
        } else {
            output.success = false;
            output.code = 4100;
            output.msg = "Login error";
            output.data = "";
            return output;
        }
    };

    this.generateToken = function(user) {
        const privatekey = fs.readFileSync('keys/privatekey.pem');
        const token = jwt.sign({"userId": user._id, "username": user.username, "email": user.email}, privatekey, {
            algorithm: 'RS256',
            expiresIn: 60 * 60
        });
        return token;
    }
    return this;
};
