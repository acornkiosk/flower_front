import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import OrderToast from './components/toast/OrderToast';
import Navbar from './components/toolbar/NavBar';
import Sidebar from './components/toolbar/SideBar';
import DashBoard from './pages/DashBoard';
import Home from './pages/Home';
import Order from './pages/Order';
import OwnerMange from './pages/OwnerManage';
import User from './pages/User';
import Kiosk from './pages/kiosk';
import Login from './pages/login';
import Menu from './pages/menu';

function App() {
  /** 실시간 주문개수 파악 SideBar.js 로 보내기
   * useSelector로 안한 이유 : undefined */
  const [orderCount, setOrderCount] = useState(0)
  const isToast = useSelector(state => state.isToast)
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
  return (
    <div className="d-flex">
      <div>
        <Sidebar orderCount={orderCount} />
      </div>
      <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
        <Navbar />
        <div style={{ height: "100%" }}>
          <div style={{ height: "calc(100% - 64px)", padding: "20px 5%", overflowY: "scroll" }}>
            <Routes>
              <Route path='/' element={<Home orderCount={orderCount} setOrderCount={setOrderCount} />} />
              <Route path='/kiosk' Component={Kiosk} />
              <Route path='/order' element={<Order orderCount={orderCount} setOrderCount={setOrderCount} />} />
              <Route path='/user' Component={User} />
              <Route path='/menu/*' Component={Menu} />
              <Route path='/login' Component={Login} />
              <Route path='/owner' Component={OwnerMange} />
              <Route path='/dash' Component={DashBoard} />
            </Routes>
          </div>
        </div>
        {isToast && <OrderToast />}
      </div>
    </div>
  );
}

export default App;