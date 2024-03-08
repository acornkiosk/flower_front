
import { useSelector } from "react-redux"
import Kiosk from "../pages/kiosk"
import Login from "./login/login"


export default function Home(){
    const userName=useSelector(state=>state.userName)
    console.log("사용자"+userName)
    if(localStorage.token  != null && userName!=null ){
        return (<Kiosk/>)
    }else {
        return (<Login/>)
    }
}