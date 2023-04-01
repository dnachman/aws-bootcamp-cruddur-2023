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
- Complete the `MessageForm.js` compoonent and `message_groups.py` and sql to allow posting of messages to a conversation:
  ![post message](assets/wk5/post-message-working.png)
- Complete the journey to create new messages with `MessageGroupNewItem.js`, `MessageGroupNewPage.js` and changes in the backend to support it:
  ![new message working](assets/wk5/new-messages-working.png)

- This is an image of the DynamoDb modeling and a row representation from the class:
  ![ddb model](assets/wk5/ddb-model.png)
  ![ddb model](assets/wk5/ddb-rows.png)

## Dynamodb Streams

- Update `schema-load` script to add Global Secondary index for `message_group_uuid`
- Create the production table and turn on DDB streams to capture 'new image' attributes
- Create a VPC endpoint for dynamodb
- Create a lambda to handle the DDB stream
  - Connect it to the VPC
  - Create a role that allows update to ddb & attach `AWSLambdaInvocation-DynamoDB` policy
  - Create an inline policy for ddb update scoped to our table:
    ```
      {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "VisualEditor0",
                "Effect": "Allow",
                "Action": [
                    "dynamodb:PutItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Scan",
                    "dynamodb:Query"
                ],
                "Resource": [
                    "arn:aws:dynamodb:us-east-1:XXXX:table/cruddur-messages/index/message-group-sk-index",
                    "arn:aws:dynamodb:us-east-1:XXXX:table/cruddur-messages"
                ]
            }
        ]
    }
    ```
- Create trigger in ddb to send to the lambda
- Testing it we can see the messages are making it into the ddb and updated:
  ![messages](assets/wk5/messages-after-streams.png)
  ![dynamo records](assets/wk5/ddb-records.png)

## Other

- Added `bin/rds-start-instance` and `bin/rds-stop-instance` to backend project to help with managing RDS
