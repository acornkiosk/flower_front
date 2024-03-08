
import axios from 'axios';

import { Alert } from "react-bootstrap"
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';
import Navbar from './NavBar';
import Sidebar from './SideBar';
import OwnerMange from './components/login/OwnerManage';
import Login from './components/login/login';
import Menu from './components/menu/menu';
import Order from './components/order/Order';
import User from './components/user/User';
import Home from './components/Home';
import Kiosk from './pages/kiosk';
import DashBoard from './pages/DashBoard';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const handleLogin = () => {
    setIsLogin(true);
  };
  const dispatch = useDispatch()
  useEffect(() => {
    axios.post("/api/common/child", { code_id: 0 })
      .then(res => {
        const action = {
          type: "UPDATE_COMMON",
          payload: res.data.list
        }
        dispatch(action)
      })
      .catch(error => console.log(error))

  }, [])

  /** 이것만 있으면 웹소켓 ID를 유지한 채로 사용가능함! */
  const ws = useSelector((state) => state.ws)
  
  /** 화면 실행시 */
  useEffect(()=>{
    console.log("app.js 에 잘 건너왔다!"+ws)

  },[ws])

  /** 레이아웃 무시하고 강제로 만든 뀌뀌스러운 주문 알림창 */
  const alertLocation = {
    position: "fixed",
    bottom: "0"
  }
  /** 주문 알림창 데이터 */
  const [newOrder, setNewOrder] = useState({
    id: 0,
    kiosk_id: 0,
    order_id: 0
  })
  /** 주문 알림창 */
  const [alertShow, setAlertShow] = useState(false);

  return (
    <div className="d-flex">
      <div>
        <Sidebar />
      </div>
      <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
        <Navbar />
        <div style={{ height: "100%" }}>
          <div style={{ height: "calc(100% - 64px)", padding: "20px 5%", overflowY: "scroll" }}>
            <Routes>
              <Route path='/' Component={Home} />
              <Route path='/kiosk' Component={Kiosk} />
              <Route path='/order' Component={Order} />
              <Route path='/user' Component={User} />
              <Route path='/menu/*' Component={Menu} />
              <Route path='/login' element={<Login isLogin={isLogin} handleLogin={handleLogin} />} />
              <Route path='/owner' Component={OwnerMange} />
              <Route path='/dash' Component={DashBoard} />
            </Routes>
          </div>
          <Alert key={newOrder.id} show={alertShow} onClose={() => setAlertShow(false)} style={alertLocation} dismissible >
            {newOrder.kiosk_id}번 키오스크에서 {newOrder.order_id}번째 주문이 들어왔어요!
          </Alert>
        </div>
      </div>
    </div>
  );
}

export default App;
