
import axios from 'axios';
import { decodeToken } from 'jsontokens';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

function Login() {

  axios.defaults.baseURL = process.env.PUBLIC_URL

  const [isLogin, setIsLogin] = useState(false);
  // useState를 사용하여 각각의 input 필드의 값을 저장합니다.
  const [loginError, setLoginError] = useState('');
  const [state, setState] = useState({})
  const [id, setId] = useState('');
  const dispatch = useDispatch()

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
      } else {//유효기간이 만료 되지 않았다면 로그인된 상태라고 간주!
        dispatch({ type: "SET_LOGIN", payload: true })
        dispatch({ type: "UPDATE_USER", payload: result.payload.sub })
        //axios 의 header 에 인증정보를 기본으로 가지고 갈수 있도록 설정 
        axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token
        setIsLogin(true);
        setId(result.payload.sub); 
      }
    }
  }, [])

  // 로그인 버튼을 클릭할 때 실행되는 함수입니다.
  const handleLogin = () => {
    // Axios를 사용하여 Spring Boot와 통신합니다.
    axios.post("/api/auth", state)
      .then(res => {
        // 로그인이 성공했을 때 처리하는 로직을 작성합니다.
        console.log('로그인 성공:', res.data);
        localStorage.token = res.data
        const result = decodeToken(localStorage.token)
        const id = result.payload.sub
        dispatch({ type: "UPDATE_USER", payload: id })
        dispatch({ type: "SET_LOGIN", payload: true })
        axios.defaults.headers.common["Authorization"] = "Bearer+" + localStorage.token
        setIsLogin(true);
        setId(id);
      })
      .catch(error => {
        // 로그인이 실패했을 때 처리하는 로직을 작성합니다.
        console.error('로그인 실패:', error);
        setLoginError('아이디 혹은 비밀번호가 틀려요!');
      });
  };

  const handleLogout = () => {
    //localStorage 에 저장된 토큰 삭제
    delete localStorage.token
    //store 의 상태 바꾸기
    dispatch({ type: "SET_LOGIN", payload: false })
    delete axios.defaults.headers.common["Authorization"]
    setIsLogin(false);
    setId('');
  }

  //input 요소에 문자열을 입력했을때 호출되는 함수 
  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }


  if (isLogin) {
    return (
      <div>
        <p> <strong>{id}</strong> 님 로그인중... <button onClick={handleLogout}>로그아웃</button></p>
      </div>
    );
  } else {
    return (
      <div>
        <input
          type="text"
          placeholder="아이디"
          name="id"
          onChange={(e) => handleChange(e)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          name="password"
          onChange={(e) => handleChange(e)}
        />
        <button onClick={handleLogin}>로그인</button>
        {loginError && <div>{loginError}</div>}
      </div>

    )
  }
}
  export default Login;