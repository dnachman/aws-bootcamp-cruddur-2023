# Week 6 — Deploying Containers

- Created `bin/db/test` to perform healthcheck against rds
- Added healthcheck endpoint to `app.py`
- Added `bin/flask/health-check` to test the health check
- Created Cloudwatch group for cluster:
  ```
  aws logs create-log-group --log-group-name "/cruddur/fargate-cluster"
  aws logs put-retention-policy --log-group-name "/cruddur/fargate-cluster" --retention-in-days 1
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

### Prepare images for ECR

- Log in to ECR: `aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"`
- Export the repository url: `export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"`
- Pull prerequisites locally: `docker pull python:3.10-slim-buster`
