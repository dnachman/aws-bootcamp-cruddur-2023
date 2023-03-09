# Week 3 — Decentralized Authentication

## Set up Cognito

- Create user pool `cruddur-user-pool`
  ![cruddur-user-pool](assets/wk3/cognito-user-pool.png)
- added the `aws-amplify` package to frontend
- initialized amplify
- set up docker-compose environment variables
- Verified flows and activation codes, etc:

  - Confirm activation code after signup:
    ![activation code](assets/wk3/activation-code.png)
  - Resending activation codes:
    ![resend code](assets/wk3/resend-activation.png)
  - Received codes in email:
    ![verifcation codes](assets/wk3/verification-codes.png)
  - Password recovery:
    ![password recovery](assets/wk3/recover-password.png)
  - Recovery confirmation (original):
    ![password original](assets/wk3/recover-original.png)
  - **BONUS** Restyled the password recovery confirmation using css:

  ```
  article.recover-article p {
      text-align: center;
      color: #fff;
  }

  article.recover-article a.proceed {
      color: rgba(149,0,255,1);
      text-decoration: none;
      font-weight: 600;
  }
  ```

  ![password restyle](assets/wk3/recover-restyle.png)

## Backend JWT validation
