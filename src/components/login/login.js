import axios from "axios"
import { useRef } from "react"

function Login() {
  
  let inputId=useRef()
  let inputPassword=useRef()

  return (
    <div className="container">
      <h3>로그인 폼</h3>
      <input type='text' placeholder='id' ref={inputId}/>
      <input type='text' placeholder='password' ref={inputPassword}/>
      <button onClick={()=>{
        const formData=new FormData()
        formData.append("id",inputId.current.value)
        formData.append("password",inputPassword.current.value)
        axios.post("/api/auth",formData,{headers: { "Content-Type": "application/json" }})
        .then(res=>{
          console.log(res.data)
          localStorage.token="Bearer+"+res.data
        })
      }}>로그인</button> 
        <button onClick={()=>{
            axios.get("/pingtest",{
              headers:{
                Authorization:localStorage.token
              }
            }).then(res=>{
              console.log(res.data)
            })
        }}> ping</button>


        


     
    </div>
  )
}

export default Login