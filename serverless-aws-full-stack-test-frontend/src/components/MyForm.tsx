import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState } from "react";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { RunInstancesCommand } from "@aws-sdk/client-ec2";
import { ecClient } from "@/lib/client";

const client = new S3Client({
  region:import.meta.env.VITE_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: import.meta.env.VITE_REGION },
    identityPoolId: import.meta.env.VITE_IDENTITYPOOLID
  })
})

export function MyForm() {
  const [inputText, setInputText] = useState("")
  const [inputFile, setInputFile] = useState()

  const handleChange = (e: any) => {
    setInputText(e.target.value)
  }
  const handleFileChange = (e: any) => {
    setInputFile(e.target.files[0])
  }

  const uploadFile = async (file:any ) => {

    const command = new PutObjectCommand({
      Bucket: import.meta.env.VITE_BUCKET,
      Key: file.name, 
      Body: file
    }) 

    try {
      const response = await client.send(command)
    } catch (err) {
      console.error(err)
    }

    // Create a new EC2 instance.
    const commandEC2 = new RunInstancesCommand({
     // Your key pair name.
     KeyName: "KEY_PAIR_NAME",
     // Your security group.
     SecurityGroupIds: ["SECURITY_GROUP_ID"],
     // An x86_64 compatible image.
     ImageId: "ami-0001a0d1a04bfcc30",
     // An x86_64 compatible free-tier instance type.
     InstanceType: "t1.micro",
     // Ensure only 1 instance launches.
     MinCount: 1,
     MaxCount: 1,
   });
 
   try {
     const response = await ecClient.send(commandEC2);
    //  console.log(response);
   } catch (err) {
     console.error(err);
   }

  }

  const handleSubmit = async (event:any) => {
    event.preventDefault(); 
      try {
          axios.post(import.meta.env.VITE_URL+"/create", {
            "inputText":inputText,
            "inputFile":inputFile.name
          })
          .then(async function (response) {        
            if(response.status==200){
              //upload to s3
              uploadFile(inputFile)
            }
          })
          .catch(function (error) {
            console.log(error) 
          })
      } catch (e) {
        alert(e)
      }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">jeff</CardTitle>
        <CardDescription>A project for coding test.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="inputText">inputText</Label>
            <Input
             id="inputText"
              type="inputText"
              placeholder="inputText"
              required
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="inputFile">inputFile</Label>
            <Input
              id="inputFile"
              type="file"
              name="file"
              accept=".txt"
              required
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
