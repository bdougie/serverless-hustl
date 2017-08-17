# serverless-hustl

Hustlin is a project I created to let me know when there is a home baseball game happening. I get notifications every morning so I can plan my day around not using public transportation before, after, or during baseball games.

The repo contains the code for that JSON API and is powered by a Lambda function that reads from a DynamoDB table. The code for the front-end react app can be found at [bdougie/hustlin-react](https://github.com/bdougie/hustlin-react) and mobile app at [bdougie/HusslnMobile](https://github.com/bdougie/HusslnMobile). 

Notifications are sent via Postmark every morning at 10am UTC. The code for that can be found at bdougie/scheduled-hustlin-notifications


## setup
```sh
git clone https://github.com/bdougie/serverless-hustl
cd serverless-hustl

npm install
```
### Serverless Configuration

This repo leverages the serverless framework to deploy to aws, refer to their [documentation for setup instructions](https://serverless.com/framework/docs/providers/aws/guide/quick-start/).

## Deploy

In order to deploy the you endpoint simply run

```bash
serverless deploy
```

The expected result should be similar to:

```bash
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (4.2 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
................
Serverless: Stack update finished...
Service Information
service: slshustl
stage: dev
region: us-west-1
api keys:
  None
endpoints:
  GET - https://...execute-api.us-west-1.amazonaws.com/dev/hello
  POST - https://...execute-api.us-west-1.amazonaws.com/dev/seed
  GET - https://...execute-api.us-west-1.amazonaws.com/dev/games
  GET - https://...execute-api.us-west-1.amazonaws.com/dev/today
functions:
  hello: slshustl-dev-hello
  seed: slshustl-dev-seed
  games: slshustl-dev-games
  today: slshustl-dev-today
```

There is no additional step required. Your defined schedule becomes active right away after deployment.

## Usage

To test your function remotely:

```bash
sls invoke -f today  
```
