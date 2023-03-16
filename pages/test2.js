import axios from 'axios'
import { post } from 'jquery'
import { useRouter } from 'next/router'
import React, { use } from 'react'
import { useEffect, useState } from 'react'
const host = 'http://localhost:8080'
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify'  

export default function test2() {
  const [user,setUser] = useState();
  const route = useRouter()
  const { register, handleSubmit } = useForm();
  const onSubmit = data => {
    const s = user?.filter((item)=>item?.email===data?.email)
    if(s.length===0){
      axios.post(`${host}/demo_01/user`,{
        'username':data?.username,
        'email':data?.email,
        'password':data?.password
      })
      .then(() => {
        route.push('/login')
        toast.success('Đăng ký tài khoản thành công')
      }
      ).catch((res) => {
        console.log(res)
      })
    }
    else {
      toast.warning("Tài khoản đã tồn tại")
    }
  }

  const getUser = () => {
    axios.get(`${host}/demo_01/user`).
    then((res)=>{
      console.log(res?.data?._embedded);
      setUser(res?.data?._embedded)
    })
  }

  useEffect(()=>{
    getUser()
  },[])

  console.log(user)
  const post =()=> {
    if(email?.length>0) {
      const s = user?.filter((item)=>item?.email===email)
      console.log('ss',s)
      if(s.length===0){
        alert("Thành công")
      }
      else alert("Đã có tài khoản")
    }
  }

  return (
        <div className='test'>
          <form className='test-form' onSubmit={handleSubmit(onSubmit)}>
            <h3 className="text-center">Đăng kí tài khoản</h3>
            <p>Tên tài khoản</p>
            <input type="text"
            maxLength={15} 
            minLength={4}
            {...register("username")}
            // pattern="^[a-zA-Z0-9_.-]*$" 
            placeholder="Tên tài khoản" required 
            />
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
            className='test-form-submit'
            >Tạo tài khoản</button>
            <p>Đã có tài khoản<span onClick={()=>route.push('/login')}>Đăng nhập</span></p>
          </form>
        </div>
  )
}
