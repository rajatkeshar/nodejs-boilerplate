const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UsersSchema  = new Schema({
	username: {
		type: String,
		index: true,
		required: true,
		unique: true
		},
	name: {
		type: String,
		required: true
		},
	email: {
		type: String,
		required: true,
		unique: true
		},
	password: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	}
});

//UsersSchema.index({ email: 1, username: 1 }, { unique: true });

const Users = module.exports = mongoose.model('Users', UsersSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
			//if(err){ throw err };
			callback(null, isMatch);
	});
};

module.exports.getUserByUsername = function(username, callback) {
	const query = {username: username};
	Users.findOne(query, callback);
};

module.exports.getUserByEmailId = function(email, callback) {
	const query = {email: email};
	Users.findOne(query, callback);
};

module.exports.getUserByUserId = function(userId, callback) {
	const query = {_id: userId};
	Users.findOne(query, callback);
};

module.exports.getUserByResetPasswordToken = function(resetPasswordToken, callback) {
	const query = {resetPasswordToken: resetPasswordToken, resetPasswordExpires: { $gt: Date.now() }};
	Users.findOne(query, callback);
};

module.exports.updateUserPasswordByResetPasswordToken = function(resetPasswordToken, password, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			const query = {resetPasswordToken: resetPasswordToken};
			const update = {$set: {password: hash, resetPasswordToken: undefined, resetPasswordExpires: undefined}};
			Users.update(query, update, callback);
		});
	});
};

module.exports.resetPasswordToken = function(callback) {
	crypto.randomBytes(20, function(err, buf) {
    	const token = buf.toString('hex');
        callback(err, token);
    });
};
