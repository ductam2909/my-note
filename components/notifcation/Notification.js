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
    axios.get('http://localhost:8080/demo_01/notification')
      .then((res) => {
        // setNotes(res?.data?._embedded)
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
    axios.put(`http://localhost:8080/demo_01/notification/${id}`, { 'status': 'yes' }).then((res) => {
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
        {/* <div className='notification-item'> */}
        <h4>Thông báo mới</h4>
        <div className='notification-info'>
          <p onClick={() => { setIsModalOpen(false); setId(props?.idNote); updateStatus(props?.id) }}>Mở ghi chú</p>
          <Icon icon="ic:sharp-close" color="white" width="30" onClick={() => { updateStatus(props?.id) }} /></div>
      </div>
      {/* </div> */}
    </>
  };

  const renderNote = () => {

    return (
      (props?.noti || []).map((item) => {
        const s = item?.time?.$numberLong - Date?.now()
        const renderer = ({ hours, minutes, seconds, completed }) => {
          if (completed) {
            if (item?.status === 'no') {
              return <Completionist id={item._id?.$oid} idNote={item?.idNote} />;
            } else if (item?.status === 'yes') return <></>
          } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
          }
        };
        return (
          <div key={item._id?.$oid}>
            {console.log('ss', item?.time?.$numberLong - Date?.now())}
            {item?.time && <Countdown
              date={s + Date.now()}
              renderer={renderer}
            // renderer={props => <div>sss{props.total}sss {item?._id?.$oid}</div>}
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
      <input id="appt-time" type="time" name="appt-time" value="13:30" onChange={ev => setTime(ev.target.value)} />
      {renderNote()}
      <button onClick={() => toast.success('sss')}>tes</button>
      {!isModalOpen && <Edit Callback={handleOk} ids={id} />}
    </div>
  )
}
