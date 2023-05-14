import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export const handler = async (event, context) => {
  let response = {};

  console.log("event: " + JSON.stringify(event));
  console.log("context: " + JSON.stringify(context));

  if (event.routeKey === "OPTIONS /{proxy+}") {
    response = {
      statusCode: 200,
      body: JSON.stringify({
        step: "preflight",
        message: "preflight CORS check",
      }),
    };
    console.log("preflight CORS check:  " + JSON.stringify(response));
  } else {
    const jwtVerifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
      tokenUse: "access",
      clientId: process.env.CLIENT_ID,
    });

    const jwt = event.headers.authorization;
    try {
      const payload = await jwtVerifier.verify(jwt);
      console.log("JWT payload:", payload);

      const putObjectParams = {
        Bucket: process.env.UPLOADS_BUCKET,
        Key: payload.sub + "." + JSON.parse(event.body).extension,
      };

      console.log("putObjectParams:  " + JSON.stringify(putObjectParams));

      const client = new S3Client({ region: "us-east-1" });
      const command = new PutObjectCommand(putObjectParams);
      const url = await getSignedUrl(client, command, { expiresIn: 3600 });

      console.log("URL:  " + url);

      response = {
        statusCode: 200,
        body: JSON.stringify({ url }),
      };
    } catch (err) {
      console.error("Access forbidden:", err);
      response = {
        statusCode: 401,
        body: "Invalid JWT",
      };
      return {
        isAuthorized: false,
      };
    }
  }

  // common headers
  response.headers = {
    "Access-Control-Allow-Headers": "*, Authorization",
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN, // change this to reflect the origin we received (maybe check allow-list?)
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  console.log("response: " + JSON.stringify(response));

  return response;
};
