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
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';

function App() {
  /** 주문정보 들어오면 바로 Order.js 로 신호 전달하기 */
  const [isOrdered, setIsOrdered] = useState(false)
  /** 주문왔을 때 띄울 toast */
  const [toast, setToast] = useState(false)
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
    /** 웹브라우저 새로고침 대응 */
    if (ws == null || ws === undefined) {
      console.log("App.js: ws 객체 dispatch 중 ")
      const action = { type: "SET_WEBSOCKET" }
      dispatch(action)
    }else{
      /** 웹소켓 컨넥트 확인용 : ws.readyState */
      console.log("웹소켓 컨넥트 (App.js): " + ws.readyState)  
      connect(ws)
    }
  }, [ws])
  /** 손님 키오스크로부터 오는 모든 메시지를 전달받음 */
  const connect = (ws) => {
    if(ws !== undefined){
      ws.onmessage = (msg) => {
        if (msg != null) {
          var result = JSON.parse(msg.data);
          if (result.type === "UPDATE_ORDERS_TOAST"){
            console.log(result.type)
          }else if (result.type === "UPDATE_ORDERS"){   
            console.log(result.type)
            setIsOrdered(true)
          }
        }
      }
    }
  }
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
              <Route path='/' element={<Home isOrdered={isOrdered} setIsOrdered={setIsOrdered}/>} />
              <Route path='/kiosk' Component={Kiosk} />
              <Route path='/order' element={<Order isOrdered={isOrdered} setIsOrdered={setIsOrdered}/>}/>
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

// function OrderToast() {

//   return (
//     <Row>
//       <Col xs={6}>
//         <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
//           <Toast.Header>
//             <img
//               src="holder.js/20x20?text=%20"
//               className="rounded me-2"
//               alt=""
//             />
//             <strong className="me-auto">Bootstrap</strong>
//             <small>11 mins ago</small>
//           </Toast.Header>
//           <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
//         </Toast>
//       </Col>
//       <Col xs={6}>
//         <Button onClick={() => setShow(true)}>Show Toast</Button>
//       </Col>
//     </Row>
//   );
// }