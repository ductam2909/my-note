import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import { DatePicker, Space } from 'antd';
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { Button, Modal } from 'antd';
import AOS from 'aos'
import { Icon } from '@iconify/react';


export default function Notification() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [times, setTimes] = useState()
  const [notes, setNotes] = useState()
  const onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  const getNotes = () => {
    axios.get('http://localhost:8080/demo_01/notification')
      .then((res) => {
        setNotes(res?.data?._embedded)
      })
      .catch()
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-sine'
    })
    getNotes()
  }, [])

  const updateStatus = (id) => {
    axios.put(`http://localhost:8080/demo_01/notification/${id}`, { 'status': 'yes' }).then((res) => {
      toast.success('up date thành công')
      getNotes()
      // closeForm()
    }).catch((res) => {
      console.log(res)
    })
  }
  
  const Completionist = (props) => {
    return<>
      <div className='notification'>
        {/* <div className='notification-item'> */}
        <h4>Thông báo mới</h4>
        <div className='notification-info'>
        <p>Mở ghi chú</p>
        <Icon icon="ic:sharp-close" color="white" width="30" onClick={()=>{updateStatus(props?.id)}}/></div>
        </div>
      {/* </div> */}
    </>
  };

  const renderNote = () => {
    
    return (
      (notes || []).map((item) => {
        const s = item?.time?.$numberLong - Date?.now()
        const renderer = ({ hours, minutes, seconds, completed }) => {
          if (completed) {
            if (item?.status === 'no') {
              return <Completionist id = {item._id?.$oid}/>;
            } else if (item?.status === 'yes') return <></>
          } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
          }
        };
        return (
          <div key={item._id?.$oid} data-aos="flip-left">
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


  const onOk = (value) => {
    var s = Date.parse(value?.$d)
    axios.post('http://localhost:8080/demo_01/notification', { 'time': s, 'status': "no" }).then((res) => {
      toast.success('Thêm mới thành công')
      getNotes()
      // closeForm()
    }).catch((res) => {
      console.log(res)
    })
    setTimes(s)
  };

  const s = Date.now()
  console.log(s)
  return (
    <div>
      <input id="appt-time" type="time" name="appt-time" value="13:30" onChange={ev => setTime(ev.target.value)} />
      {/* {times && <Countdown
        date={Date.now() + times}
        renderer={renderer}
      />} */}
      {renderNote()}
      <p>dd{times}</p>
      <Space direction="vertical" size={12}>
        <DatePicker showTime onChange={onChange} onOk={onOk} />
      </Space>
      <button onClick={() => toast.success('sss')}>tes</button>
    </div>
  )
}
