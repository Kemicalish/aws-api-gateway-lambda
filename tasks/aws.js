'use strict';
const gulp = require('gulp');
const _ = require('lodash');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const path = require('path');
const lambdaDynamoFunctionName = 'lambdaDynamo';
const exampleApiName = 'exampleApi';
const awsRoot = path.join('.', 'aws');
const spawn = require("gulp-spawn");
const devDir = 'dev';
const exampleRole = 'arn:aws:iam::680228575004:role/lambda-gateway-execution-role'; //set up a role in aws console with AWSLambdaFullAccess  policiy
const exampleProfile = 'lambda-gateway-execution'; //get it with aws configure (check readme)

const createLambdaDynamo = {
    args: [
        'lambda',
        'create-function',
        '--region', 'eu-west-1',
        '--function-name', lambdaDynamoFunctionName,
        '--zip-file', 'fileb://' + path.join(__dirname, '..', 'dev', lambdaDynamoFunctionName + '.zip'), 
        '--role', exampleRole, 
        '--handler', lambdaDynamoFunctionName + '.handler',
        '--runtime', 'nodejs4.3', 
        '--profile', exampleProfile
    ]
};

const callLambda = functionName => {return {
    args: [
        'lambda',
        'invoke',
        '--invocation-type', 'RequestResponse ', //Event (no output) or RequestResponse (message output)
        '--function-name', functionName,
        '--region', 'eu-west-1', 
        '--payload', 'file://' + path.join(__dirname, '..', 'aws', 'read.json') , 
        '--profile', exampleProfile,
        path.join(__dirname, '..', 'dev', 'echo.output') 
    ]
}};

const createApiBase = {
    args: [
        'apigateway',
        'create-rest-api'
    ]
}
const createApiHelp = _.merge({}, createApiBase, { args:_.concat(createApiBase.args, 
    ['help']
)});
const createApiCall = apiName => _.merge({}, createApiBase, { 
    args:_.concat(createApiBase.args, 
        [
            '--name', apiName,
            '--region', 'eu-west-1',
            '--profile', exampleProfile
        ]
)});



function run(cmd, args, callback) {
    console.log(args);
    console.log('RUN', cmd, args.join(' '));
    const spawn = require('child_process').spawn;
    const command = spawn(cmd, args);
    let result = '';
    command.stdout.on('data', function(data) {
        console.log();
         result += data.toString();
    });
    command.stderr.on('data', function(data) {
        console.error(data.toString('utf-8'));
    });
    command.on('close', function(code) {
        return callback(result);
    });
}

gulp.task('aws-zip-lambda-dynamo', () => {
    const lambdaDynamoFunctionPath = path.join(awsRoot, lambdaDynamoFunctionName + '.js');
    console.log(lambdaDynamoFunctionPath);
  return gulp.src(lambdaDynamoFunctionPath)
     .pipe($.zip(lambdaDynamoFunctionName + '.zip'))
    .pipe(gulp.dest('dev'));
});

gulp.task('aws-create-lambda-dynamo', ['aws-zip-lambda-dynamo'], () => {
     run('aws', createLambdaDynamo.args, console.log)
});

gulp.task('aws-dynamo-call', () => {
     run('aws', callLambda(lambdaDynamoFunctionName), console.log)
});

//Note: each call create a new api with same name
gulp.task('aws-create-api', () => {
     run('aws', createApiCall(exampleApiName).args, console.log)
});

gulp.task('main', ['aws-create-api', 'aws-create-lambda-dynamo']);

