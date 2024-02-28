import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';


const initialState = {
  commonTable : [],
  orders : []
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
  }
  
  return newState
}
//storage
const store = createStore(reducer)
//storag에서 관리될 초기값 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
  </Provider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
