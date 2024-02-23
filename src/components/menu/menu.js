import { Route, Routes } from "react-router"
import Main from "./main"
import AddMenu from "./addMenu"

function Order() {
  return (
   
    <Routes path="/menu">
      <Route path="/" element={<Main />} />
      <Route path="/addMenu" element={<AddMenu />} />
    </Routes>
   
  )
}

export default Order