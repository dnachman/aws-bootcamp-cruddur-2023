# Week 10 — CloudFormation Part 1

## Preparation

Install `cfn-lint` for python

https://github.com/aws-cloudformation/cloudformation-guard

Set up environment:

```
aws s3 mk s3://cfn-artifacts
export CFN_BUCKET="cfn-artifacts"
gp env CFN_BUCKET="cfn-artifacts"
```

## Networking

Create VPC

Create InternetGateway / Attach
Create RouteTable
Create Route
