const cfb = require("cfb.js");
const dotenv = require("dotenv");
const path = require("path");

// Create an instance of the CFBD API
function GetAPIInstance() {

  // Load API key using dotenv
  require('dotenv').config()
  const token = process.env["api-token"];

  // Configure API key authorization: ApiKeyAuth
  var defaultClient = cfb.ApiClient.instance;
  var ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
  ApiKeyAuth.apiKey = `Bearer ${token}`;
  var bettingApiInstance = new cfb.BettingApi()

  return bettingApiInstance;
}

module.exports = {
  GetAPIInstance
};
