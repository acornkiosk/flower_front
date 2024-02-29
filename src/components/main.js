import Header from "../container/Header";
import { useEffect, useState } from "react"
import KioskLogin from "./login/KioskLogin";

export default function Main() {
  //로그인을 먼저 해야함
  const [isLogin, setLogin] = useState(false)
  return (
    <div>
      {!isLogin && <KioskLogin/>}
      {isLogin && <Header/>}
    </div>
  )
}