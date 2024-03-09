
import { useSelector } from "react-redux"
import Kiosk from "./kiosk"
import Login from "./login"


export default function Home() {
    const userName = useSelector(state => state.userName)
    return (
        <>
            {/* 주문관리로 변경 */}
            {localStorage.token && userName && <Kiosk />}
            {(!localStorage.token || !userName) && <Login/>}
        </>
    )
}