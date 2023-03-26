# Week 5 — DynamoDB and Serverless Caching

## DynamoDb

- Reorganized the bin directories
- Added scripts to create ddb, drop etc as prep for deeper work
- Created new script to list users in `bin/cognito/list-users`:
  ![list users](assets/wk5/list-users.png)
- Created script to update cognito users into Postgresql `bin/db/update_cognito_user_ids`

  - Ran it to update the cognito_user_id:
    ![output from update_cognito_user_ids](assets/wk5/update-cognito-ids.png)
  - Confirmed in the rds database:
    ![updated postgres](assets/wk5/updated-postgres.png)

- Implement `CheckAuth.js` in the frontend project
- Modify `bin/ddb/seed` to have my username instead of **andrewbrown** so I could see the results
  ![](assets/wk5/messages-loading.png)
- Rework frontend MessageGroups, etc and the `messages.py`, `message_groups.py`, etc to get the message listing to display correctly bassed on `message_group_uuid`
  ![message group listing](assets/wk5/messages-listing.png)

- This is an image of the DynamoDb modeling and a row representation from the class:
  ![ddb model](assets/wk5/ddb-model.png)
  ![ddb model](assets/wk5/ddb-rows.png)

## Other

- Added `bin/rds-start-instance` and `bin/rds-stop-instance` to backend project to help with managing RDS
