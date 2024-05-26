import { Button } from "@/components/ui/button";
import {
  Card
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import axios from "axios";

const client = new S3Client({
  region: import.meta.env.VITE_REGION,
  credentials: fromCognitoIdentityPool({
    clientConfig: { region: import.meta.env.VITE_REGION },
    identityPoolId: import.meta.env.VITE_IDENTITYPOOLID
  })
})

export function MyDownload() {
  const [inputText, setInputText] = useState("")
  const [id, setId] = useState("")
  const [key, setKey] = useState("")

  const handleChange = (e: any) => {
    setId(e.target.value)
  }
  const handleDownload = async (event: any) => {
    event.preventDefault()
    const command = new GetObjectCommand({
      Bucket: import.meta.env.VITE_BUCKET,
      Key: key
    })
    try {
      const response = await client.send(command)
      let str = await response.Body.transformToString()
      str += ":" + inputText
      // console.log(str)

      //download
      const element = document.createElement('a')
      const file = new Blob([str], { type: 'text/plain' })
      element.href = URL.createObjectURL(file);
      element.download = key ?? 'demo'
      document.body.appendChild(element)
      element.click()

    } catch (err) {
      console.error(err)
    }
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    //查询数据库获取key
    if (id) {
      try {
        axios.get(import.meta.env.VITE_URL + "/get/" + id)
          .then(async function (response) {
            if (response.data.Item?.key) {
              setKey(response.data.Item.key)
              setInputText(response.data.Item.inputText)
            } else {
              alert("not find!")
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      } catch (e) {
        alert(e)
      }
    } else (
      alert("input your ID!")
    )
  }

  return (
    <div>
      <Card className="w-full max-w-sm">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="email" placeholder="ID" onChange={handleChange} />
          <Button type="submit" onClick={handleSubmit}>query</Button>
        </div>
      </Card>
      <div>
        {key && <p>{key}<span className="pl-4 text-red-600" onClick={handleDownload}>Download</span></p>}
      </div>
    </div>
  )
}
