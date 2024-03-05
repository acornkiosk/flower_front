import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// App.js 를 import 해서 
import App from './App';
import reportWebVitals from './reportWebVitals';
//라우터를 사용할 준비
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import { legacy_createStore as createStore } from 'redux';
import { Provider} from 'react-redux';
import { decodeToken } from 'jsontokens';
import axios from 'axios';

//userName,isLogin 초기값을 설정해준다.
let userName=null
let isLogin=false
let rank=null
if (localStorage.token) {
  //토큰을 디코딩
  const result = decodeToken(localStorage.token);
  //초단위
  const expTime = result.payload.exp * 1000; // *1000 을 해서 ms 단위로 만들고 
  //현재시간
  const now = new Date().getTime();
  //만일 유효기간이 만료 되었다면 
  if(expTime > now){
    userName=result.payload.sub
    isLogin=true
    rank=result.payload.rank
    //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정 
    axios.defaults.headers.common["Authorization"]="Bearer+"+localStorage.token
  }else{
    //만료된 토큰은 삭제한다 
    delete localStorage.token
  }
}
const initialstate={
  userName,
  commonTable : [],
  orders : [],
  isLogin,
  rank
}

const reducer=(state=initialstate,action)=>{
  let newState

  if(action.type === "UPDATE_COMMON") {
    newState = {
      ...state,
      commonTable : action.payload
    }
  }else if(action.type === "UPDATE_USER"){
    newState = {
      ...state,
      userName:action.payload
    }
  }else if(action.type === "SET_LOGIN"){
    newState ={
      ...state,
      isLogin:action.payload //boolean 값으로 전달될 예정 
    }
  }else if(action.type === "SET_RANK"){
    newState ={
      ...state,
      rank:action.payload 
    }
  }else{
    newState=state
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