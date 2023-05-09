import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";

export const handler = async (event) => {
  const Bucket = process.env.UPLOADS_BUCKET;
  const Key = "mock.jpg";

  let response = {};

  const putObjectParams = {
    Bucket,
    Key,
  };

  console.log("event: " + JSON.stringify(event));

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
    const client = new S3Client({ region: "us-east-1" });
    const command = new PutObjectCommand(putObjectParams);
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    console.log("URL:  " + url);

    response = {
      statusCode: 200,
      body: JSON.stringify({ url }),
    };
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
