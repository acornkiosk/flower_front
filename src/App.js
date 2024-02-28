import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import Kiosk from './components/kiosk/kiosk';
import Login from './components/login/login';
import Menu from './components/menu/menu';
import Order from './components/order/Order';
import User from './components/user/User';
import { useDispatch } from 'react-redux';
import main from './components/main';

function App() {
  const [common,setCommon] = useState([])
  const dispatch = useDispatch()

  useEffect(() =>{
    console.log("App.js : 공통코드 서버요청중")
    
    axios.post("/api/common/child",{code_id : 0})
    .then(res => {
      const action = {
        type: "UPDATE_COMMON",
        payload: res.data.list
      }
      console.log("App.js : 공통코드 현황")
      console.log(res.data.list)
      dispatch(action)
    })
    .catch(error => console.log(error))
   
  },[])

  return (
    <div className="container">
      <ul>
        <li><Link to="/kiosk">키오스크 관리</Link></li>
        <li><Link to="/order">주문 관리</Link></li>
        <li><Link to="/user">사용자 관리</Link></li>
        <li><Link to="/menu">메뉴 관리</Link></li>
        <li><Link to="/main">키오스크</Link></li>
        <li><Link to="/login">로그인</Link></li>
      </ul>
      <Routes>
        <Route path='/kiosk' Component={Kiosk}/>
        <Route path='/order' Component={Order}/>
        <Route path='/user' Component={User}/>
        <Route path='/menu/*' Component={Menu}/>
        <Route path='/login' Component={Login}/>
        <Route path='/main' Component={main}/>
      </Routes>
    </div>
  );
}

export default App;
