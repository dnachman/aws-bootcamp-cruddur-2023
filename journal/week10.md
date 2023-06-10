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

CFN Template in `aws/cfn/networking/template.yaml`

Create VPC

Create InternetGateway / Attach

Create RouteTable

Create Route

Create Subnets

Our VPC after creation:
![](assets/wk10/cruddur-vpc.png)

Outputs from cloudformation:
![](assets/wk10/cfn-net-output.png)

## Cluster

CFN Template in `aws/cfn/cluster/template.yaml`

Output of cloudformation:
![](assets/wk10/cluster-outputs.png)

Cluster overview screen:
![](assets/wk10/cluster-overview.png)

## Services

CFN template in `aws/cfn/service/template.yaml`

## Postgres DB

CFN Template in `aws/cfn/db/template.yaml`

Healthy backend cluster once done:
![](assets/wk10/healthy-backend-service.png)

## DDB

Use SAM

## CICD
