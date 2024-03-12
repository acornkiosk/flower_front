import { red } from "@mui/material/colors"
import { color } from "d3-color"
import { useEffect } from "react"
import { useNavigate } from "react-router"


export default function Error(){
    const navigate=useNavigate()
    useEffect(()=>{
        setTimeout(() => {
            navigate("/")
        }, 3000)
    },[])
   
    return(
        <div>
          <h1 style={{ color: 'red' }}>
            권한이 부족하여 이 작업을 수행할 수 없습니다.
            </h1>
          <img src="/images/test.jpg" style={{ width: '100%' }}  />
        </div>
    )
}