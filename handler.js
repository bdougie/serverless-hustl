'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const fs = require('fs');
const contents = fs.readFileSync("baseball.json");
const baseballs = JSON.parse(contents)
const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'This is working and everything should be A OK 200 ;)',
    }),
  };

  callback(null, response);
};

module.exports.seed = (event, context, callback) => {
  baseballs.forEach((data) => {
    const {name, start_time, end_time, started, standard_start_time} = data;
    const item = {
      id: `${data.id}`,
      name,
      start_time,
      end_time,
      started: `${started}`,
      standard_start_time
    };

    dynamodb.put({TableName: 'slshustl', Item: item}, (err) => {
      if (err) {
        callback(err);
      }
      const response = {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
      }

      callback(null, response);
    });
  })
}

module.exports.games = (event, context, callback) => {
  const params = {
    TableName: 'slshustl'
  }

  dynamodb.scan(params, (err, data) => {
    if (err) {
      callback(err);
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      count: data.Items.length,
      body: data.Items
    };

    callback(null, response);
  });
}

module.exports.today = (event, context, callback) => {
  const params = {
    TableName: 'slshustl',
    FilterExpression : 'started = :started',
    ExpressionAttributeValues : {':started' : 'false'}
  }

  dynamodb.scan(params, (err, data) => {

    if (err) {
      callback(err);
    }

    const todaysGames = data.Items.filter(isToday)
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      todaysGameCount: todaysGames.length,
      body: todaysGames
    };

    callback(null, response);
  });

  function isToday(game) {
    const today = new Date();
    const gameTime = new Date(game.start_time);
    return (today.toDateString() == gameTime.toDateString());
  }
}

