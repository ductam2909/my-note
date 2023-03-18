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
import moment from 'moment/moment'
const host = 'http://localhost:8080'
import ReactPaginate from 'react-paginate'

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
  
  const callNoti = (childData) => {
    setNotes(childData)
  }

  const getNotes = () => {
    axios.get(`${host}/demo_01/notes`)
      .then((res) => {
        setNotes(res?.data?._embedded)
      })
      .catch((res) => { console.log(res) })
  }

  useEffect(() => {
    getNotes()
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
              axios.delete(`${host}/demo_01/notes/${props?.id}`)
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

    const onOk = (value) => {
      const s = Date.parse(value?.$d)
      axios.patch(`${host}/demo_01/notes/${props?.id}`, { time: s, status: 'no' }).then((res) => {
        toast.success('Thêm mới thành công')
        getNotes()
      }).catch((res) => {
        console.log(res)
      })
    }

    const updateColor = (color) => {
      axios.patch(`${host}/demo_01/notes/${props?.id}`, {
        color
      }).then((res) => {
        getNotes()
        toast.success('Cập nhật thành công')
      }).catch((res) => {
        console.log(res)
      })
    }

    const [display, setDisplay] = useState(false)
    const [color, setColor] = useState(false)
    return (
      <div style={{ position: 'relative' }}>
        <div className='note-acction note-acction-hide'>
          <Space>
            <div className='note-acction-info centered'>
              <label>
                <Icon icon='ic:outline-notification-add' color='#5f6368' width='20' />
                <p>Nhắc tôi</p>
                <DatePicker showTime onOk={onOk} className='datePicker' />
              </label>
            </div>
            <div className='note-acction-info centered' onClick={() => { setColor(current => !current) }}>
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
        <div className={color ? 'show' : 'hide'}>
          <div className='acction-color'>
            <div className='acction-color-item' style={{ background: '#ffff' }} onClick={() => { updateColor('#ffff') }} />
            <div className='acction-color-item' style={{ background: '#F28B82' }} onClick={() => { updateColor('#F28B82') }} />
            <div className='acction-color-item' style={{ background: '#FFF475' }} onClick={() => { updateColor('#FFF475') }} />
            <div className='acction-color-item' style={{ background: '#FFF475' }} onClick={() => { updateColor('#FFF475') }} />
            <div className='acction-color-item' style={{ background: '#AECBFA' }} onClick={() => { updateColor('#AECBFA') }} />
            <div className='acction-color-item' style={{ background: '#D7AEFB' }} onClick={() => { updateColor('#D7AEFB') }} />
          </div>
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

  const [display, setDisplay] = useState(true)
  const callbackFunction = (childData) => {
    setDisplay(childData)
    getNotes()
  }

  function Items({ currentItems }) {
    return (
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className='my-masonry-grid'
        columnClassName='my-masonry-grid_column'
        data-aos='zoom-in-up'
      >
        {currentItems &&
          currentItems.map((item) => {
            if (item?.idUser === tokenUser) {
              const now = moment(parseInt(item?.time?.$numberLong)).format('L LT')
              const RenderTime = () => {
                if (item?.status == 'yes') {
                  return (
                    <div className='clock'>
                      <Icon icon='ic:round-access-time' color='#afafaf' width='20' />
                      <p style={{ textDecoration: 'line-through' }}>{now}</p>
                    </div>
                  )
                } else if (item?.status == 'no') {
                  return (
                    <div className='clock'>
                      <Icon icon='ic:round-access-time' color='#afafaf' width='20' />
                      <p>{now}</p>
                    </div>
                  )
                } else return <></>
              }
              return (
                <div key={item._id?.$oid}>
                  <div className='note-item' style={{ background: item?.color }}>
                    <div onClick={() => { setIsModalOpen(false); setId(item._id?.$oid) }}>
                      <div className='note-item-img'>
                        <img src={item?.image} />
                      </div>
                      <div className='note-info'>
                        <p className='note-info-title'>{item?.title}</p>
                        <p>{item?.description}</p>
                      </div>
                      <RenderTime />
                    </div>
                    <Renderaction id={item?._id?.$oid} />
                  </div>
                </div>
              )
            }
          })}
      </Masonry>
    )
  }

  function PaginatedItems({ itemsPerPage }) {
    const [itemOffset, setItemOffset] = useState(0)
    const endOffset = itemOffset + itemsPerPage
    const currentItems = notes?.slice(itemOffset, endOffset)
    const pageCount = Math.ceil(notes?.length / itemsPerPage)

    const handlePageClick = (event) => {
      const newOffset = (event.selected * itemsPerPage) % notes?.length
      setItemOffset(newOffset)
    }
    return (
      <>
        <div className='tour__container'>
          <Items currentItems={currentItems} />
        </div>
        <ReactPaginate
          breakLabel='...'
          className='paginate--custom'
          nextLabel='>'
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel='<'
          renderOnZeroPageCount={null}
        />

      </>
    )
  }

  return (
    <div className='note-container'>
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
        <PaginatedItems itemsPerPage={10} />
        {!isModalOpen && <Edit Callback={handleOk} ids={id} />}
      </div>
      <Row>
        <Col className='noti' span={12}>
          <Notification noti={notes} parentCallback={callNoti} />
        </Col>
      </Row>
    </div>
  )
}
