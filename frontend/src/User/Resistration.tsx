import React, { type ReactElement } from 'react'
import { Form, Button, Image as Img } from 'react-bootstrap'
import axios from 'axios'
import { useState } from 'react'

type Setter<T> = React.Dispatch<React.SetStateAction<T>>

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

async function createUser(data: createUser): Promise<any> {
  const res = await axios.post('/user', data)
  return res
}

async function resizeAndEncode(file: File): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    const img: HTMLImageElement = new Image()
    const reader = new FileReader()
    reader.onload = () => {
      img.src = reader.result as string
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)

    img.onload = () => {
      const width = img.width
      const height = img.height

      let canvasWidth, canvasHeight, startX, startY

      if (width > height) {
        canvasWidth = height
        canvasHeight = height
        startX = (width - height) / 2
        startY = 0
      } else {
        canvasWidth = width
        canvasHeight = width
        startX = 0
        startY = (height - width) / 2
      }

      const canvas = document.createElement('canvas')
      canvas.width = canvasWidth
      canvas.height = canvasHeight
      const context = canvas.getContext('2d')
      context?.drawImage(
        img,
        startX,
        startY,
        canvasWidth,
        canvasHeight,
        0,
        0,
        canvasWidth,
        canvasHeight
      )

      const resizedImageData = canvas.toDataURL('image/jpeg')
      resolve(resizedImageData)
    }

    img.onerror = (error: any) => {
      reject(error)
    }
  })
}

export function Resistration(props: {
  user: User
  setUser: Setter<User>
  setLoggedIn: Setter<boolean>
}): ReactElement {
  let userName = ''
  let password = ''
  const [image, setImage] = useState<string>('')
  return (
    <div>
      <Form.Control
        placeholder="UserName"
        onChange={(e) => {
          userName = e.target.value
        }}
      />
      <Form.Control
        placeholder="Password"
        type="password"
        onChange={(e) => {
          password = e.target.value
        }}
      />
      <Form.Control
        type="file"
        onChange={(e) => {
          const file = (e.target as HTMLInputElement).files?.[0] as File
          resizeAndEncode(file)
            .then((res) => {
              setImage(res)
            })
            .catch((err) => {
              console.error(err)
            })
        }}
      />
      <Img src={image} style={{ borderRadius: '50%' }} height={300} />
      <br />
      <Button
        onClick={() => {
          createUser({ name: userName, password })
            .then((res) => {
              props.setUser({ id: Number(res.data.id), name: userName })
            })
            .catch(() => {
              /**/
            })
          props.setLoggedIn(true)
        }}
      >
        Submit
      </Button>
    </div>
  )
}
