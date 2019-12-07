"use strict";

// authentication utils
const authenticate = require("./authenticate");

// data factories
const githubFactory = require("./factory/githubFactory");
const gcpFactory = require("./factory/gcpFactory");

exports.githubUserLogin = async (event, context) => {
  const requestBody = await authenticate.normalizeRequest(event);
  let responseStatusCode = 500, responseBody, responseHeaders;
  
  // check if error while forming the request body
  if(requestBody.error) {
    responseStatusCode = requestBody.error.statusCode;
    responseHeaders = await authenticate.getResponseHeaders();
    responseBody = JSON.stringify(requestBody);
  }
  // exchange the access code for access token
  // and fetch the github user details
  else {
    let accessData = await githubFactory.getGithubAccessToken(requestBody.body);
    if(accessData.error) {
      responseStatusCode = accessData.error.statusCode;
      responseHeaders = await authenticate.getResponseHeaders();
      responseBody = accessData.error.message;
    }
    else {
      let getUser = await githubFactory.getUser(accessData.accessToken);
      if(getUser.error) {
        responseStatusCode = getUser.error.statusCode;
        responseHeaders = await authenticate.getResponseHeaders();
        responseBody = getUser.error.message;
      }
      else {
        responseStatusCode = 200;
        responseHeaders = await authenticate.getResponseHeaders(accessData.accessToken, getUser.userData.id);
        responseBody = JSON.stringify(getUser.userData);
      }
    }
  }
  
  return {
    "statusCode": responseStatusCode,
    "headers": responseHeaders,
    "body": responseBody,
    "isBase64Encoded": false
  };
};

exports.getSignedUrlForStorage = async (event, context) => {
  const requestBody = await authenticate.normalizeRequest(event);
  let responseStatusCode = 500, responseBody, responseHeaders;

  // check if error while forming the request body
  if(requestBody.error) {
    responseStatusCode = requestBody.error.statusCode; 
    responseBody = JSON.stringify(requestBody);
  }
  // get the access token from CSRF token
  // and after validating it,
  // generate the signed url
  else {
    
  }

  return {
    "statusCode": responseStatusCode,
    "headers": responseHeaders,
    "body": responseBody,
    "isBase64Encoded": false
  };
}