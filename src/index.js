import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { decodeToken } from 'jsontokens';
import axios from 'axios';

//userName,isLogin 초기값을 설정해준다.
let userName = null
let isLogin = false
let rank = null
<<<<<<< HEAD
let role = []

=======
>>>>>>> origin
axios.defaults.baseURL = process.env.PUBLIC_URL

function deleteToken() {
  //만료된 토큰은 삭제한다 
  delete localStorage.token
  alert("토큰이 만료되었습니다.")
  window.location.replace("/")
}
if (localStorage.token) {
  //토큰을 디코딩
  const result = decodeToken(localStorage.token);
  //초단위
  const expTime = result.payload.exp * 1000; // *1000 을 해서 ms 단위로 만들고 
  //현재시간
  const now = new Date().getTime();
  if (expTime > now) {
    userName = result.payload.sub
    isLogin = true
    rank = result.payload.rank
    role = result.payload.role
    console.log(rank)
    console.log("index.js 에서 role 값"+role)
    //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정 
    axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token
  } else {
    deleteToken()
  }
}
let timeoutId
const checkTokenTimeout = () => {
  if (!localStorage.token) return;
  //토큰을 디코딩
  const result = decodeToken(localStorage.token);
  //초단위
  const expTime = result.payload.exp * 1000; // *1000 을 해서 ms 단위로 만들고 
  //현재시간
  const now = new Date().getTime();
  //남은 유효기간
  let remain = expTime - now
  //남은 시간이 경과하면 호출되는 함수 등록
  timeoutId = setTimeout(() => {
    deleteToken()
  }, remain)
}
checkTokenTimeout()
/** 웹소켓 참조값을 담을 필드 */
let ws
/** 웹소켓 연결관리 함수 */
const connect = () => {
  /** 웹소켓 프로토콜을 사용하여 서버 'WebSocketConfig' 연결 */
  ws = new WebSocket("ws://localhost:9000/flower/ws/order")
  /** 연결에 성공했을 경우 동작하는 메서드 */
  ws.onopen = () => { console.log("index.js : 실시간 화면연동 시작(웹소켓)") }
  /** 연결과정에서 에러가 생겼을 때 동작하는 메서드 */
  ws.onerror = () => { console.log("index.js : 화면 연동이 원활하게 이루어지지 않고 있습니다. 재로그인 혹은 서버 확인이 필요합니다(웹소켓)") }
  /** 연결이 끊겼을 때 동작하는 메서드 */
  ws.onclose = () =>{
    setTimeout(()=>{
      ws.onopen()
    }, 3000)
  }
  /** 반환처리를 통해 undefined 방지 */
  return ws;
}
const initialstate = {
  userName,
  commonTable: [],
  orders: [],
  isLogin,
  rank,
  role,
  ws: null // 웹소켓 요청 객체를 담는 변수(초기에는 null로 설정)

}
const reducer = (state = initialstate, action) => {
  let newState
  if (action.type === "UPDATE_COMMON") {
    newState = {
      ...state,
      commonTable: action.payload
    }
  } else if (action.type === "SET_LOGIN") {
    console.log(action.payload)
    newState = {
      ...state,
      userName: action.payload.userName
      , isLogin: action.payload.isLogin
      , rank: action.payload.rank
      , role: action.payload.role
      , ws: connect() // connect 함수를 호출하여 ws 객체를 설정

    }
    if (timeoutId) clearTimeout(timeoutId)
    checkTokenTimeout()
  } else {
    newState = state
  }
  return newState
}
const store = createStore(reducer)
//id 가 root 인 곳에 UI 출력하기 
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();