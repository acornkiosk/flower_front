import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Loading from '../loading';
import CategoryBtn from './categoryBtn';
import { Button, Col, Container, Row, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/** 실험중인 코드
 * 지금 'main.js' 파일이 겉보기엔 멀쩡해 보일 순 있으나 
 * 기능 추가시 'categoryBtn.js'까지 무한 루프 위기를 겪고 있음
 * 연관성 있는 지 보는 중
 */

/** HTML 본문 : 메뉴조회 전체 */ 
function Main() {

  /** 로딩실행 값을 true 로 만들고 끝나면 false 로 변환하기 */
  const [loading, setLoading] = useState(true);
  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 필터링된 메뉴 데이터 배열 변수 */
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  /** 삭제버튼 누를 경우 경고 메시지를 다음 모달 띄우기 */
  const [deleteModalShow, setDeleteModalShow] = useState(false)
  /** 삭제결과값을 가지고 안내메시지용 모달 띄우기 */

  const navigate= useNavigate()

  console.log("메뉴관리 : 메뉴정보 현황(menuList)")
  console.log(menuList)
  
  /** 화면에 접속하자마자 서버로부터 메뉴정보를 모두 가져오는 코드를 작성 */
  useEffect(() => {
    const fetchData = () =>{
      console.log("메뉴관리 : 화면에서 렌더링 요청중")

      /** 메뉴정보 전체 요청하기 */
      axios.post("/api/menu/list", {})
      .then(res=>{
        const menuData = res.data.list; // menuListResponse.data.list = [{},{},{}...]
        setMenuList(menuData)
        setFilteredMenuList(menuData)
      })
      .catch(error=>{console.error('메뉴관리 : 메뉴리스트 요청 오류:', error);})
      .finally(setLoading(false)) // 데이터 로딩이 완료되면 로딩 상태를 false로 변경
    }
    // fetchData 함수 호출
    fetchData();
    console.log("메뉴관리 : 화면에서 렌더링 완료")
  }, [menuList]); // [] 배열 안에 있는 값이 변화를 감지할 때만 함수가 호출됨

    /** 카테고리 드롭다운 박스에 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
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
        console.error('메뉴관리 : 화면측에서 카테고리 고른 정보 응답중에 문제생김 : ', e);
      }
      
    };
    
    // 로딩 중일 때 Spinner를 보여줌
    if (loading) {
      return <Loading/>;
    }

  //메뉴 수정 폼으로 가기
  const goToUpdateMenu = (MenuId)=>{
    navigate(`/menu/updateMenu/${MenuId}`)
  }
    
  // 메뉴등록 폼으로가기
    const goToAddMenu = () =>{
      navigate("/menu/addMenu")
  };

  /** 삭제처리 함수 */
  const deleteMenu= (id)=>{

    axios.post("/api/menu/delete", {"id": id},
    { headers: { "Content-Type": "application/json" }})
    .then(res => {
      console.log(res.data) // res.data = { {"dto":{...}}, {"list":null}, {"status": HttpStatus 결과값} }
      let isSuccess = res.data.status
      let name = res.data.dto.name

      if(isSuccess === "OK"){
        // 안내 메시지에 성공되었다 알리기
        
      }else{
        // 안내 메시지에 실패했다고 알리기 

      }

    })
    .catch(error=>{console.error('삭제과정 : 서버요청 오류', error);})
  }

  /** 화면 구현 */
  return (
    <Container>
    <Row>
      <Col className="d-flex justify-content-between">
        <Button variant="warning" onClick={goToAddMenu}>등록하기</Button>
        <CategoryBtn className="m" onSelectCategory={handleCategoryChange}></CategoryBtn>
      </Col>
    </Row>
    <Table striped bordered hover>
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
            <td><button onClick={()=>goToUpdateMenu(item.id)}>수정</button></td>
            <td><button onClick={()=>{setDeleteModalShow(true)}}>삭제</button></td>
          </tr>
        ))}
      </tbody>
    </Table>

    {/* 경고 메시지 */}
    <Modal 
      show={deleteModalShow} 
      onHide={setDeleteModalShow(false)}
      size="lg" 
      centered >
      <Modal.Header closeButton>
        <Modal.Title> 경고 </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>보고 계신 정보를 정말 삭제하시겠습니까?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={()=>{}}>삭제</Button>
        <Button variant="warning" onClick={()=>{}}>취소</Button>
      </Modal.Footer>
    </Modal>

    {/* 안내 메시지 */}
     <Modal size="lg" centered >
      <Modal.Header closeButton>
        <Modal.Title > 알림 </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>삭제되었습니다.</h4>
        <p>메뉴관리 페이지로 돌아가겠습니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={()=>{}}>확인</Button>
      </Modal.Footer>
    </Modal>
  </Container>
  );
}

export default Main;
