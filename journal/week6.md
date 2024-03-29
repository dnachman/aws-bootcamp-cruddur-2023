# Week 6 — Deploying Containers

- Created `bin/db/test` to perform healthcheck against rds
- Added healthcheck endpoint to `app.py`
- Added `bin/flask/health-check` to test the health check
- Created Cloudwatch group for cluster:
  ```
  aws logs create-log-group --log-group-name "cruddur"
  aws logs put-retention-policy --log-group-name "cruddur" --retention-in-days 1
  ```
- Create an ecs cluster

  ```
  aws ecs create-cluster \
    --cluster-name cruddur \
    --service-connect-defaults namespace=cruddur
  ```

- Create Elastic Container Registry (ECR):

  ```
  aws ecr create-repository \
  --repository-name cruddur-python \
  --image-tag-mutability MUTABLE
  ```

## Prepare images for ECR

### Python Base

- Log in to ECR: `aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"`
- Export the repository url: `export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"`
- Pull prerequisites locally: `docker pull python:3.10-slim-buster`
- Tag the prereq : `docker tag python:3.10-slim-buster $ECR_PYTHON_URL:3.10-slim-buster`
- Push it to ECR: `docker push $ECR_PYTHON_URL:3.10-slim-buster`

### Backend flask

- Create the repo: `aws ecr create-repository   --repository-name backend-flask   --image-tag-mutability MUTABLE`
- Export repo url: `export ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"`
- Build the image `docker build -t backend-flask .`
- Tag it: `docker tag backend-flask:latest $ECR_BACKEND_FLASK_URL:latest`
- Publish / Push : `docker push $ECR_BACKEND_FLASK_URL:latest`

### Frontend react

- Create the repo: `aws ecr create-repository   --repository-name frontend-react-js   --image-tag-mutability MUTABLE`
- Export repo url: `export ECR_FRONTEND_REACT_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/frontend-react-js"`
- Build the image
  ```
  docker build \
  --build-arg REACT_APP_BACKEND_URL="https://api.cruddur.n5n.org" \
  --build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
  --build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
  --build-arg REACT_APP_AWS_USER_POOLS_ID="us-east-1_Ynp7ieLpL" \
  --build-arg REACT_APP_CLIENT_ID="77b6n92j77dtiq8f6l2lm7mbb0" \
  -t frontend-react-js \
  -f Dockerfile.prod \
  .
  ```
- Tag it: `docker tag frontend-react-js:latest $ECR_FRONTEND_REACT_URL:latest`
- Publish / Push : `docker push $ECR_FRONTEND_REACT_URL:latest`

## Set up ECS

### Set up parameter store

```sh
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_ACCESS_KEY_ID" --value $AWS_ACCESS_KEY_ID
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/AWS_SECRET_ACCESS_KEY" --value $AWS_SECRET_ACCESS_KEY
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/CONNECTION_URL" --value $PROD_CONNECTION_URL
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/ROLLBAR_ACCESS_TOKEN" --value $ROLLBAR_ACCESS_TOKEN
aws ssm put-parameter --type "SecureString" --name "/cruddur/backend-flask/OTEL_EXPORTER_OTLP_HEADERS" --value "x-honeycomb-team=$HONEYCOMB_API_KEY"
```

![parameter-store](assets/wk6/parameter-store.png)

### Create execution role

- Create `aws/policies/service-assume-role-execution-policy.json` and create IAM role: `aws iam create-role --role-name CruddurServiceExecutionRole --assume-role-policy-document file://aws/policies/service-assume-role-execution-policy.json`
- Create `aws/policies/service-execution-policy.json` and create IAM role policy: `aws iam put-role-policy   --policy-name CruddurServiceExecutionPolicy   --role-name CruddurServiceExecutionRole   --policy-document file://aws/policies/service-execution-policy.json`
  ![CruddurServiceExecutionRole-permissions](assets/wk6/CruddurServiceExecutionRole-permissions.png)
  ![CruddurServiceExecutionRole-trust](assets/wk6/CruddurServiceExecutionRole-trust.png)

### Create task role

```sh
aws iam create-role \
    --role-name CruddurTaskRole \
    --assume-role-policy-document "{
  \"Version\":\"2012-10-17\",
  \"Statement\":[{
    \"Action\":[\"sts:AssumeRole\"],
    \"Effect\":\"Allow\",
    \"Principal\":{
      \"Service\":[\"ecs-tasks.amazonaws.com\"]
    }
  }]
}"

aws iam put-role-policy \
  --policy-name SSMAccessPolicy \
  --role-name CruddurTaskRole \
  --policy-document "{
  \"Version\":\"2012-10-17\",
  \"Statement\":[{
    \"Action\":[
      \"ssmmessages:CreateControlChannel\",
      \"ssmmessages:CreateDataChannel\",
      \"ssmmessages:OpenControlChannel\",
      \"ssmmessages:OpenDataChannel\"
    ],
    \"Effect\":\"Allow\",
    \"Resource\":\"*\"
  }]
}
"

aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/CloudWatchFullAccess --role-name CruddurTaskRole
aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess --role-name CruddurTaskRole
```

![CruddurTaskRole](assets/wk6/CruddurTaskRole.png)

## Set up ECS service

Create task definition `aws/task-definitions/backend-flask.json`

Register task definition `aws ecs register-task-definition --cli-input-json file://aws/task-definitions/backend-flask.json`
![backend flask](assets/wk6/task-def-backend-flask.png)

Grab some VPC environment variables

```sh
export DEFAULT_VPC_ID=$(aws ec2 describe-vpcs \
--filters "Name=isDefault, Values=true" \
--query "Vpcs[0].VpcId" \
--output text)
echo $DEFAULT_VPC_ID

export DEFAULT_SUBNET_IDS=$(aws ec2 describe-subnets  \
 --filters Name=vpc-id,Values=$DEFAULT_VPC_ID \
 --query 'Subnets[*].SubnetId' \
 --output json | jq -r 'join(",")')
echo $DEFAULT_SUBNET_IDS
```

Set up security group for service

```sh
export CRUD_SERVICE_SG=$(aws ec2 create-security-group \
  --group-name "crud-srv-sg" \
  --description "Security group for Cruddur services on ECS" \
  --vpc-id $DEFAULT_VPC_ID \
  --query "GroupId" --output text)
echo $CRUD_SERVICE_SG

aws ec2 authorize-security-group-ingress \
  --group-id $CRUD_SERVICE_SG \
  --protocol tcp \
  --port 4567 \
  --cidr 0.0.0.0/0

export CRUD_SERVICE_SG=$(aws ec2 describe-security-groups \
  --filters Name=group-name,Values=crud-srv-sg \
  --query 'SecurityGroups[*].GroupId' \
  --output text)
```

Create the service definition file at `aws/json/service-backend-flask.json`

Create the service: `aws ecs create-service --cli-input-json file://aws/json/service-backend-flask.json`

## Debugging containers on Fargate

Download and install the session-manager-plugin on development machine:

```
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" -o "session-manager-plugin.deb"
sudo dpkg -i session-manager-plugin.deb
```

Ensure the service definition contains a line to enable execute `"enableExecuteCommand": true`

Connect via systems manager:

```sh
aws ecs execute-command  \
--region $AWS_DEFAULT_REGION \
--cluster cruddur \
--task 219167f5c78a4c03a26d4adf130d8403 \
--container backend-flask \
--command "/bin/bash" \
--interactive
```

## Fix security group for backend-flask

Once logged into the ECS instance, we can see that the database connection is not successful (you can also see this in CloudWatch logs)

Update the default security group (which is what the RDS is using) to allow for access from the ECS instance (`crud-srv-sg`)

![security-group](assets/wk6/inbound-rules-backend-to-pgsql.png)

Validate it worked on the ECS instance command line (failure before the SG change, and success after):
![ecs-rds-test](assets/wk6/rds-test-before-after-sg-change.png)

## Turn on service discovery

Deleted and recreated the service through the console with service discovery turned on
![Service Connect](assets/wk6/add-service-connect.png)

Needed to update the `CruddurServiceExecutionRole` with the `logs:CreateLogGroup` permissions
![ExecutionPolicy](assets/wk6/cruddurserviceexecutionpolicy-createloggroup.png)

Recreate it using the `service-backend-flask.json` by adding this block:

```json
"serviceConnectConfiguration": {
    "enabled": true,
    "namespace": "cruddur",
    "services": [
      {
        "portName": "backend-flask",
        "discoveryName": "backend-flask",
        "clientAliases": [{"port": 4567}]
      }
    ]
  },
```

## Create an Application Load Balancer

Create an ALB in the console called `cruddur-alb`
Set up a new security group listening on 80 and 443 : `cruddur-alb-sg`
Alter the `crud-srv-sg` to allow traffic from `cruddur-alb-sg` to port 4567
![cruddur-alb](assets/wk6/cruddur-alb.png)
Create a target group to IP Addresses called `cruddur-backend-flask-tg`
Create a target group to IP Addresses called `cruddur-frontend-react-js-tg`
![backend-tg](assets/wk6/cruddur-backend-flask-tg.png)
Complete setup of `cruddur-alb` to point to the `cruddur-frontend-react-js-tg`

Update `service-backend-flask.json` with load balancer configuration:

```
"loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-1:774431287401:targetgroup/cruddur-backend-flask-tg/b185a2539f9292dc",
      "loadBalancerName": "arn:aws:elasticloadbalancing:us-east-1:774431287401:loadbalancer/app/cruddur-alb/5d0222bb7e3c0420",
      "containerName": "backend-flask",
      "containerPort": 4567
    }
  ],
```

Test the load balancer:

![alb-backend](assets/wk6/alb-backend.png)

## Load the frontend service

Create task definition `aws/task-definitions/frontend-react-js.json`

Register task definition `aws ecs register-task-definition --cli-input-json file://aws/task-definitions/frontend-react-js.json`

Create the service `aws ecs create-service --cli-input-json file://aws/json/service-frontend-react-js.json`

Update the ECS service security group to include port 3000
![update-sg](assets/wk6/update-sg.png)

Test cruddur
![cruddur-on-alb](assets/wk6/cruddur-on-alb.png)

## Host at our own domain

Configure ALB rules for listeners
![listeners](assets/wk6/https-listener.png)

Set up DNS to route to our ALB
![route53](assets/wk6/route53.png)

Create certificates in ACM and set up ALB to use it
![certs](assets/wk6/certs.png)
![listeners](assets/wk6/alb-listeners.png)

Check the final result
![cruddur-at-domain](assets/wk6/cruddur-at-domain.png)

## Fix platform architecture if building on Mac

The following error was caused because I'm developing on a Mac (ARM) and by default Fargate is using x86/AMD: `exec /usr/local/bin/python3: exec format error`
I updated the `aws/task-definitions/backend-flask.json` to specify the architecture as ARM and use Fargate ARM instances

```
  "runtimePlatform": {
    "operatingSystemFamily": "LINUX",
    "cpuArchitecture": "ARM64"
  },
```

## Flask security

Update `cruddur-alb-sg` security group to limit to my IP only
Create `Dockerfile.prod` in backend directory and remove debugging/reload options
Rebuilt the image, tag it, and upload it to ECR
![backend-flask-prod](assets/wk6/backend-flask-prod.png)
Force an update to the `backend-flask` service to pick up the new image

## Additional items

Configured environment variables and refactored bin directory
Added xray to the containers
Switched docker-compose to use custom network
Configured container insights
