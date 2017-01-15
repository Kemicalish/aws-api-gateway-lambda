# aws-api-gateway-lambda
testing aws api gateway with aws lambda and dynamodb


Create Client Profile
```
$ aws configure
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name [None]: eu-west-1
Default output format [None]: json
```

Create both an example api 

```shell
gulp aws-create-api
```

Create and a lambda which call a dynamodb operation define within aws/read.json (here it's using a dynamodb named 'projects' with primaryKey 'projectId' === '123')

```shell
gulp aws-create-lambda-dynamo
```

Get Api Resources
```shell
gulp aws-api-get-resources
```

Create a resource dbManager
```shell
gulp aws-create-resource-dbmanager
```

Create an Api Post Method for dbManager
```shell
gulp aws-create-dbmanager-post
```

Link lambda dynamo wih dbManager post method
```shell
gulp aws-create-dbmanager-post
```