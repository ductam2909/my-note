import React, { useState } from 'react'
import { Col, Row, Space } from 'antd'
import { Icon } from '@iconify/react'
import $ from 'jquery'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import ReactLoading from 'react-loading'
// const host = 'http://localhost:8080'
const host ='https://6414110850dff8e8fe442305.mockapi.io'

export default function New (props) {
  $(document).on('input', 'textarea', function () {
    $(this).outerHeight(38).outerHeight(this.scrollHeight) // 38 or '1em' -min-height
  })
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()
  const closeForm = () => {
    props.Callback(true)
  }
  const [image, setImage] = useState()
  const [idUser, setidUser] = useState(props?.token)
  const onSubmit = data => {
    const obj = Object.assign({}, data, { image }, { idUser })
    axios.post(`${host}/notes`, obj).then((res) => {
      toast.success('Thêm mới thành công')
      closeForm()
    }).catch((res) => {
      console.log(res)
    })
  }

  const UploadImage = async e => {
    setImage()
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

  return (
    <div className={props.status ? 'hide' : 'none'}>
      <Row justify='center'>
        <Col md={12} sm={16} xs={23}>
          <form onSubmit={handleSubmit(onSubmit)} className='new'>
            <div className='note-add'>
              <div className={loading ? 'new-loading' : ''}>
                {loading && <ReactLoading type='spinningBubbles' color='#04AA6D' />}
              </div>
              <div className='new-img'>
                {image && <img src={image} alt='image' style={{ width: '100%' }} />}
                <Icon icon='ic:baseline-delete' color='#ccc' width={30} className='new-delete' onClick={() => setImage()} />
              </div>
              <input placeholder='Tiêu đề' {...register('title')} />
              <textarea placeholder='Nhập nội dung' {...register('description')} />
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
                <button type='submit'>Lưu</button>
                <button onClick={closeForm}>Đóng</button>
              </div>
            </div>
          </form>
        </Col>
      </Row>
    </div>
  )
}
