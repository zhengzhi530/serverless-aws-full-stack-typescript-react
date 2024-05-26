import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {useEffect, useState } from "react"
import axios from "axios"
  export function MyTable() {
    const [objects, setObjects] = useState([])

  //init List
  useEffect(() => {
    axios.post(import.meta.env.VITE_URL+"/list",{})
    .then(function (response) {
      if(response.status ==200){setObjects(response.data.Items)}
      // console.log(objects)
    })
    .catch(function (error) {
      console.log(error)
    })
  }, [])

  return (
    <Table>
    <TableHeader>
      <TableRow>
        <TableHead className=" w-50">id</TableHead>
        <TableHead>inputText</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
    {objects.map((obj) => (
      <TableRow key={obj.id}>
        <TableCell className="font-medium">{obj.id}</TableCell>
        <TableCell>{obj.inputText}</TableCell>
        </TableRow>
        ))}
    </TableBody>
  </Table>
  
  )
  }
