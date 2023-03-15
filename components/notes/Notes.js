import { Col, Row, Space, DatePicker } from 'antd'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Masonry from 'react-masonry-css'
import axios from 'axios'
import New from './New'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'
import Edit from './Edit'
import Cookies from 'universal-cookie'
import Notification from '../notifcation/Notification'

export default function Notes() {
  const cookies = new Cookies()
  const tokenUser = cookies.get('tokenUser')
  const [isModalOpen, setIsModalOpen] = useState(true)
  const [id, setId] = useState()
  const handleOk = (data) => {
    setIsModalOpen(data)
    getNotes()
  }

  const [notes, setNotes] = useState()
  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    900: 3,
    700: 2,
    500: 1
  }
  const [notefi, setNotefi] = useState()

  const getNotifi = () => {
    axios.get('http://localhost:8080/demo_01/notification')
      .then((res) => {
        setNotefi(res?.data?._embedded)
      })
      .catch()
  }


  const callNoti = (childData) => {
    setNotefi(childData)
  }

  const getNotes = () => {
    axios.get('http://localhost:8080/demo_01/notes')
      .then((res) => {
        setNotes(res?.data?._embedded)
        // if(res?.data?._embedded?.idUser===tokenUser) {alert('ok')}
        // (res?.)
      })
      .catch()
  }

  useEffect(() => {
    getNotes()
    getNotifi()
  }, [])

  const Renderaction = (props) => {
    const deleteNote = () => {
      confirmAlert({
        title: 'Xóa Ghi chú',
        message: 'Bạn có chắc chắn muốn xóa ghi chú này không?',
        buttons: [
          {
            label: 'Có',
            onClick: () => {
              axios.delete(`http://localhost:8080/demo_01/notes/${props?.id}`)
                .then(() => {
                  toast.success('Xóa thành công')
                  getNotes()
                })
                .catch()
            }
          },
          {
            label: 'Không'
          }
        ]
      })
    }



    const onChange = (value, dateString) => {
      console.log('Selected Time: ', value);
      console.log('Formatted Selected Time: ', dateString);
    };

    const onOk = (value) => {
      var s = Date.parse(value?.$d)
      axios.post('http://localhost:8080/demo_01/notification', { 'idNote': props?.id, 'time': s, 'status': "no" }).then((res) => {
        toast.success('Thêm mới thành công')
        getNotifi()
        // closeForm()
      }).catch((res) => {
        console.log(res)
      })
      // setTimes(s)
    };

    const [display, setDisplay] = useState(false)
    return (
      <div style={{ position: 'relative' }}>
        <div className='note-acction'>
          <Space>
            <div className='note-acction-info centered'>
              <label>
                <Icon icon='ic:outline-notification-add' color='#5f6368' width='20' />
                <p>Nhắc tôi</p>
                <DatePicker showTime onChange={onChange} onOk={onOk} className='datePicker' />
              </label>
            </div>
            <div className='note-acction-info centered'>
              <Icon icon='ic:outline-color-lens' color='#5f6368' width='20' />
              <p>màu sắc</p>
            </div>
            <div className='note-acction-info centered'>
              <Icon icon='ic:outline-image' color='#5f6368' width='20' />
              <p>Hình ảnh</p>
            </div>
            <div className='note-acction-info centered' onClick={() => { setDisplay(current => !current) }}>
              <Icon icon='entypo:dots-three-vertical' color='#5f6368' width='20' />
              <p>Thêm</p>
            </div>
          </Space>
          <div />
        </div>
        <div className={display ? 'show' : 'hide'}>
          <div className='acction-info'>
            <ul onClick={() => { setDisplay(false) }}>
              <li>chỉnh sửa</li>
              <li onClick={deleteNote}><p>xóa</p></li>
              <li>Tạo thông báo</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  const renderNote = () => {
    return (
      (notes || []).map((item) => {
        if (item?.idUser === tokenUser) {
          return (
            <div key={item._id?.$oid}>
              <div className='note-item'>
                <div onClick={() => { setIsModalOpen(false); setId(item._id?.$oid) }}>
                  <div className='note-item-img'>
                    <img src={item?.image} />
                  </div>
                  <div className='note-info'>
                    <p className='note-info-title'>{item?.title}</p>
                    <p>{item?.description}</p>
                  </div>
                </div>
                <Renderaction id={item?._id?.$oid} />
              </div>
            </div>
          )
        }
      })
    )
  }
  const [display, setDisplay] = useState(true)
  const callbackFunction = (childData) => {
    setDisplay(childData)
    getNotes()
  }

  return (
    <>
      <div className={display ? 'show' : 'hide'}>
        <Row justify='center'>
          <Col md={12} sm={16} xs={23} className='note-add new'>
            <div className='centered'>
              <input placeholder='Tạo ghi chú' onClick={() => setDisplay(false)} />
              <div className='note-icon'><Icon icon='material-symbols:check-box-outline' color='#5f6368' width='25' /></div>
              <div className='note-icon'><Icon icon='uil:pen' color='#5f6368' width='25' /></div>
              <div className='note-icon'><Icon icon='ic:outline-image' color='#5f6368' width='25' /></div>
            </div>
          </Col>
        </Row>
      </div>
      {!display && <New Callback={callbackFunction} token={tokenUser} />}
      <div className='content'>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className='my-masonry-grid'
          columnClassName='my-masonry-grid_column'
          data-aos='zoom-in-up'
        >
          {renderNote()}
        </Masonry>
        {!isModalOpen && <Edit Callback={handleOk} ids={id} />}
      </div>
      {/* {renderNotifi()} */}
      <Row>
        <Col className='noti' span={12}>
            <Notification noti={notefi} parentCallback={callNoti} />
        </Col>
      </Row>

    </>
  )
}
