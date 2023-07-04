# Week X — Cleanup

## Complete static build

### Load build to s3 for cloudfront serving

(instructor's solution: https://github.com/teacherseat/aws-s3-website-sync)

```sh
aws s3 sync $FRONTEND_REACT_JS_PATH/build/ s3://$FRONTEND_BUCKET/ --recursive

# get the cloudfront distribution id
CF_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Aliases.Items, 'cruddur.n5n.org')].Id" --output text)
echo $CF_DISTRIBUTION_ID

# invalidate the cloudfront cache
aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
```

It would be better to create an invalidation batch file with the exact files, but I am skipping that for now

### Skipping setting up github actions

## Bringing the app up from scratch

I added some notes on bringing everything up from scratch in a new account (since I moved to a free-tier eligible account because of RDS/ALB cost).

Order to executeCFN :

1. networking
2. cluster
3. ALB
4. database

```
After:
bin/rds/update-sg
bin/db/schema-load
bin/db/migrate
```

5. service

```
Before:
 docker build -t backend-flask .
 docker push $ECR_BACKEND_FLASK_URL:latest
```

6. CICD

```
bin/rds/update-sg (change env variable as needed)
bin/db/schema-load
bin/db/migrate
```

7. Frontend

```
bin/frontend/static-build
bin/frontend/sync
```

Post confirmation lambda:
Update the post confirmation lambda `CONNECTION_URL` environment variable.
Move to the new VPC and public subnets.
Create a new security group `CruddurLambdaSG` - no inbound rules needed
Update RDS security group to allow inbound on `CruddurLambdaSG`

Update Route53 with new ALB for api.cruddur...

8. DDB

```
./ddb/build
./ddb/package
./ddb/deploy
```

## Refactoring, cleanup and finishing features

Backend application:

- routes added to individual route files
- python decorators used for jwt validation, rollbar, xray, etc
- use environment variable for DDB table

Frontend application:

- implement replies
- refactor requests, other utilities,
