import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
import { nanoid } from "nanoid";

import schema from "./schema";

import { ec2Client } from "../../libs/client";
import { RunInstancesCommand } from "@aws-sdk/client-ec2";

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  // const url = process.env.BUCKET_NAME+"/"+event.body.inputFile
  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id: nanoid(),
      inputText: event.body.inputText,
      key: event.body.inputFile,
    },
  });
  const response = await docClient.send(command);
  // Create a new EC2 instance.
  RunInstances()
  return formatJSONResponse(response);
};

async function RunInstances() {
  const command = new RunInstancesCommand({
    // Your key pair name.
    KeyName: "jeff",
    // Your security group.
    SecurityGroupIds: ["jeff"],
    // An x86_64 compatible image.
    ImageId: "001",
    // An x86_64 compatible free-tier instance type.
    InstanceType: "t1.micro",
    // Ensure only 1 instance launches.
    MinCount: 1,
    MaxCount: 1,
  });

  try {
    const response = await ec2Client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}

export const main = middyfy(create);
