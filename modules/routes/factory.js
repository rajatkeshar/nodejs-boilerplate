const modelsPath = global.appDir + "/modules/routes/models/";

module.exports = {
    auth: require(modelsPath + 'auth')(),
    users: require(modelsPath + 'users')()
};
