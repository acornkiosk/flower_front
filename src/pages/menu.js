import { Route, Routes } from "react-router"
import Main from "../components/menu/main"
import AddMenu from "../components/menu/addMenu"
import UpdateMenu from "../components/menu/updateMenu"
import { useSelector } from "react-redux"
import Error from "./Error"

export default function Menu() {
  const role = useSelector(state => state.role)
  if (role.includes("4002")) {
    return (
      <Routes path="/menu">
        <Route path="/" element={<Main />} />
        <Route path="/addMenu" element={<AddMenu />} />
        <Route path="/updateMenu/:menuId" element={<UpdateMenu />} />
      </Routes>
    )
  }
  else {
    return (
      <Error />
    )
  }
}