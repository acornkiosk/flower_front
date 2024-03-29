
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from 'cdbreact';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../App.css';
import { Badge } from 'react-bootstrap';

const Sidebar = (props) => {
  //index.js redux 값 가져오는것
  const isLogin = useSelector(state => state.isLogin)
  const role = useSelector(state => state.role)
  const rank = useSelector(state => state.rank)
  /** 주문개수 */
  const { orderCount } = props
  //권한 관리 state => {"4001" : false, "4002" : false, "4003": false, "4004" : false}
  const [roleState, setRoleState] = useState({
    4001: false,
    4002: false,
    4003: false,
    4004: false
  })
  //role 값 가져와서 상태 변경
  useEffect(() => {
    setRoleState({
      ...roleState,
        4001: role.includes('4001')
      , 4002: role.includes('4002')
      , 4003: role.includes('4003')
      , 4004: role.includes('4004')
    })
  }, [isLogin, orderCount])
  const [activeMenu, setActiveMenu] = useState('');
  const toggleAccordion = (menuName) => {
    setActiveMenu(activeMenu === menuName ? '' : menuName);
  };
  const activeStyle = ({ isActive, isPending }) => {
    if (isPending) return "pending";
    else if (isActive) return "activeClicked";
    else return "";
  };
  const navigate = useNavigate();
  const home = () => {
    navigate("/")
  }
  //여기서 부터 super(관리자모드) 필요한 코드
  let count = 0;
  const superin = () => {
    count += 1;
    setTimeout(() => {
      count = 0;
    }, 1000)
    if (count === 5 && isLogin === true && rank == 3001) {
      count = 0;
      navigate("/owner")
    }
  }
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i onClick={() => { setActiveMenu("close") }} className="fa fa-bars fa-large"></i>}>
          <div onClick={home} className="text-decoration-none btn" style={{ color: 'inherit' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-flower2" viewBox="0 0 16 16">
              <path d="M8 16a4 4 0 0 0 4-4 4 4 0 0 0 0-8 4 4 0 0 0-8 0 4 4 0 1 0 0 8 4 4 0 0 0 4 4m3-12q0 .11-.03.247c-.544.241-1.091.638-1.598 1.084A3 3 0 0 0 8 5c-.494 0-.96.12-1.372.331-.507-.446-1.054-.843-1.597-1.084A1 1 0 0 1 5 4a3 3 0 0 1 6 0m-.812 6.052A3 3 0 0 0 11 8a3 3 0 0 0-.812-2.052c.215-.18.432-.346.647-.487C11.34 5.131 11.732 5 12 5a3 3 0 1 1 0 6c-.268 0-.66-.13-1.165-.461a7 7 0 0 1-.647-.487m-3.56.617a3 3 0 0 0 2.744 0c.507.446 1.054.842 1.598 1.084q.03.137.03.247a3 3 0 1 1-6 0q0-.11.03-.247c.544-.242 1.091-.638 1.598-1.084m-.816-4.721A3 3 0 0 0 5 8c0 .794.308 1.516.812 2.052a7 7 0 0 1-.647.487C4.66 10.869 4.268 11 4 11a3 3 0 0 1 0-6c.268 0 .66.13 1.165.461.215.141.432.306.647.487M8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg> Flower
          </div>
        </CDBSidebarHeader>
        {isLogin && <CDBSidebarContent className="sidebar-content">
          {
            roleState[4001] &&
            <CDBSidebarMenu>
              <NavLink onClick={() => toggleAccordion('dash')} to="/dash" className={activeStyle}>
                <CDBSidebarMenuItem icon="th-large">대쉬보드</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          }
          {
            roleState[4003] &&
            <CDBSidebarMenu>
              <NavLink onClick={() => toggleAccordion('kiosk')} to="/kiosk" className={activeStyle}>
                <CDBSidebarMenuItem icon="tablet">키오스크 관리</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          }
          {
            roleState[4001] &&
            <CDBSidebarMenu>
              <NavLink onClick={() => toggleAccordion('user')} to="/user" className={activeStyle}>
                <CDBSidebarMenuItem icon="address-book">직원 관리</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          }
          {
            roleState[4004] &&
            <CDBSidebarMenu>
              <NavLink onClick={() => toggleAccordion('order')} to="/order" className={activeStyle}>
                <CDBSidebarMenuItem icon="money-check">주문 관리 <Badge bg="primary">{orderCount}</Badge></CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          }
          {
            roleState[4002] &&
            <CDBSidebarMenu>
              <div>
                <NavLink to="/menu" className={activeStyle} >
                  <CDBSidebarMenuItem
                    icon="boxes"
                    onClick={() => toggleAccordion('menu')}>
                    메뉴 관리
                  </CDBSidebarMenuItem>
                </NavLink>
                {activeMenu === 'menu' && (
                  <div style={{ marginLeft: 20 }}>
                    <NavLink to="/menu" >
                      <CDBSidebarMenuItem>메뉴조회</CDBSidebarMenuItem>
                    </NavLink>
                    <NavLink to="/menu/addMenu">
                      <CDBSidebarMenuItem>등록하기</CDBSidebarMenuItem>
                    </NavLink>
                  </div>
                )}
              </div>
            </CDBSidebarMenu>
          }
        </CDBSidebarContent>}
        {isLogin && <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            <p onClick={superin}>Kiosk</p>
          </div>
        </CDBSidebarFooter>}
      </CDBSidebar>
    </div>
  );
};


export default Sidebar;