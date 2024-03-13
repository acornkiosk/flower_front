
import { useSelector } from "react-redux"
import Login from "./login"
import Order from "./Order"


export default function Home({isOrdered, setIsOrdered}) {
    const userName = useSelector(state => state.userName)
    return (
        <>
            {/* 주문관리로 변경 */}
            {localStorage.token && userName && <Order isOrdered={isOrdered} setIsOrdered={setIsOrdered}/>}
            {(!localStorage.token || !userName) && <Login/>}
        </>
    )
}