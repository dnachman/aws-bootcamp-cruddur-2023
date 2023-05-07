import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

export const handler = async (event) => {
  const Bucket = "cruddur-uploaded-avatars-n5n";
  const Key = "mock-test";

  let response = {};

  if (event.routeKey === "OPTIONS /{proxy+}") {
    response = {
      statusCode: 200,
      body: JSON.stringify("Hello from Lambda!"),
    };
  } else {
    const client = new S3Client({ region: "us-east-1" });
    const { url, fields } = await createPresignedPost(client, {
      Bucket,
      Key,
    });
    const message = "URL:  " + url + " Fields: " + JSON.stringify(fields);

    response = {
      statusCode: 200,
      body: message,
    };
  }

  return response;
};
