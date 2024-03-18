import axios from 'axios';
import { CDBNavbar } from "cdbreact";
import React, { createRef } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { close } from '../../util/websocket';
import { Header } from './NavBar.Style';

const Navbar = () => {
  const userName = useSelector(state => state.userName)
  const isLogin = useSelector(state => state.isLogin)
  const rank = useSelector(state => state.rank)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ws = useSelector(state => state.ws)
  //로그아웃 핸들러
  const handleLogout = () => {
    close(ws, "로그아웃")
    //localStorage 에 저장된 토큰 삭제
    delete localStorage.token
    //store 의 상태 바꾸기
    delete axios.defaults.headers.common["Authorization"]
    const data = {
      userName: null,
      isLogin: false,
      rank: null,
      role: [],
      websocket: createRef()
    }
    dispatch({ type: "SET_LOGIN", payload: data })
    navigate("/")
  }

  let rankText = "";
  if (rank === 3001) {
    rankText = "[관리자]";
  } else if (rank === 3002) {
    rankText = "[사장님]";
  } else if (rank === 3003) {
    rankText = "[매니저]";
  } else if (rank === 3004) {
    rankText = "[직원]";
  }


  return (
    <Header style={{ background: "#333", color: "#fff", minHeight: '73.5px', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
      <CDBNavbar dark expand="md" scrolling >
        <div className="ml-auto">
          {
            isLogin && <i className="mx-4"><strong>{rankText} {userName} </strong>님 로그인중 <Button variant="secondary" className='ms-3' onClick={handleLogout}>로그아웃</Button></i>
          }
          {
            !isLogin && <Button variant="secondary" className="mx-4" onClick={() => {
              navigate("/login")
            }}> 로그인 </Button>
          }
        </div>
      </CDBNavbar>
    </Header>
  );
}

export default Navbar;