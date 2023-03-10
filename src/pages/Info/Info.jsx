import React, { useState, useEffect } from 'react'
import loader from '../../assets/Gif/loader.gif'
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar'
import Topbar from '../../components/Topbar'
import mInfo from '../../assets/Svg/m-info.svg'
import BtnBig from '../../components/BtnBig'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import './Info.css'


function Info() {
  const [popup, setPopup] = useState('loading');
  const [isImageLoad, setIsImageLoad] = useState(false)
  const [msg, setMsg] = useState('')
  const [token, setToken] = useState('')
  const [expire, setExpire] = useState('')
  const [network, setNetwork] = useState('');
  const [users, setUsers] = useState([])
  const [saldo, setSaldo] = useState("0")
  const [noRek, setNoRek] = useState("-")
  const navigate = useNavigate();

  useEffect(() => {
    refreshToken()
    getDataUser();
  }, []);

  useEffect(() => {
    if (network !== '' && isImageLoad) {
      setPopup('')
    }
  }, [network, isImageLoad])

  setInterval(() => {
    let currRtt = navigator.connection.rtt;
    if (currRtt === 0 || currRtt === 2000) {
      setNetwork('offline')
    } else if (currRtt >= 10 && currRtt <= 600) {
      setNetwork('online')
    } else {
      setNetwork('pending')
    }
  }, 500);

  const getDataUser = () => {
    refreshToken()
    getUsers()
  }

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}token`)
      const decoded = jwt_decode(response.data.accessToken)
      setExpire(decoded.exp)
    } catch (error) {
      if (error.response) {
        navigate('/')
      }
    }
  }

  const axiosJWT = axios.create()

  axiosJWT.interceptors.request.use(async (config) => {
    const currentDate = new Date();
    if (expire * 1000 < currentDate.getTime()) {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}token`)
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      setToken(response.data.accessToken)
    }
    return config;
  }, (error) => {
    return Promise.reject(error)
  })

  const getUsers = async () => {
    const response = await axiosJWT.get(`${process.env.REACT_APP_API_URL}users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setUsers(response.data)
  }

  setTimeout(() => {
    setSaldo(users.saldo ? users.saldo.toString() : '')
    setNoRek(users.saldo ? users.no_rek.toString() : '')
  }, 500);

  const handlePopupSaldo = () => {
    if (network !== 'online') {
      setMsg('Transaksi dapat dilakukan setelah lampu indikator berwarna hijau.')
      setPopup('error')
      return false
    }
    getUsers()
    setPopup('saldo')
  }

  // Rupiah format
  const rupiahFormat = (nominal) => {
    let num_str = nominal.toString(),
      sisa = num_str.length % 3,
      rp = num_str.substr(0, sisa),
      rb = num_str.substr(sisa).match(/\d{3}/g);
    if (rb) {
      let sparator = sisa ? ',' : ''
      rp += sparator + rb.join(',')
    }
    return rp
  }

  // Date time
  const timeNow = () => {
    const date = new Date();
    let mon = date.getMonth() + 1;
    let dt = date.getDate();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return `${mon}/${dt} ${h}:${m}:${s}`
  }

  const Popup = (props) => {
    if (props === 'error') {
      return (
        <div className="popup-error" style={props === 'error' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>{msg}</p>
            <div className="action">
              <div onClick={() => { setPopup('') }}><BtnBig label="Back" /></div>
            </div>
          </div>
        </div>
      )
    } else if (props === 'saldo') {
      return (
        <div className="popup" style={popup === 'saldo' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup" >
            <p>m-Info</p>
            <div>
              <div className='time-saldo'>
                <p>m-Info:</p>
                <p>{timeNow()}</p>
              </div>
              <div className='info-saldo'>
                <p>{noRek}</p>
                <p>Rp. {rupiahFormat(saldo)}. 00</p>
              </div>
            </div>
            <div onClick={() => { setPopup('') }}><BtnBig label="OK" /></div>
          </div>
        </div>
      )
    } else if (props === 'loading') {
      return (
        <div className="popup" style={popup === 'loading' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup" style={{ borderRadius: 10, width: '90%', minHeight: 98, textAlign: 'center', top: 250, backgroundColor: '#fff' }}>
            <img src={loader} alt="loading" style={{ width: 34, height: 34 }} />
            <p style={{ height: 12, width: 54, margin: '10px auto', textAlign: 'center', color: '#000' }}>Sending</p>
          </div>
        </div>
      )
    }
  }


  return (
    <div className='container'>
      {Popup(popup)}
      <div className='topbar-send'>
        <p>m-Info</p>
        <div>
          <div className={network}></div>
          <div className='send' style={{ visibility: 'hidden' }}></div>
        </div>
      </div>
      <div className="m-info">
        <div className="card-info">
          <div className="header-info">
            <img src={mInfo} alt="icon" onLoad={() => setIsImageLoad(true)} />
            <p>m-Info</p>
          </div>
          <div className="menu-info">
            <div onClick={() => { setPopup('loading'); handlePopupSaldo() }} className="list-info">
              <p>Info Saldo</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div onClick={() => { setMsg('Mohon maaf fitur ini sedang dalam tahap pengembangan.'); setPopup('error') }} className="list-info">
              <p>Mutasi Rekening</p>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  )
}

export default Info