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
import Sidebar from './SideBar';
import Navbar from './NavBar';
import Main from './components/main';

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
          <Routes>
            <Route path='/kiosk' Component={Kiosk}/>
            <Route path='/order' Component={Order}/>
            <Route path='/user' Component={User}/>
            <Route path='/menu/*' Component={Menu}/>
            <Route path='/login' Component={Login}/>
            <Route path='/main' Component={Main}/>
          </Routes>
          </div>    
        </div> 
      </div>
    </div>
  );
}

export default App;