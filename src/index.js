import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import { decodeToken } from 'jsontokens';
import React, { createRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { legacy_createStore as createStore } from 'redux';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

//userName,isLogin 초기값을 설정해준다.
let userName = null
let isLogin = false
let rank = null
let role = []

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
const initialstate = {
  userName,
  commonTable: [],
  orders: [],
  isLogin,
  rank,
  role,
  selectedMenuId: 0,
  ws: createRef(),
  isToast: false
}
const reducer = (state = initialstate, action) => {
  let newState
  if (action.type === "UPDATE_COMMON") {
    newState = {
      ...state,
      commonTable: action.payload
    }
  } else if (action.type === "SET_LOGIN") {
    newState = {
      ...state,
      userName: action.payload.userName
      , isLogin: action.payload.isLogin
      , rank: action.payload.rank
      , role: action.payload.role
      , ws: action.payload.websocket // connect 함수를 호출하여 ws 객체를 설정
    }
    if (timeoutId) clearTimeout(timeoutId)
    checkTokenTimeout()
  } else if (action.type === "SELECT_MENU") {
    newState = {
      ...state,
      selectedMenuId: action.payload
    }
  } else if (action.type === "SET_TOAST") {
    newState = {
      ...state,
      isToast: action.payload
    }
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