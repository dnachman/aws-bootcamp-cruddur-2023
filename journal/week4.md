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
