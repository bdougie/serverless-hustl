'use strict';
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const uuid = require('uuid');

const fs = require('fs');
const contents = fs.readFileSync("baseball.json");
const baseballs = JSON.parse(contents)
const docClient = new AWS.DynamoDB.DocumentClient();

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
  baseballs.forEach(function(data) {
    const {name, start_time, end_time, started, standard_start_time} = data;
    const item = {
      id: `${data.id}`,
      name,
      start_time,
      end_time,
      started: `${started}`,
      standard_start_time
    };

    docClient.put({TableName: 'slshustl', Item: item}, (err) => {
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

module.exports.getHomeGames = (event, context, callback) => {
  const params = {
    TableName: 'slshustl'
  }

  docClient.scan(params, (err, data) => {
    if (err) {
      callback(err);
    }

    callback(null, { count: data.Items.length, homeGames: data.Items });
  });
}

module.exports.isBaseballToday = (event, context, callback) => {
  const params = {
    TableName: 'slshustl'
  }

  docClient.scan(params, (err, data) => {

    if (err) {
      callback(err);
    }

    const todaysGames = data.Items.filter(isToday)
    callback(null, { todaysGameCount: todaysGames.length, today: todaysGames });
  });

  function isToday(game) {
    const today = new Date();
    const gameTime = new Date(game.start_time);
    return (today.toDateString() == gameTime.toDateString());
  }
}

