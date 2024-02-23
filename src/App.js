import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import Kiosk from './components/kiosk/kiosk';
import Login from './components/login/login';
import Menu from './components/menu/menu';
import Order from './components/order/Order';
import User from './components/user/User';


function App() {
  const [common,setCommon] = useState([])
  return (
    <div className="container">
      <h1>인덱스 테스트 페이지 입니다</h1>
      <ul>
        <li><Link to="/kiosk">키오스크 관리</Link></li>
        <li><Link to="/order">주문 관리</Link></li>
        <li><Link to="/user">사용자 관리</Link></li>
        <li><Link to="/menu">메뉴 관리</Link></li>
        <li><Link to="/login">로그인</Link></li>
      </ul>
      <Routes>
        <Route path='/kiosk' Component={Kiosk}/>
        <Route path='/order' Component={Order}/>
        <Route path='/user' Component={User}/>
        <Route path='/menu/*' Component={Menu}/>
        <Route path='/login' Component={Login}/>
      </Routes>
      <p>spring boot 와 연동이 되었는지 테스트 입니다.</p>
      <button onClick={() => {
        axios.post("/api/common/child", 1000,
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
    </div>
  );
}

export default App;
