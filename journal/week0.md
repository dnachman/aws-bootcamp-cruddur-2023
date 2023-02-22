# Week 0 — Billing and Architecture

Reviewed videos:

-   Livestream
-   setting up accounts
-   security focus video
-   billing video

Account setup:

-   Created a new AWS account for the class in Organizations (I have a long-standing account) ![Org](assets/wk0/organization.png)
-   Create account, root user has MFA, create general user and enable MFA , generate keys ![iam user](assets/wk0/iam-user.png)
-   Set up AWS Identity Center (SSO) as there are now a bunch of accounts and users and it's easier to manage (?) ![sso-user](assets/wk0/sso-users.png)
-   Set up billing alarms in billing console + cloudwatch alarm to SNS (previously done on root org, updated)
    -   Budget ![budget](assets/wk0/budgets.png)
    -   Billing alarms ![billing-alarm](assets/wk0/billing-alarms.png)
    -   Cloudwatch Action ![cw-alarm-action](assets/wk0/cw-alarm-action.png)
    -   SNS topic settings ![sns-topic](assets/wk0/sns-topic.png)
-   set up projects in github, gitpod, configuration

Tasks

-   Well architected workload document started
-   lucid charts
    -   Conceptual Diagram
        ![Conceptual Diagram](/journal/assets/wk0/cruddur-conceptual.png "Conceptual Diagram")
    -   Logical Diagram
        ![Logical Diagram](/journal/assets/wk0/cruddur-logical.png "Logical Diagram")
    -   Link to [Lucid Chart](https://lucid.app/lucidchart/e7536e2c-acd1-41cc-a050-12bacdb5e290/edit?viewport_loc=-191%2C109%2C1751%2C1068%2CPBoy0-Y~AgzU&invitationId=inv_fa03a8c9-582c-47b6-95d7-73640706c63b)
