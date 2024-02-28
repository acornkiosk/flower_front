import React, { useState } from 'react';
import './App.css';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from 'cdbreact';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState('');

  const toggleAccordion = (menuName) => {
    setActiveMenu(activeMenu === menuName ? '' : menuName);
  };
  const activeStyle=({ isActive, isPending }) => {
    if (isPending) {
      return "pending";
    } else if (isActive) {
      return "activeClicked";
    } else {
      return "";
    }
  };

  return (
    <div style={{ display: 'flex' ,  height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Flower
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink onClick={() => toggleAccordion('login')} exact to="/login" className={activeStyle}>
              <CDBSidebarMenuItem icon="user">로그인</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('main')} exact to="/main" className={activeStyle}>
              <CDBSidebarMenuItem icon="tablet">키오스크 화면</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('kiosk')} exact to="/kiosk" className={activeStyle}>
              <CDBSidebarMenuItem icon="warehouse">키오스크 관리</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('user')} exact to="/user" className={activeStyle}>
              <CDBSidebarMenuItem icon="address-book">직원 관리</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('order')} exact to="/order" className={activeStyle}>
              <CDBSidebarMenuItem icon="money-check">주문 관리</CDBSidebarMenuItem>
            </NavLink>

            <div>
              <NavLink exact to="/menu" className={activeStyle} >
              <CDBSidebarMenuItem
                icon="boxes"
                onClick={() => toggleAccordion('menu')}
              >
                메뉴 관리
              </CDBSidebarMenuItem>
              </NavLink>
              {activeMenu === 'menu' && (
                <div style={{ marginLeft: 20 }}>
                  <NavLink exact to="/menu" >
                    <CDBSidebarMenuItem>메뉴조회</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact to="/menu/addMenu" activeClassName="activeClicked">
                    <CDBSidebarMenuItem>등록하기</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              )}
            </div>

          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Kiosk
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;