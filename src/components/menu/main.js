import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Pagination } from 'react-bootstrap';
import { PencilFill, XLg } from 'react-bootstrap-icons';
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import CategoryBtn from './categoryBtn';
import WarningModal from './WarningModal';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../../util/websocket';
=======
import { create } from '../../util/websocket';
>>>>>>> origin
import EmptyText from '../error/EmptyText';
import WarningModal from './WarningModal';
import CategoryBtn from './categoryBtn';


/** HTML 본문 : 메뉴조회 전체 */
function Main() {
  /** 필터링된 메뉴 데이터 배열 변수 */
  const [filteredMenuList, setFilteredMenuList] = useState({ list: [] });
  /** 삭제버튼 눌렀을 때 경고알림으로 사용할 변수 */
  const [warning, setWarning] = useState({
    menu_id: 0,
    category_id: 0,
    show: false
  });
  /** 등록과 수정폼 이동처리 변수 */
  const navigate = useNavigate()
  //페이징 UI를 만들때 사용할 배열
  const [pageArray, setPageArray] = useState([])
  const [categoryNum, setCategoryNum] = useState(0)
  const [sortByPrice, setSortByPrice] = useState(null);
  const [isEmpty, setEmpty] = useState(false)
  /** 웹소켓 객체 가져오기 */
  let ws = useSelector(state => state.ws)
  //페이징 UI를 만들때 사용할 배열을 리턴해주는 함수
  function createArray(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result
  }
  // 가격 클릭 시 정렬 기능 추가
  const handleSortByPrice = () => {
    // 정렬 방식이 오름차순인 경우 내림차순으로 변경하고, 그 반대의 경우는 오름차순으로 변경
    const newSortByPrice = sortByPrice === 'asc' ? 'desc' : (sortByPrice === 'desc' ? null : 'asc');
    setSortByPrice(newSortByPrice);
  };
  const refresh = (pageNum, category_id, sortByPrice) => {
    axios.post("/api/menu/list", { pageNum: pageNum, category_id: category_id, sort: sortByPrice })
      .then(res => {
        setEmpty(false)
        setFilteredMenuList(res.data)
        //페이징 UI출력
        const result = createArray(res.data.startPageNum, res.data.endPageNum)
        setPageArray(result)
      })
      .catch(error => {
        setEmpty(true)
        console.log(error)
      })
  }
  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    //qeury 파라미터 값을 읽어와 본다.
    let pageNum = 1
    //만일 존재 하지 않는다면 1페이지로 설정
    let category_id = categoryNum.code_id
    if (category_id == null) category_id = 0
    refresh(pageNum, categoryNum.code_id, sortByPrice)
    /** WebSocket.js */
    setToast(ws, (result) => {
      if (result.type === "SET_TOAST") {
        dispatch({ type: "SET_TOAST", payload: { isToast: true } })
      }
    })
  }, [categoryNum, sortByPrice,ws]); // [] 배열 안에 있는 값이 변화를 감지할 때만 함수가 호출됨
  /** 카테고리 드롭다운 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
  const handleCategoryChange = (item) => {
    setCategoryNum(item)
  };
  const dispatch = useDispatch()
  /** 메뉴 수정 폼으로 가기 */
  const goToUpdateMenu = (MenuId) => {
    navigate(`/menu/updateMenu`)
    sessionStorage.setItem("MenuId", MenuId)
    let storage_menuId = sessionStorage.getItem("MenuId")
<<<<<<< HEAD

=======
>>>>>>> origin
    dispatch({ type: "SELECT_MENU", payload: storage_menuId })
  }
  /** 메뉴등록 폼으로가기 */
  const goToAddMenu = () => {
    navigate("/menu/addMenu")
  };
  //메뉴 삭제 함수
  const deleteMenu = (id) => {
    axios.post("/api/menu/delete", { id: id })
      .then(res => {
        setWarning(false)
        // 삭제가 성공하면 상태를 업데이트하고 UI를 새로 고칩니다.
        setFilteredMenuList(prevState => ({
          ...prevState,
          list: prevState.list.filter(item => item.id !== id) // 삭제된 메뉴를 제외한 새로운 목록으로 업데이트
        }));
        refresh(1, categoryNum.code_id, sortByPrice)
      })
      .catch(error => console.log(error))
  }
  /** 화면 구현 */
  return (
    <div>
      <h1>메뉴관리</h1>
      <hr />
      <div className="d-flex justify-content-between">
        <Button variant="warning" onClick={goToAddMenu}>등록하기</Button>
        <CategoryBtn className="m" onSelectCategory={handleCategoryChange}></CategoryBtn>
      </div>
      <Table striped>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>상품명</th>
            <th onClick={handleSortByPrice} style={{ cursor: 'pointer' }}>가격
              {sortByPrice == null ?
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '13px', marginBottom: '2px' }} viewBox="0 0 320 512"><path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" /></svg>
                : (
                  sortByPrice === 'asc' ?
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '13px', marginBottom: '2px' }} viewBox="0 0 320 512"><path d="M182.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '13px', marginBottom: '2px' }} viewBox="0 0 320 512"><path d="M182.6 470.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128z" /></svg>
                )
              }
            </th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenuList.list.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price + "원"}</td>
              <td><Button variant="" onClick={() => goToUpdateMenu(item.id)}><PencilFill /></Button></td>
              <td><Button variant="" onClick={() => { setWarning({ menu_id: item.id, category_id: item.category_id, show: true }) }}><XLg /></Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isEmpty ? <EmptyText message={'메뉴가 없습니다.'} /> :
        <Pagination className="mt-3">
          <Pagination.Item onClick={() => {
            refresh(filteredMenuList.startPageNum - 1, categoryNum.code_id, sortByPrice)
          }} disabled={filteredMenuList.startPageNum === 1}>&laquo;</Pagination.Item>
          {
            pageArray.map(item => (<Pagination.Item onClick={() => {
              refresh(item, categoryNum.code_id, sortByPrice)
            }} key={item} active={filteredMenuList.pageNum === item}>{item}</Pagination.Item>))
          }
          <Pagination.Item onClick={() => {
            refresh(filteredMenuList.endPageNum + 1, categoryNum.code_id, sortByPrice)
          }} disabled={filteredMenuList.endPageNum >= filteredMenuList.totalPageCount}>&raquo;</Pagination.Item>
        </Pagination>
      }
      <WarningModal show={warning.show} value_id={warning.menu_id} onHide={() => setWarning({ show: false })} deletemenu={deleteMenu}></WarningModal>
    </div>
  );
}

export default Main;