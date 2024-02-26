import { Route, Routes } from "react-router"
import Main from "./main"
import AddMenu from "./addMenu"
import UpdateMenu from "./updateMenu"

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