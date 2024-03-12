import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router"


export default function Error(){
    const navigate=useNavigate()
    useEffect(()=>{
        setTimeout(() => {
            navigate("/")
        }, 3000)
    },[])
    const userName=useSelector(state=>state.userName)
    const rank = useSelector(state => state.rank)
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
    return(
        <div>
         <h1 style={{textAlign:'center'}}> <strong>{userName}</strong>{rankText} 님 권한에 맞지 않는 페이지 요청을 하였습니다!</h1>
          <img src="/images/error.png" style={{ width: '100%' ,height:"720px"}}  />
        </div>
    )

}