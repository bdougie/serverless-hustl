'use strict';
var AWS = require('aws-sdk');
var uuid = require('uuid');

var fs = require('fs');
var contents = fs.readFileSync("baseball.json");
var baseballs = JSON.parse(contents)

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'There is a game today - San Francisco v LA Dodgers at 715',
    }),
  };

  callback(null, response);
};

module.exports.seed = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();

  baseballs.forEach(function(data) {
    var Item = {
      id: data.id,
      game: data.opponent,
      start_time: data.time
    };

    docClient.put({TableName: 'hustlndb', Item: Item}, (err) => {
      if (err) {
        callback(err);
      }
      callback(null, {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
      });
    });
  })
}


module.exports.getEvents = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: 'hustlndb',
    FilterExpression : 'game = :game_name',
    ExpressionAttributeValues : {':game_name' : event.query.game}
  }

  docClient.scan(params, (err, data) => {
    if (err) {
      callback(err);
    }

    var sum = data.Items.reduce((accumulated, current) => {
      return accumulated + current.rating}
    , 0);

    var average = sum/data.Items.length;

    callback(null, { averageRating: average });
  });
}
