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
	status: {
		type: Boolean,
		default: false
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
	return bcrypt.compareSync(candidatePassword, hash);
};

module.exports.updateUser = async function(query, update) {
	return await Users.findOneAndUpdate(query, update, { upsert: true, new: true, runValidators: true, useFindAndModify: false });
}

module.exports.updateUserPassword = async function(query, password) {
	const salt = bcrypt.genSaltSync(10);
	password = bcrypt.hashSync(password, salt);
	const update = {$set: {password: password}};
	return await Users.findOneAndUpdate(query, update, { upsert: true, new: true, runValidators: true, useFindAndModify: false });
};

module.exports.getUserByUserId = function(userId, callback) {
	const query = {_id: userId};
	Users.findOne(query, callback);
};
