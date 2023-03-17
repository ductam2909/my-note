import axios from 'axios'
import { post } from 'jquery'
import { useRouter } from 'next/router'
import React, { use } from 'react'
import { useEffect, useState } from 'react'
// const host = 'http://localhost:8080'
const host ='https://6414110850dff8e8fe442305.mockapi.io'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify'  
import Cookies from 'universal-cookie'

export default function Login() {
  const cookies = new Cookies()
  const [user,setUser] = useState();
  const route = useRouter()
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    const s = user?.filter((item)=>item?.email===data?.email)
    if(s.length===0){
      toast.warning("Tài khoản Không tồn tại")
    }
    else {
    s.map((s)=>{
     if(data?.password===s?.password) {
      cookies.set('tokenUser', s?.id, { path: '/' })
      route.push('/')
      toast.success('Đăng nhập thành công')
     }
     else toast.error('sai mật khẩu')
    })
    }
  }

  const getUser = () => {
    axios.get(`${host}/user`).
    then((res)=>{
      setUser(res?.data)
    })
  }

  useEffect(()=>{
    getUser()
  },[])

  return (
        <div className='login'>
          <form className='login-form' onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-center">Đăng Nhập</h3>
            <p>Email </p>
            <input type="email" 
            placeholder="Email"
            {...register("email")}
            required 
            />
            <p>Mật khẩu</p>
            <input type="password" 
            minLength={6} 
            placeholder="Mật khẩu"
            {...register("password")}
            required 
            />
            <button type="submit" 
            className='login-form-submit'
            >Đăng nhập</button>
            <p>Chưa có tài khoản<span onClick={()=>route.push('/registration')}>Đăng ký</span></p>
          </form>
        </div>
  )
}
