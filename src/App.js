
import axios from 'axios';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
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
  return (
    <div className="d-flex">
      <div>
        <Sidebar/>
      </div>
      <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
        <Navbar />
        <div style={{ height: "100%" }}>
          <div style={{ height: "calc(100% - 64px)", padding: "20px 5%", overflowY: "scroll" }}>
            <Routes>
            <Route path='/' Component={Home}/>
              <Route path='/kiosk' Component={Kiosk} />
              <Route path='/order' Component={Order} />
              <Route path='/user' Component={User} />
              <Route path='/menu/*' Component={Menu} />
              <Route path='/login' element={<Login isLogin={isLogin} handleLogin={handleLogin} />} />
              <Route path='/owner' Component={OwnerMange} />
              <Route path='/dash' Component={DashBoard}/>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;