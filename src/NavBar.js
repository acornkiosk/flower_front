import React from "react";
import { Header } from "./NavBar.Style";
import { CDBNavbar } from "cdbreact";

const Navbar = () => {

   return (
        <Header style={{background:"#333", color:"#fff"}}>
          <CDBNavbar dark expand="md" scrolling className="justify-content-end">
            
            <div className="ml-auto">
              <i className="fas fa-bell"></i>
              <i className="fas fa-comment-alt mx-4"></i>
              
            </div>
          </CDBNavbar>
        </Header>
   );
}

export default Navbar;