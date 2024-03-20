
import { useSelector } from "react-redux"
import Login from "./login"
import Order from "./Order"


export default function Home(props) {
    const userName = useSelector(state => state.userName)
    /** 주문개수 SideBar.js 로 보내기 */
    const { orderCount, setOrderCount } = props
    return (
        <>
            {/* 주문관리로 변경 */}
            {localStorage.token && userName && <Order orderCount={orderCount} setOrderCount={setOrderCount}/>}
            {(!localStorage.token || !userName) && <Login/>}
        </>
    )
}