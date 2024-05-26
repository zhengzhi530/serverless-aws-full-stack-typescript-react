import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

import schema from './schema'

const list: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {

  const command = new ScanCommand({
    TableName: process.env.TABLE_NAME,
  })

  const response = await docClient.send(command)

  return formatJSONResponse(response)
}

export const main = middyfy(list)
