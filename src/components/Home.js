
import { useSelector } from "react-redux"
import Login from "./login/login"
import Kiosk from "./kiosk/kiosk"


export default function Home(){
    
    if(localStorage.token  == null ){
        return (<Login/>)
    }else {
        return (<Kiosk/>)
    }
}