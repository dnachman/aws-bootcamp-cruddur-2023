# Week 8 — Serverless Image Processing

## Setting up CDK for serverless image thumbnails

```
mkdir thumbing-serverless-cdk
cd thumbing-serverless-cdk/
cdk init app --language typescript
```

Created `thumbing-serverless-cdk-stack.ts` to set up s3 bucket

Bootstrap CDK for account/region `cdk bootstrap aws://123456789/us-east-1`
![cdk-bootstrap](assets/wk8/cdk-bootstrap.png)

Deploy the stack with `cdk deploy`
![cdk-deploy-s3](assets/wk8/cdk-deploy-s3.png)
![cloudformation-stacks](assets/wk8/cloudformation-stacks.png)

Create the code to set up the lambda with code to be written in `aws/lambda/process-images`
