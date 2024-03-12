import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
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
  /** 웹소켓 참조값을 담을 필드 */
  let ws = useSelector((state) => state.ws)
  /** 화면 실행시 */
  useEffect(() => {
    /** 1차 웹브라우저 새로고침 대응 */
    if (ws == null || ws === undefined) {
      console.log("app.js: ws 객체 dispatch 중")
      const action = { type: "SET_WEBSOCKET" }
      dispatch(action)
    }else{
      console.log("app.js 에 ws가 잘 건너왔다!")
      console.log(ws)
    }
  }, [ws])
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
              <Route path='/login' Component={Login}/>
              <Route path='/owner' Component={OwnerMange} />
              <Route path='/dash' Component={DashBoard} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
