import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import CategoryBtn from './categoryBtn';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/** HTML 본문 : 메뉴조회 전체 */ 
function Main() {

  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 필터링된 메뉴 데이터 배열 변수 */
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  /** 삭제버튼 눌렀을 때 경고알림으로 사용할 변수 */
  const [warning, setWarning] = useState({
    menu_id:0,
    category_id:0,
    show:false
  });
  /** 삭제처리 이후 안내설명으로 사용할 변수 */
  const [info, setInfo] = useState({
    title:"",
    header:"",
    body:"",
    show:false
  })
  /** 삭제 프로세스 함수 실행여부 */
  const [deleteProcess, SetDeleteProcess] = useState(false)


  /** 등록과 수정폼 이동처리 변수 */
  const navigate= useNavigate()
  const refresh = ()=>{
    /** 메뉴정보 전체 요청하기 */
    axios.post("/api/menu/list", {})
    .then(res=>{
      const menuDB = res.data.list; // menuListResponse.data.list = [{},{},{}...]
      setMenuList(menuDB)
      setFilteredMenuList(menuDB)
    })
    .catch(error=>{
      console.error('메뉴관리 : 메뉴리스트 요청 오류:', error);
    })
  }
  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    refresh()
  }, []); // [] 배열 안에 있는 값이 변화를 감지할 때만 함수가 호출됨

    /** 카테고리 드롭다운 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
    const handleCategoryChange = (item) => {
      try{
        if(item === 1000 || item === 0){

          // 아무 작업 없이 원본 데이터를 그대로 유지
          setFilteredMenuList(menuList);
        }else{
  
          // item.code_id와 일치하는 데이터만을 추려서 새로운 배열 생성
          const filtered = menuList.filter(menu => menu.category_id === item.code_id);
          // 새로운 배열을 상태로 설정
          setFilteredMenuList(filtered);
        }
      }catch (e) {
        console.error('메뉴관리 : 카테고리 드롭다운 버튼에서 가져온 값이 이상함', e);
      }
      
    };

  /** 메뉴 수정 폼으로 가기 */
  const goToUpdateMenu = (MenuId)=>{
    navigate(`/menu/updateMenu/${MenuId}`)
  }
    
  /** 메뉴등록 폼으로가기 */ 
    const goToAddMenu = () =>{
      navigate("/menu/addMenu")
  };

  /** 삭제처리 로직 */
  if(deleteProcess){ // call : props.deleteMenu(true)

      axios.post("/api/menu/delete", {"id": warning.menu_id},
      { headers: { "Content-Type": "application/json" }})
      .then(res=>{
        let isSuccess = res.data.status

        if(isSuccess === "OK"){
          // 안내 메시지에 성공되었다 알리기
          setInfo({
            title:"알림",
            header:"삭제되었습니다.",
            body:"메뉴관리 페이지로 돌아가겠습니다.",
            show:true
          })
          setWarning({
            menu_id:0,
            category_id:0,
            show:false
          })
          SetDeleteProcess(false)
        }else{
          // 안내 메시지에 실패했다고 알리기 
          setInfo({
            title:"알림",
            header:"삭제가 실패되었습니다.",
            body:"정보를 확인해주세요",
            show:true
          })
          setWarning({
            menu_id:0,
            category_id:0,
            show:false
          })
          SetDeleteProcess(false)
        }

      })
      .catch(error=>{
        console.error('삭제과정 : 서버요청 오류', error);
      })
  }



  /** 화면 구현 */
  return (
      <div>
        <div className="d-flex justify-content-between">
        <Button variant="warning" onClick={goToAddMenu}>등록하기</Button>
        <CategoryBtn className="m" onSelectCategory={handleCategoryChange}></CategoryBtn>
        </div>
      <Table striped>
        <thead>
          <tr>
            <th>카테고리</th>
            <th>상품명</th>
            <th>가격</th>
            <th>수정</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenuList.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><Button onClick={()=>goToUpdateMenu(item.id)}>수정</Button></td>
              <td><Button onClick={()=>{setWarning({menu_id:item.id, category_id:item.category_id, show:true})}}>삭제</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <WarningModal show={warning.show} value_id={warning.menu_id} onHide={()=>setWarning({show:false})} deleteMenu={()=>SetDeleteProcess(true)}></WarningModal>
      <InfoModal show={info.show} title={info.title} header={info.header} body={info.body} onHide={()=>{
        setInfo({show:false})
        refresh()
      }} ></InfoModal>
    </div>
  );
}

export default Main;

/** 경고 메시지 */
function WarningModal(props) {

  return (
    <Modal
      {...props} 
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title >
          경고
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>보고 계신 정보를 정말 삭제하시겠습니까?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.deleteMenu}>삭제</Button>
        <Button variant="warning" onClick={props.onHide}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 안내 메시지 */
function InfoModal(props){

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title >{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{props.header}</h4>
        <p>{props.body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={props.onHide}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}

