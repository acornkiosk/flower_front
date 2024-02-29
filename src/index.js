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
import { Provider } from 'react-redux';


const initialState = {
  commonTable : [],
  orders : [],
  userName:null,
  isLogin:false
}
//reducer 함수
const reducer = (state = initialState, action) => {
  let newState
  if(action.type === "UPDATE_COMMON") {
    newState = {
      ...state,
      commonTable : action.payload
    }
    return newState
  }else if(action.type === "UPDATE_ORDERS") {
    newState = {
      ...state,
      orders : action.payload
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
  }else{
    newState=state
  }
  
  return newState
}
//storage
const store = createStore(reducer)
//storag에서 관리될 초기값

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