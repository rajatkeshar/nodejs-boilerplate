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

module.exports.registerUser = async function(newUser) {
	const salt = bcrypt.genSaltSync(10);
	newUser.password = bcrypt.hashSync(newUser.password, salt);
	return await newUser.save();
};

module.exports.getUserByUsername = async function(data) {
	return await Users.findOne({$or: [{username: data}, {email: data}]});
};

module.exports.comparePassword = async function(candidatePassword, hash) {
	return bcrypt.compareSync(candidatePassword, hash)
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
