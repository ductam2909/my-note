import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import axios from 'axios'
import { Icon } from '@iconify/react'
import Edit from '../notes/Edit'

export default function Notification (props) {
  const getNotifi = () => {
    axios.get('http://localhost:8080/demo_01/notes')
      .then((res) => {
        props.parentCallback(res?.data?._embedded)
      })
      .catch()
  }

  useEffect(() => {
    renderNote()
    getNotifi()
  }, [])

  const updateStatus = (id) => {
    axios.patch(`http://localhost:8080/demo_01/notes/${id}`, { status: 'yes' }).then((res) => {
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
    return (
      <div className='notification' key={props?.id}>
        <h4>Thông báo mới</h4>
        <div className='notification-info'>
          <p onClick={() => { setIsModalOpen(false); setId(props?.id); updateStatus(props?.id) }}>Mở ghi chú</p>
          <Icon icon='ic:sharp-close' color='white' width='30' onClick={() => { updateStatus(props?.id) }} />
        </div>
      </div>
    )
  }

   const renderNote = () => {
    return (
      
      (props?.noti || []).filter(person => person.status === 'no').map((item) => {
        const s = item?.time?.$numberLong - Date?.now()
        const renderer = ({ hours, minutes, seconds, completed }) => {
          if (completed) {
            return <Completionist id={item._id?.$oid} />
          } 
          else {
            return (
              <>
                {/* <p>Thông báo</p> */}
                <span>{hours}:{minutes}:{seconds}</span>
              </>
            )
          }
        }
        return (
          <div key={item._id?.$oid}>
            {item?.time && <Countdown
              date={s + Date.now()}
              renderer={renderer}/>
            }
          </div>
        )
      })
    )
  }

  return (
    <div>
      {renderNote()}
      {!isModalOpen && <Edit Callback={handleOk} ids={id} />}
    </div>
  )
}
