import axios from 'axios';
import { decodeToken } from 'jsontokens';
import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Login() {
  const cookies = new Cookies();
  const dispatch = useDispatch()
  // useState를 사용하여 각각의 input 필드의 값을 저장합니다.
  const [login, setLogin] = useState({
    id: cookies.get('cid')
  })

  const navigate = useNavigate();
  //로그인실패시 alert 
  const [showAlert, setShowAlert] = useState(false)
  // 로그인 버튼을 클릭할 때 실행되는 함수입니다.
  const handleLogin = () => {
    // Axios를 사용하여 Spring Boot와 통신합니다.
    axios.post("/api/auth", login)
      .then(res => {
        //로컬 스토리지에 토큰 저장하기
        localStorage.token = res.data
        //저장된 토큰 디코딩 후 result에 저장하기
        const result = decodeToken(localStorage.token)
        const data = {
          userName: result.payload.sub,
          isLogin: true,
          rank: result.payload.rank,
          role: result.payload.role
        }
        console.log("로그인 했을때 role 값"+result.payload.role)
        dispatch({ type: "SET_LOGIN", payload: data })

        //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정
        axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token
        alert(result.payload.sub + "님 로그인 했습니다.");
        //home으로 보내기
        navigate("/")
      })
      .catch(error => {
        console.error(error);
        setShowAlert(true)
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
            <Image fluid src="/images/flower.png" style={{ width: '100%' }} />
          </Col>
          <Col>
            <div className="border border-light border-4 rounded-3 p-5">
              <p className="text-center fs-4 fw-bold mb-5"> 키오스크 로그인 </p>
              <Form>
                <Form.Group className="mb-3" controlId="formbasicEmail" >
                  <Form.Control type="text" name="id" placeholder="USER ID" value={login.id} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="password" name="password" placeholder="PASSWORD" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <input type="checkbox" name="save" value="save" onChange={handleChange} />
                  아이디 저장
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button type="button" variant="primary" onClick={handleLogin}>
                    로그인
                  </Button>
                </div>
                <Alert className='mt-1' variant='danger' show={showAlert}>아이디 혹은 비밀번호가 틀렸습니다!</Alert>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </Container>

  )
}

export default Login;
