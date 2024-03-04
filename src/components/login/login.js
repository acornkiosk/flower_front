
import axios from 'axios';
import { decodeToken } from 'jsontokens';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Login() {
  // Authorization: localStorage.token 
  axios.defaults.baseURL = process.env.PUBLIC_URL

  const dispatch = useDispatch()
  
  const userName=useSelector(state=>state.userName)
  
  // useState를 사용하여 각각의 input 필드의 값을 저장합니다.
  const [login, setLogin] = useState({})

  const navigate=useNavigate();

  useEffect(() => {
    if (localStorage.token) {
      //토큰을 디코딩
      const result = decodeToken(localStorage.token);
      console.log(result)
      //초단위
      const expTime = result.payload.exp * 1000; // *1000 을 해서 ms 단위로 만들고 
      //현재시간
      const now = new Date().getTime();
      //만일 유효기간이 만료 되었다면 
      if (expTime < now) {
        dispatch({ type: "SET_LOGIN", payload: false })
        dispatch({ type: "UPDATE_USER", payload: ""})
        delete localStorage.token;
      } else {//유효기간이 만료 되지 않았다면 로그인된 상태라고 간주!
        dispatch({ type: "SET_LOGIN", payload: true })
        dispatch({ type: "UPDATE_USER", payload: result.payload.sub })
        //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정 
        axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token
      }
    }
  }, [])

  // 로그인 버튼을 클릭할 때 실행되는 함수입니다.
  const handleLogin = () => {
    // Axios를 사용하여 Spring Boot와 통신합니다.
    axios.post("/api/auth", login)
      .then(res => {
        // 로그인이 성공했을 때 처리하는 로직을 작성합니다.
        console.log('로그인 성공:', res.data);
        //로컬 스토리지에 토큰 저장하기
        localStorage.token = res.data
        //저장된 토큰 디코딩 후 result에 저장하기
        const result = decodeToken(localStorage.token)
        //redux 에 로그인 상태 , 사용자 이름 저장하기
        dispatch({ type: "UPDATE_USER", payload: result.payload.sub })
        dispatch({ type: "SET_LOGIN", payload: true })
        //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정
        axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token

       alert(result.payload.sub+"님 로그인 했습니다.")
        //home으로 보내기
        navigate("/home")
      })
      .catch(error => {
        console.error(error);
      });
  };

  //input 요소에 문자열을 입력했을때 호출되는 함수 
  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }} >
      <div className="border border-secondary border-5 rounded-3 p-5">
        <Row>
          <Col md={6}>
            <Image fluid src="/images/testimg.jpg" style={{ width: '100%' }} />
          </Col>
          <Col>
            <div className="border border-light border-4 rounded-3 p-5">
              <p className="text-center fs-4 fw-bold mb-5"> 키오스크 로그인 </p>
              <Form>
                <Form.Group className="mb-3" controlId="formbasicEmail" >
                  <Form.Control type="text" name="id" placeholder="USER ID" onChange={(e) => handleChange(e)} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" name="password" placeholder="PASSWORD" onChange={(e) => handleChange(e)} />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button type="button" variant="primary" onClick={handleLogin}>
                    로그인
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>

  )
}

export default Login;
