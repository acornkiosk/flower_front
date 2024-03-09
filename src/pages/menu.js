import { Route, Routes } from "react-router"
import Main from "../components/menu/main"
import AddMenu from "../components/menu/addMenu"
import UpdateMenu from "../components/menu/updateMenu"

function Menu() {
  return (
   
    <Routes path="/menu">
      <Route path="/" element={<Main />} />
      <Route path="/addMenu" element={<AddMenu />} />
      <Route path="/updateMenu/:menuId" element={<UpdateMenu />} />
    </Routes>
   
  )
}

export default Menu