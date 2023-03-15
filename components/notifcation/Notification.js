import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import { DatePicker, Space } from 'antd';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'antd';
import AOS from 'aos'
import { Icon } from '@iconify/react';
import New from '../notes/New';
import Edit from '../notes/Edit';


export default function Notification(props) {

  const getNotifi = () => {
    axios.get('http://localhost:8080/demo_01/notes')
      .then((res) => {
        props.parentCallback(res?.data?._embedded)
      })
      .catch()
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-sine'
    })
    renderNote()
    getNotifi()
  }, [])


  const updateStatus = (id) => {
    axios.patch(`http://localhost:8080/demo_01/notes/${id}`, { 'status': 'yes' }).then((res) => {
      toast.success('up date thành công')
      getNotifi()
    }).catch((res) => {
      console.log(res)
    })
  }

  const [id, setId] = useState()

  const [isModalOpen, setIsModalOpen] = useState(true)
  const handleOk = (data) => {
    setIsModalOpen(data)
  }


  const Completionist = (props) => {
    return <>
      <div className='notification'>
        <h4>Thông báo mới</h4>
        <div className='notification-info'>
          <p onClick={() => { setIsModalOpen(false); setId(props?.id); updateStatus(props?.id) }}>Mở ghi chú</p>
          <Icon icon="ic:sharp-close" color="white" width="30" onClick={() => { updateStatus(props?.id) }} /></div>
      </div>
    </>
  };

  const  [time,setTime] = useState();
  
  // const Chill =()=>{
  //   return<p>sss</p>
  // }
  const renderNote = (s) => {

    return (
      (props?.noti || []).map((item) => {
        const s = item?.time?.$numberLong - Date?.now()
        const renderer = ({ hours, minutes, seconds, completed }) => {
          if (completed) {
            if (item?.status === 'no') {
              return <Completionist id={item._id?.$oid} />;
            } else if (item?.status === 'yes') return <></>
          } else {
            setTime(seconds)
            return(<>
              <p>Thông báo sau:</p>
              <span>{hours}:{minutes}:{seconds}</span>
            </>);
          }
        };
        return (
          <div key={item._id?.$oid}>
            {console.log('ss', item?.time?.$numberLong - Date?.now())}
            {item?.time && <Countdown
              date={s + Date.now()}
              renderer={renderer}
            />}
          </div>
        )
      })
    )
  }

  const Test = () => {
    return <h1>ssssjjj</h1>
  }
  const s = Date.now()
  console.log(s)

  return (
    <div>
      {renderNote()}
      {!isModalOpen && <Edit Callback={handleOk} ids={id} />}
    </div>
  )
}
