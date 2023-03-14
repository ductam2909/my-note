import React, { useEffect, useState } from 'react'
import { Row, Col, Modal, Space } from 'antd'
import { Icon } from '@iconify/react'
import axios from 'axios'
import ReactLoading from 'react-loading'
import { toast } from 'react-toastify'

export default function Edit (props) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState({
    title: '',
    description: ''
  })
  const closeForm = () => {
    props.Callback(true)
  }

  const getNotes = () => {
    axios.get(`http://localhost:8080/demo_01/notes/${props?.ids}`)
      .then((res) => {
        console.log('Vào đây ', res?.data)
        setNotes(res?.data)
        setImage(res?.data?.image)
      })
      .catch()
  }

  const [image, setImage] = useState()

  const updateNote = () => {
    axios.patch(`http://localhost:8080/demo_01/notes/${props?.ids}`, {
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
          <div className='note-add'>
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
              value={notes?.title}
              onChange={event => setNotes((prev) => ({ ...prev, [event.target.name]: event.target.value }))}
            />
            <textarea
              placeholder='Nhập nội dung'
              name='description'
              value={notes?.description}
              onChange={event => setNotes((prev) => ({ ...prev, [event.target.name]: event.target.value }))}
            />
          </div>
          <div className='note-acction'>
            <Space>
              <div className='note-acction-info centered'>
                <Icon icon='ic:outline-notification-add' color='#5f6368' width='20' />
                <p>Nhắc tôi</p>
              </div>
              <div className='note-acction-info centered'>
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
            <div>
              <button onClick={updateNote}>Lưu</button>
              <button onClick={closeForm}>Đóng</button>
            </div>
          </div>
        </Modal>
      </Col>
    </Row>

  )
}
