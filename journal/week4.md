# Week 4 — Postgres and RDS

## Create postrgres db in RDS

- Create from cli:

```
aws rds create-db-instance \
  --db-instance-identifier cruddur-db-instance \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version  14.6 \
  --master-username CHANGE_ME \
  --master-user-password CHANGE_ME \
  --allocated-storage 20 \
  --availability-zone us-east-1a \
  --backup-retention-period 0 \
  --port 5432 \
  --no-multi-az \
  --db-name cruddur \
  --storage-type gp2 \
  --publicly-accessible \
  --storage-encrypted \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --no-deletion-protection

```

![rds create](assets/wk4/rds-created.png)

## Working with Postrgres

- Connect to local instance: `psql -U postgres --host localhost`
- Create the database in the client: `CREATE database cruddur;`
  ![create database](assets/wk4/pg-create-database.png)
- Load the extension from the schema file: `psql cruddur < db/schema.sql -h localhost -U postgres`
  ![create extension](assets/wk4/create-extension.png)
- Set up connection url locally: `export CONNECTION_URL="postgresql://postgres:password@localhost:5432/cruddur"`
- Create scripts :
  - db-create
  - db-drop
  - db-schema-load
- Add schema for tables

## Update app to use the postgres db

- added functions to wrap query, modified home activities to return data from database:
  ![home from database](assets/wk4/home-from-db.png)
- Connected to RDS instance, set up database and updated security group

## Created the Cognito post-confirmation hook

- Created lambda function with a lambda layer for the pg drivers from https://github.com/jetbridge/psycopg2-lambda-layer
- Updated the auto-generated role with a Customer Inline policy to allow it to access the RDS instance:
  ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "ec2:DescribeNetworkInterfaces",
                    "ec2:CreateNetworkInterface",
                    "ec2:DeleteNetworkInterface",
                    "ec2:DescribeInstances",
                    "ec2:AttachNetworkInterface"
                ],
                "Resource": "*"
            }
        ]
    }
  ```
- Created a lambda test event json to ease steps to debug the code (so i could get the sql correct):
  ```
    {
      "request": {
        "userAttributes": {
          "name": "David",
          "email": "test@nachman.org",
          "preferred_username": "testy",
          "sub": "rand-omch-awer"
        }
      }
    }
  ```
- Got it working:
  ![DB users after cognito hook](assets/wk4/db-users-post-conf.png)
