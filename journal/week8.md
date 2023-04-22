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

Update the CDK stack to set up s3 notifications to our lambda with the package `aws-cdk-lib/aws-s3-notifications` . Our stack now:
![cfn-stack-s3n](assets/wk8/cfn-stack-s3n.png)

Make sure the lambda is allowed to Read and Put against the bucket:

```
assetsBucket.grantRead(myLambda);
assetsBucket.grantPut(myLambda);
```

We can see the file processed (different sizes):
![image-processed](assets/wk8/image-processed.png)

Create the SNS Topic
Create a SNS Subscription
Update / attach policies to allow permission

## CloudFront

Set up a cloudfront distribution for assets.cruddur.n5n.org:
![](assets/wk8/cf-dist.png)

Allow cloudfront access to the s3 bucket:
![](assets/wk8/s3-bucket-policy.png)

Set up Route53 so domain assets.cruddur.n5n.org is aliased to the cloudfront distribution:
![](assets/wk8/route53-assets.png)

Refactor buckets and CDK to separate uploads from assets for distribution from cloudfront

## Implement user profiles page

Update the backend to pull data from the database by implementing `backend-flask/db/sql/users/show.sql`
