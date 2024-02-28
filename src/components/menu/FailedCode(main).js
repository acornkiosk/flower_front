import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Loading from '../loading';
import CategoryBtn from './categoryBtn';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

/**
 * 실패한 코드
 * 참고용으로 쓰기 위해 살려둠
 * 1. 서버에서 삭제한 사실을 확인하지 않고 요청 후 성공이라 함
 * 2. 안내 모달 이후 화면 초기화 실패
 */

/** HTML 본문 : 메뉴조회 전체 */ 
function Main() {

  /** 로딩실행 값을 true 로 만들고 끝나면 false 로 변환하기 */
  const [loading, setLoading] = useState(true);
  /** 서버에서 가져온 데이터 배분 배열 변수 */ 
  const [menuList, setMenuList] = useState([]);
  /** 필터링된 메뉴 데이터 배열 변수 */
  const [filteredMenuList, setFilteredMenuList] = useState([]);
  /** 삭제버튼 눌렀을 때 경고알림으로 사용할 변수 */
  const [warning, setWarning] = useState({
    menu_id:0,
    category_id:"",
    show:false
  });
  /** 삭제처리 이후 안내설명으로 사용할 변수 */
  const [info, setInfo] = useState(false)

  /** 등록과 수정폼 이동처리 변수 */
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
        console.error('Error handling category change:', e);
      }
      
    };
    
    /** 로딩 중일 때 Spinner를 보여줌 */ 
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

  /** 삭제완료 안내 모달 */
  const callInfoModal = (call) => {
    if(call){
      setWarning({show:false})
      setInfo(true)
    }else{
      setInfo(false)
    }
  }

  /** 삭제 완전처리 후 웹브라우저 정보 최신화 */
  const reloading = (id) => {

    /** 메뉴정보 전체 다시 요청하기 */
    axios.post("/api/menu/list", {})
    .then(res=>{
      /** menuData = [{},{},{}...] */ 
      const DB = res.data.list; 

      /** 최신화된 데이터 보존용 */
      setMenuList(DB)

    })
    .catch(error=>{console.error('에헤이~ 삭제 다 했는데 막판에 뭐여 조졌네 이거', error);})

    const filtered = menuList.filter(menu => menu.category_id === id)
    
    // 새로운 배열을 상태로 설정
    setFilteredMenuList(filtered)

    // setWarning 정보 초기화
    setWarning({
      id:0,
      category:"",
      show:false
    })
    // 알림창 닫기 
    setInfo(false)
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
              <td><button onClick={()=>goToUpdateMenu(item.id)}>수정</button></td>
              <td><button onClick={()=>{setWarning({menu_id:item.id, category_id:item.category_id, show:true})}}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </Table>
      <WarningModal show={warning.show} value_id={warning.menu_id} onHide={()=>setWarning({show:false})} success={callInfoModal}></WarningModal>
      <InfoModal show={info} value_id={warning.menu_id}  onHide={()=>setInfo(false)} reload={reloading}></InfoModal>
    </div>
  );
}

export default Main;

/** 경고 메시지 */
function WarningModal(props) {

const deleteMenu= (id)=>{
  axios.post("/api/menu/delete", {"id": id},
  { headers: { "Content-Type": "application/json" }})
  .then(res => {
    console.log(res.data)
    props.success(true)
  })
  .catch(error=>{console.error('제발 삭제하게 해주세요.', error);})
}

  return (
    <Modal
      {...props} 
      /** 
       * 경고문 Warning: Unknown event handler property `onSave`. It will be ignored. 
       * ㄴ> 임의로 만든 'onSave' 라는 함수명은 없어서 나온 경고문이다. 무시해도 된다. 
      */
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          경고
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>보고 계신 정보를 정말 삭제하시겠습니까?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={()=>{deleteMenu(props.value_id)}}>삭제</Button>
        <Button variant="warning" onClick={props.onHide}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 안내 메시지 */
function InfoModal(props){

const deleteFinish = (id) => {
  try{
    props.reload(id)

  }catch(e){
    console.error('아니 이제 정보 다 지웠는데 무슨 일이야 : ', e);
  }
}

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          알림
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>삭제되었습니다.</h4>
        <p>
          메뉴관리 페이지로 돌아가겠습니다.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="warning" onClick={()=>{deleteFinish(props.value_id)}}>확인</Button>
      </Modal.Footer>
    </Modal>
  );
}

