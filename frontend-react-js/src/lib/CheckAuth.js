import { Auth } from "aws-amplify";

export async function getAccessToken() {
  Auth.currentSession()
    .then((cognitorUserSession) => {
      const accessToken = cognitorUserSession.accessToken.jwtToken;
      localStorage.setItem("access_token", accessToken);
    })
    .catch((err) => console.log(err));
}

export async function checkAuth(setUser) {
  Auth.currentAuthenticatedUser({
    // Optional, By default is false.
    // If set to true, this call will send a
    // request to Cognito to get the latest user data
    bypassCache: false,
  })
    .then((cognitoUser) => {
      console.log("cognitoUser", cognitoUser);
      setUser({
        display_name: cognitoUser.attributes.name,
        handle: cognitoUser.attributes.preferred_username,
        sub: cognitoUser.attributes.sub,
        email: cognitoUser.attributes.email,
      });
      return Auth.currentSession();
    })
    .then((cognitorUserSession) => {
      console.log("cognitoUserSession", cognitorUserSession);
      localStorage.setItem(
        "access_token",
        cognitorUserSession.accessToken.jwtToken
      );
    })
    .catch((err) => console.log(err));
}
