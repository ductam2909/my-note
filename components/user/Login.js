import { Button, Checkbox, Form, Input } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import { toast } from 'react-toastify'

const url = 'http://localhost:8080/demo_01/user/'
const cookies = new Cookies()

export default function Login () {
  const route = useRouter()
  const onFinish = (values) => {
    axios.get(url).then((res) => {
      console.log(res?.data?._embedded)
      res?.data?._embedded.map((s) => {
        if (values?.username === s?.username && values?.password === s?.password) {
          toast.success('đăng nhập thành công')
          cookies.set('tokenUser', s._id?.$oid, { path: '/' })
          route.push('/')
        }
        // if (values?.username === s?.username && values?.password !== s?.password) {
        //   alert('sai mk')
        // }
      })
    }
    ).catch((res) => {
      console.log(res?.Success)
    })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className='login'>
      <div className='login-form'>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <Form
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <p>Email</p>
          <Form.Item
            name='username'
            rules={[
              {
                required: true,
                message: 'Nhập tên đăng nhâp!'
              }
            ]}
          >
            <Input type='email' placeholder='nhập email' style={{ width: '100%' }} className='login-input' />
          </Form.Item>
          <p>Password</p>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Nhập mật khẩu!'
              }
            ]}
          >
            <Input type='password' className='login-input' placeholder='nhập mật khẩu' />
          </Form.Item>

          <Form.Item
            style={{ marginTop: '10px' }}
          >
            <Button className='login-btnsubmit' type='primary' htmlType='submit'>
              Đăng nhập
            </Button>
          </Form.Item>
          <p>Chưa có tài khoản?<span className='login-form-link' onClick={() => route.push('/registration')}> Đăng kí</span></p>
        </Form>
      </div>
    </div>
  )
}
