import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem
} from 'cdbreact';
import React, { useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import '../../App.js';

const Sidebar = () => {
  /** 주문정보 개수 */
  const [orderCount, setOrderCount] = useState(0)
  /** 주문정보 개수창 */
  const [show, setShow] = useState(false)
  /** 용도 : 주문현황 개수 실시간 표기 */
  const ws = new WebSocket("ws://flower.onleave.co.kr:9000/flower/ws/order")

  useEffect(() => {
    const connect = () => {
      ws.onopen = () => {
        console.log("사이드 바: 실시간 화면연동 시작(웹소켓)");
      };

      ws.onerror = () => {
        console.log("사이드 바: 화면 연동이 원활하게 이루어지지 않고 있습니다. 서버 확인이 필요합니다(웹소켓)");
        ws.onopen();
      };

      ws.onmessage = (msg) => {
        var count = JSON.parse(msg.data);

        if (count.type === "ORDER_COUNT") {
          console.log("사이드 바: " + count.num + "개 전달받음");
          setOrderCount(count.num);
          setShow(count.num > 0);
        }
      };
    };

    connect();
  }, []); // 한 번만 연결하도록 빈 배열을 넣음  

  useEffect(() => {
    setShow(orderCount > 0);
    console.log(show)
  }, [orderCount]); // orderCount가 변경될 때마다 호출되도록 의존성 배열에 추가

  const [activeMenu, setActiveMenu] = useState('');

  const toggleAccordion = (menuName) => {
    setActiveMenu(activeMenu === menuName ? '' : menuName);
  };
  const activeStyle = ({ isActive, isPending }) => {
    if (isPending) {
      return "pending";
    } else if (isActive) {
      return "activeClicked";
    } else {
      return "";
    }
  };

  const navigate = useNavigate();

  const home = () => {
    navigate("/")
  }
  const isLogin = useSelector(state => state.isLogin)
  const rank = useSelector(state => state.rank)
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
          <CDBSidebarMenu>
            <NavLink onClick={() => toggleAccordion('dash')} to="/dash" className={activeStyle}>
              <CDBSidebarMenuItem icon="th-large">대쉬보드</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('kiosk')} to="/kiosk" className={activeStyle}>
              <CDBSidebarMenuItem icon="tablet">키오스크 관리</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('user')} to="/user" className={activeStyle}>
              <CDBSidebarMenuItem icon="address-book">직원 관리</CDBSidebarMenuItem>
            </NavLink>
            <NavLink onClick={() => toggleAccordion('order')} to="/order" className={activeStyle}>
              <CDBSidebarMenuItem icon="money-check">주문 관리{show && <Badge bg="warning" >{orderCount}</Badge>}</CDBSidebarMenuItem>
            </NavLink>

            <div>
              <NavLink to="/menu" className={activeStyle} >
                <CDBSidebarMenuItem
                  icon="boxes"
                  onClick={() => toggleAccordion('menu')}
                >
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