import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3n from "aws-cdk-lib/aws-s3-notifications";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as dotenv from "dotenv";

dotenv.config();

export class ThumbingServerlessCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // const uploadsBucketName: string = process.env.UPLOADS_BUCKET_NAME as string;
    const assetsBucketName: string = process.env.ASSETS_BUCKET_NAME as string;
    const folderInput: string = process.env.THUMBING_S3_FOLDER_INPUT as string;
    const folderOutput: string = process.env
      .THUMBING_S3_FOLDER_OUTPUT as string;
    const webhookUrl: string = process.env.THUMBING_WEBHOOK_URL as string;
    const topicName: string = process.env.THUMBING_TOPIC_NAME as string;
    const functionPath: string = process.env.THUMBING_FUNCTION_PATH as string;
    // console.log("uploadsBucketName");
    console.log("assetsBucketName", assetsBucketName);
    console.log("folderInput", folderInput);
    console.log("folderOutput", folderOutput);
    console.log("webhookUrl", webhookUrl);
    console.log("topicName", topicName);
    console.log("functionPath", functionPath);

    // const uploadsBucket = this.createBucket(uploadsBucketName);
    const assetsBucket = this.importBucket(assetsBucketName);
    const myLambda = this.createLambda(
      functionPath,
      assetsBucketName,
      folderInput,
      folderOutput
    );

    assetsBucket.grantRead(myLambda);
    assetsBucket.grantPut(myLambda);

    this.createS3NotifyToLambda(folderInput, myLambda, assetsBucket);
  }

  createBucket(bucketName: string): s3.IBucket {
    const bucket = new s3.Bucket(this, "ThumbingBucket", {
      bucketName: bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    return bucket;
  }

  importBucket(bucketName: string): s3.IBucket {
    const bucket = s3.Bucket.fromBucketName(this, "AssetsBucket", bucketName);
    return bucket;
  }

  createLambda(
    functionPath: string,
    // uploadsBucketName: string,
    assetsBucketName: string,
    folderInput: string,
    folderOutput: string
  ): lambda.IFunction {
    const lambdaFunction = new lambda.Function(this, "ThumbLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(functionPath),
      environment: {
        DEST_BUCKET_NAME: assetsBucketName,
        FOLDER_INPUT: folderInput,
        FOLDER_OUTPUT: folderOutput,
        PROCESS_WIDTH: "512",
        PROCESS_HEIGHT: "512",
      },
    });
    return lambdaFunction;
  }

  createS3NotifyToLambda(
    prefix: string,
    lambda: lambda.IFunction,
    bucket: s3.IBucket
  ): void {
    const destination = new s3n.LambdaDestination(lambda);
    bucket.addEventNotification(s3.EventType.OBJECT_CREATED_PUT, destination);
  }
}
