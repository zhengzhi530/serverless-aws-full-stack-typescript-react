import type { AWS } from '@serverless/typescript';
import create from '@functions/create';
import list from '@functions/list';
import get from '@functions/get';

const serverlessConfiguration: AWS = {
  service: 'serverless-aws-full-stack-test-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ],
        Resource: [
          'arn:aws:dynamodb:${env:AWS_DB_REGION}:${env:AWS_ACCOUNT_ID}:table/${env:TABLE_NAME}',
          'arn:aws:s3:::${BUCKET_NAME}/*']
      }
    ]
  },
  // import the function via paths
  functions: { create, list, get },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      Table: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "${env:TABLE_NAME}",
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S"
            }
          ],
          BillingMode: "PAY_PER_REQUEST",
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH"
            }
          ],
          StreamSpecification: {
            StreamViewType: "NEW_AND_OLD_IMAGES"
          }
        }
      },
      AttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${env:BUCKET_NAME}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: [
                  "*"
                ],
                AllowedHeaders: [
                  "*"
                ],
                AllowedMethods: [
                  "GET",
                  "PUT",
                  "POST",
                  "DELETE",
                  "HEAD"
                ],
                MaxAge: 3000
              }
            ]
          }
        }
      }
    },
    Outputs: {
      AttachmentsBucketName: {
        Value: {
          Ref: "AttachmentsBucket"
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
