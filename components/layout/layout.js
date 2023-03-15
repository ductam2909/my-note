import { Col, Row, Space } from 'antd'
import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'
import axios from 'axios'

export default function layout (props) {
  const router = useRouter()
  const cookies = new Cookies()
  const tokenUser = cookies.get('tokenUser')

  const getUser = () => {
    axios.get(`http://localhost:8080/demo_01/user/${tokenUser}`)
      .then((res) => {
        console.log(res)
      })
      .catch((error)=>{
        console.log(error)
      })
  }

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-sine'
    })

    getUser()
    if (!tokenUser) {
      router.push('/login')
    }
  }, [tokenUser])

  const logout = () => {
    cookies.remove('tokenUser')
    router.push('/login')
  }

  return (
    <>
      <Row className='header' align='middle'>
        <Col span={6} className='header-item'>
          <Space>
            <div className='menu-btn'>
              <Icon icon='material-symbols:menu' color='#5F6368' width='25' />
            </div>
            <Icon icon='logos:google-keep' color='#333' width='30' />
            <p>Keep</p>
          </Space>
        </Col>
        <Col xs={18} md={12} className='header-item'>
          <div className='header-search'>
            <Space>
              <Icon icon='material-symbols:search' color='#5f6368' width='25' />
              <input placeholder='Tìm kiếm' />
            </Space>
          </div>
        </Col>
      </Row>
      <Row>
        <Col />
        <Col />
      </Row>
      <Row>
        <Col>
          <div className='sidebar'>
            <ul>
              <li onClick={() => { router.push('/') }} className={router.asPath === '/' ? 'sidebar-click' : ''}>
                <Space>
                  <div className='sidebar-item'>
                    <Icon icon='ci:bulb' color='#5f6368' width='25' />
                  </div>
                  <p>Ghi chú</p>
                </Space>
              </li>
              <li>
                <Space>
                  <div className='sidebar-item'>
                    <Icon icon='carbon:notification' color='#5f6368' width='25' />
                  </div>
                  <p>Thông báo</p>
                </Space>
              </li>
              <li>
                <Space>
                  <div className='sidebar-item'>
                    <Icon icon='material-symbols:edit-outline-sharp' color='#5f6368' width='25' />
                  </div>
                  <p>Ghi chú</p>
                </Space>
              </li>
              <li>
                <Space>
                  <div className='sidebar-item'>
                    <Icon icon='carbon:notification' color='#5f6368' width='25' />
                  </div>
                  <p>Lời nhắc</p>
                </Space>
              </li>
              <li onClick={logout}>
                <Space>
                  <div className='sidebar-item'>
                    <Icon icon='ri:logout-circle-r-line' color='#5f6368' width='25' />
                  </div>
                  <p>Đăng xuất</p>
                </Space>
              </li>
            </ul>
          </div>
        </Col>
        <Col style={{ paddingLeft: '80px', width: '100%' }}>
          {props.children}
        </Col>
      </Row>
    </>
  )
}
