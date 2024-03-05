
import Kiosk from "../pages/kiosk"
import Login from "./login/login"


export default function Home(){
    
    if(localStorage.token  == null ){
        return (<Login/>)
    }else {
        return (<Kiosk/>)
    }
}