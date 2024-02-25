import { Route, Routes } from "react-router"
import  MenuTable from "./menuTable"
import AddMenu from "./addMenu"

function Main() {
  return (
   
    <Routes path="/menu">
      <Route path="/" element={< MenuTable />} />
      <Route path="/addMenu" element={<AddMenu />} />
    </Routes>
   
  )
}

export default Main