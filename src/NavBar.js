import React from "react";
import { Header } from "./NavBar.Style";
import { CDBNavbar } from "cdbreact";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";

const Navbar = () => {
  const userName=useSelector(state=>state.userName)
  const isLogin=useSelector(state=>state.isLogin)
  const navigate=useNavigate();
  const dispatch = useDispatch();
  //로그아웃 핸들러
  const handleLogout = () => {
    //localStorage 에 저장된 토큰 삭제
    delete localStorage.token
    //store 의 상태 바꾸기
    dispatch({ type: "SET_LOGIN", payload: false })
    delete axios.defaults.headers.common["Authorization"]
    dispatch({type:"SET_LOGIN",payload:false})
    dispatch({type:"SET_RANK",payload:false})
    navigate("/home")
  }

   return (
        <Header style={{background:"#333", color:"#fff", minHeight:'73.5px' , display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <CDBNavbar dark expand="md" scrolling >
            <div className="ml-auto">
              
              {
                isLogin && <i className="mx-4"><strong>{userName} </strong>님 로그인중 <Button variant="secondary" onClick={handleLogout}>로그아웃</Button></i>
              }
              
              {
                !isLogin && <Button variant="secondary" className="mx-4" onClick={()=>{
                  navigate("/login")
                }}> 로그인 </Button>
                
              }
              
            </div>
          </CDBNavbar>
        </Header>
   );
}

export default Navbar;