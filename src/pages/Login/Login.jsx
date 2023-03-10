import React, { useState, useEffect } from 'react'
import loader from '../../assets/Gif/loader.gif'
import { Link, useNavigate } from 'react-router-dom';
import Btn from '../../components/Btn'
import axios from 'axios';
import BtnBig from '../../components/BtnBig'
import Logout from '../Logout'
import { DeviceUUID } from 'device-uuid'
import bgBottom from '../../assets/Svg/bg-bottom.svg'
import mBac from '../../assets/Svg/m-bac.svg'
import klikBac from '../../assets/Svg/klik-bac.svg'
import infoBac from '../../assets/Svg/info-bac.svg'
import bacWhite from '../../assets/Svg/bac-white.svg'
import btnAbout from '../../assets/Svg/btn-info.svg'
import './Login.css'


const Login = () => {
  const [ip, setIp] = useState("");
  const [popup, setPopup] = useState('loading');
  const [codeAkses, setCodeAkses] = useState('');
  const [msg, setMsg] = useState('');
  const [isImageLoad, setIsImageLoad] = useState(false)
  const navigate = useNavigate();


  const getDataIp = async () => {
    const du = new DeviceUUID().parse();
    let dua = [
      du.language,
      du.platform,
      du.os,
      du.cpuCores,
      du.isAuthoritative,
      du.silkAccelerated,
      du.isKindleFire,
      du.isDesktop,
      du.isMobile,
      du.isTablet,
      du.isWindows,
      du.isLinux,
      du.isLinux64,
      du.isMac,
      du.isiPad,
      du.isiPhone,
      du.isiPod,
      du.isSmartTV,
      du.pixelDepth,
      du.isTouchScreen
    ];
    let uuid = du.hashMD5(dua.join(':'));
    setIp(uuid)
  }

  useEffect(() => {
    getDataIp()
    Logout()
  }, [])

  useEffect(() => {
    if (isImageLoad) {
      setPopup('')
    }
  }, [isImageLoad])

  const authKodeAkses = async () => {
    if (codeAkses.length !== 6) {
      setMsg("107 - Kode Akses harus 6 karakter dengan kombinasi huruf dan angka.");
      setCodeAkses('')
      setPopup('error')
      return false
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}login`, {
        kode_akses: codeAkses,
        ip_address: ip
      })
      setCodeAkses('')
      setPopup('')
      navigate("/home")
    } catch (error) {
      console.log(error.response.data.msg);
      setMsg(error.response.data.msg);
      setCodeAkses('')
      setPopup('error')
    }
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
    } else if (props === 'kodeakses') {
      return (
        <div className="popup" style={popup === 'kodeakses' ? { display: 'block' } : { display: 'none' }}>
          <div className="card-popup">
            <p>Kode Akses</p>
            <input type="password" maxLength={6} id='kodeAkses' placeholder='Input 6 alphanum'
              value={codeAkses} onChange={e => setCodeAkses(e.target.value)} autoFocus />
            <div className="action">
              <div onClick={() => { setPopup(''); setCodeAkses('') }}><Btn label="Cancel" /></div>
              <div onClick={() => { setPopup('loading'); authKodeAkses() }}><Btn label="OK" /></div>
            </div>
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
      <div className="bg">
        <Link to='/about' className="btn-about" ><img src={btnAbout} alt="btnAbout" onLoad={() => setIsImageLoad(true)} /></Link>
        <div className='btn-login'>
          <img id='logo-bacWhite' src={bacWhite} alt="abc-logo" onLoad={() => setIsImageLoad(true)} />
          <div className="card">
            <div onClick={() => setPopup('kodeakses')} className="button"><img src={mBac} alt="bg-bottom" onLoad={() => setIsImageLoad(true)} /><p>m-BAC</p></div>
            <div onClick={() => { setMsg('Mohon maaf fitur ini sedang dalam tahap pengembangan.'); setPopup('error') }} className="button"><img src={klikBac} alt="bg-bottom" onLoad={() => setIsImageLoad(true)} /><p>KlikBAC</p></div>
            <div onClick={() => { setMsg('Mohon maaf fitur ini sedang dalam tahap pengembangan.'); setPopup('error') }} className="button"><img src={infoBac} alt="bg-bottom" onLoad={() => setIsImageLoad(true)} /><p>Info BAC</p></div>
          </div>
          <div className="op">
            <Link to="/buka-rekening" className="button-op">Buka Rekening Baru</Link>
            <Link to="/ganti-kode" className="button-op">Ganti Kode Akses</Link>
            <div onClick={() => { setMsg('Mohon maaf fitur ini sedang dalam tahap pengembangan.'); setPopup('error') }} className="button-op">Info Bac</div>
          </div>
        </div>
        <div className="footer">Selamat datang di <span>BAC mobile</span></div>
        <div className="bg-bottom"><img src={bgBottom} alt="bg-bottom" /></div>
      </div>
    </div>
  )
}

export default Login