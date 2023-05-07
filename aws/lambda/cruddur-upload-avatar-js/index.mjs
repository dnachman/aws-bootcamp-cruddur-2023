import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

export const handler = async (event) => {
  const Bucket = process.env.UPLOADS_BUCKET;
  const Key = "mock.jpg";

  let response = {};

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
    const { url, fields } = await createPresignedPost(client, {
      Bucket,
      Key,
    });

    console.log("URL:  " + url + "\n Fields: " + JSON.stringify(fields));

    response = {
      statusCode: 200,
      body: JSON.stringify(url),
    };
  }

  // common headers
  response.headers = {
    "Access-Control-Allow-Headers": "*, Authorization",
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
  };

  console.log("response: " + JSON.stringify(response));

  return response;
};
