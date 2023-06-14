var DataTypes = require("sequelize").DataTypes;
var _user = require("./users");

function initModels(sequelize) {
  var users = _user(sequelize, DataTypes);


  return {
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
