import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

import schema from './schema'

const get: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.id
  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {id}
  })

  const response = await docClient.send(command)

  return formatJSONResponse(response)
}

export const main = middyfy(get)
