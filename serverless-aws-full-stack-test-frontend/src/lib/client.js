// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// snippet-start:[ec2.JavaScript.createclientv3]
import { EC2Client } from "@aws-sdk/client-ec2";

export const ecClient = new EC2Client({ region: import.meta.env.VITE_REGION });
// snippet-end:[ec2.JavaScript.createclientv3]