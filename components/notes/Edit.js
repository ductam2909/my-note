import React, { useEffect, useState } from 'react'
import { Row, Col, Modal, Space } from 'antd'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ReactLoading from 'react-loading'
import { toast } from 'react-toastify'
const host = 'http://localhost:8080'

export default function Edit (props) {
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState()
  const [display, setDisplay] = useState()
  const [notes, setNotes] = useState({
    title: '',
    description: ''
  })
  const closeForm = () => {
    props.Callback(true)
  }

  const getNotes = () => {
    axios.get(`${host}/demo_01/notes/${props?.ids}`)
      .then((res) => {
        console.log('Vào đây ', res?.data)
        setNotes(res?.data)
        setImage(res?.data?.image)
      })
      .catch()
  }

  const [image, setImage] = useState()

  const updateNote = () => {
    axios.patch(`${host}/demo_01/notes/${props?.ids}`, {
      ...notes,
      image
    }).then((res) => {
      getNotes()
      toast.success('Cập nhật thành công')
      closeForm()
    }).catch((res) => {
      console.log(res)
    })
  }

  const updateColor = (color) => {
    console.log('color', color)
    axios.patch(`${host}/demo_01/notes/${props?.ids}`, {
      color
    }).then((res) => {
      getNotes()
      toast.success('Cập nhật màu thành công')
    }).catch((res) => {
      console.log(res)
    })
  }

  const UploadImage = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'note-img')
    setLoading(true)
    axios.post('https://api.cloudinary.com/v1_1/duwafqtaz/image/upload/', data)
      .then((response) => {
        setImage(response.data.secure_url)
      })
      .catch((error) => {
        toast.error(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getNotes()
  }, [])

  return (
    <Row>
      <Col span={12}>
        <Modal open onCancel={closeForm} okText='Lưu' cancelText='Thoát' className='editNote' footer=''>
          <div className='note-add' style={{ background: notes?.color }}>
            <div className={loading ? 'new-loading' : ''}>
              {loading && <ReactLoading type='spinningBubbles' color='#04AA6D' />}
            </div>
            <div className='new-img'>
              {image && <img src={image} alt='image' style={{ width: '100%' }} />}
              <Icon icon='ic:baseline-delete' color='#ccc' width={30} className='new-delete' onClick={() => setImage('')} />
            </div>
            <input
              placeholder='Tiêu đề'
              name='title'
              style={{ background: notes?.color }}
              value={notes?.title}
              onChange={event => setNotes((prev) => ({ ...prev, [event.target.name]: event.target.value }))}
            />
            <textarea
              placeholder='Nhập nội dung'
              name='description'
              style={{ background: notes?.color }}
              value={notes?.description}
              onChange={event => setNotes((prev) => ({ ...prev, [event.target.name]: event.target.value }))}
            />
          </div>
          <div className='note-acction' style={{ background: notes?.color }}>
            <Space>
              <div className='note-acction-info centered'>
                <Icon icon='ic:outline-notification-add' color='#5f6368' width='20' />
                <p>Nhắc tôi</p>
              </div>
              <div className='note-acction-info centered' onClick={() => { setDisplay(current => !current) }}>
                <Icon icon='ic:outline-color-lens' color='#5f6368' width='20' />
                <p>Chọn màu</p>
              </div>
              <label>
                <div className='note-acction-info centered'>
                  <input type='file' onChange={UploadImage} />
                  <Icon icon='ic:outline-image' color='#5f6368' width='20' />
                  <p>Hình ảnh</p>
                </div>
              </label>
            </Space>
            <div className={display ? 'show' : 'hide'}>
              <div className='acction-color' style={{ margin: '-100px 0 0 -250px' }}>
                <div className='acction-color-item' style={{ background: '#ffff' }} onClick={() => { updateColor('#ffff') }} />
                <div className='acction-color-item' style={{ background: '#F28B82' }} onClick={() => { updateColor('#F28B82') }} />
                <div className='acction-color-item' style={{ background: '#FFF475' }} onClick={() => { updateColor('#FFF475') }} />
                <div className='acction-color-item' style={{ background: '#FFF475' }} onClick={() => { updateColor('#FFF475') }} />
                <div className='acction-color-item' style={{ background: '#AECBFA' }} onClick={() => { updateColor('#AECBFA') }} />
                <div className='acction-color-item' style={{ background: '#D7AEFB' }} onClick={() => { updateColor('#D7AEFB') }} />
              </div>
            </div>
            <div>
              <button onClick={updateNote} style={{ background: notes?.color }}>Lưu</button>
              <button onClick={closeForm} style={{ background: notes?.color }}>Đóng</button>
            </div>
          </div>
        </Modal>
      </Col>
    </Row>

  )
}
