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
- Followed the long and winding road to implement JWT backend validation in Flask
- Hit an issue with the verification library not seeing the `jose` library, so added `python-jose` to my `requirements.txt` (this may have been a gitpod workspace issue, will investigate next time i rebuild the workspace)
- Got it working and can see the claims:
  ![claims](assets/wk3/claims.png)
- Showing the authenticated user the extra post in home from Lore:
  ![auth extra](assets/wk3/home-auth-extra-post.png)
- Once logged out, the non-authenticated user sees the normal home list:
  ![no extra](assets/wk3/home-no-extra.png)