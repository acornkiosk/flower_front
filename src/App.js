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
import Sidebar from './SideBar';
import Navbar from './NavBar';

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
    
    <div className="d-flex">
       <div>
        <Sidebar/>
      </div>
      <div style={{flex:"1 1 auto", display:"flex", flexFlow:"column", height:"100vh", overflowY:"hidden"}}>
        <Navbar/>
        <div style={{height:"100%"}}>
          <div style={{height:"calc(100% - 64px)", padding:"20px 5%", overflowY:"scroll"}}>
          <p>관리자 페이지</p>
          {/*
          <ul>
            <li><Link to="/kiosk">키오스크 관리</Link></li>
            <li><Link to="/order">주문 관리</Link></li>
            <li><Link to="/user">사용자 관리</Link></li>
            <li><Link to="/menu">메뉴 관리</Link></li>
            <li><Link to="/login">로그인</Link></li>
          </ul>
          */
          }
          
          
          <Routes>
            <Route path='/kiosk' Component={Kiosk}/>
            <Route path='/order' Component={Order}/>
            <Route path='/user' Component={User}/>
            <Route path='/menu/*' Component={Menu}/>
            <Route path='/login' Component={Login}/>
          </Routes>

     {/*
          <p>spring boot 와 연동이 되었는지 테스트 입니다.</p>
          <button onClick={() => {
            axios.post("/api/common/child", {"code_id": 1000},
              { headers: { "Content-Type": "application/json" } })
              .then(res => {
                console.log(res.data.list)
                setCommon(res.data.list)
              })
          }}>응답받기</button>
          <table>
            <thead>
              <tr>
                <th>code_id</th>
                <th>p_code_id</th>
                <th>code_name</th>
                <th>code_value</th>
                <th>code_img</th>
              </tr>
            </thead>
            <tbody>
              {common.map(item =>
                  <tr>
                    <td>{item.code_id}</td>
                    <td>{item.p_code_id}</td>
                    <td>{item.code_name}</td>
                    <td>{item.code_value}</td>
                    <td>{item.code_img}</td>
                  </tr>
                )}
            </tbody>
          </table>

          */}
          </div>    
        </div> 
      </div>
    </div>
  );
}

export default App;