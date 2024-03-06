import axios from 'axios';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import CategoryBtn from './categoryBtn';
import { Button, Modal, Pagination } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  /** 삭제처리 이후 안내설명으로 사용할 변수 */
  const [info, setInfo] = useState({
    title: "",
    header: "",
    body: "",
    show: false
  })
  /** 삭제 프로세스 함수 실행여부 */
  const [deleteProcess, SetDeleteProcess] = useState(false)

  /** 등록과 수정폼 이동처리 변수 */
  const navigate = useNavigate()


  //페이징 UI를 만들때 사용할 배열
  const [pageArray, setPageArray] = useState([])

  const [categoryNum, setCategoryNum] = useState(0)

  //페이징 UI를 만들때 사용할 배열을 리턴해주는 함수
  function createArray(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result
  }



  const refresh = (pageNum, category_id) => {
    axios.post("/api/menu/list", { pageNum: pageNum, category_id: category_id })
      .then(res => {
        setFilteredMenuList(res.data)

        //페이징 UI출력
        const result = createArray(res.data.startPageNum, res.data.endPageNum)
        setPageArray(result)
      })
      .catch(error => {
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
    refresh(pageNum, category_id)

  }, [categoryNum]); // [] 배열 안에 있는 값이 변화를 감지할 때만 함수가 호출됨

  /** 카테고리 드롭다운 버튼을 눌렀을 때 그 값을 변수에 담는 함수이자 component 함수 연결고리 */
  const handleCategoryChange = (item) => {
    setCategoryNum(item)

  };

  /** 메뉴 수정 폼으로 가기 */
  const goToUpdateMenu = (MenuId) => {
    navigate(`/menu/updateMenu/${MenuId}`)
  }

  /** 메뉴등록 폼으로가기 */
  const goToAddMenu = () => {
    navigate("/menu/addMenu")
  };

  /** 삭제처리 로직 */
  if (deleteProcess) { // call : props.deleteMenu(true)

    axios.post("/api/menu/delete", { "id": warning.menu_id },
      { headers: { "Content-Type": "application/json" } })
      .then(res => {
        let isSuccess = res.data.status

        if (isSuccess === "OK") {
          // 안내 메시지에 성공되었다 알리기
          setInfo({
            title: "알림",
            header: "삭제되었습니다.",
            body: "메뉴관리 페이지로 돌아가겠습니다.",
            show: true
          })
          setWarning({
            menu_id: 0,
            category_id: 0,
            show: false
          })
          SetDeleteProcess(false)
          // 삭제가 성공했을 때 화면 갱신
          refresh(1, categoryNum.code_id);

        } else {
          // 안내 메시지에 실패했다고 알리기 
          setInfo({
            title: "알림",
            header: "삭제가 실패되었습니다.",
            body: "정보를 확인해주세요",
            show: true
          })
          setWarning({
            menu_id: 0,
            category_id: 0,
            show: false
          })
          SetDeleteProcess(false)
        }

      })
      .catch(error => {
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
          {filteredMenuList.list.map(item => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td><Button onClick={() => goToUpdateMenu(item.id)}>수정</Button></td>
              <td><Button onClick={() => { setWarning({ menu_id: item.id, category_id: item.category_id, show: true }) }}>삭제</Button></td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="mt-3">
        <Pagination.Item onClick={() => {
          refresh(filteredMenuList.startPageNum - 1, categoryNum.code_id)
          //setParams({pageNum:filteredMenuList.startPageNum-1})
        }} disabled={filteredMenuList.startPageNum === 1}>&laquo;</Pagination.Item>
        {
          pageArray.map(item => (<Pagination.Item onClick={() => {
            //setParams({pageNum: item})
            refresh(item, categoryNum.code_id)
          }} key={item} active={filteredMenuList.pageNum === item}>{item}</Pagination.Item>))
        }
        <Pagination.Item onClick={() => {
          refresh(filteredMenuList.endPageNum + 1, categoryNum.code_id)
          //setParams({pageNum:filteredMenuList.endPageNum+1})
        }} disabled={filteredMenuList.endPageNum >= filteredMenuList.totalPageCount}>&raquo;</Pagination.Item>
      </Pagination>

      <WarningModal show={warning.show} value_id={warning.menu_id} onHide={() => setWarning({ show: false })} deletemenu={() => SetDeleteProcess(true)}></WarningModal>
      <InfoModal show={info.show} title={info.title} header={info.header} body={info.body} onHide={() => {
        setInfo({ show: false })
        refresh(1)
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
        <Button variant="danger" onClick={props.deletemenu}>삭제</Button>
        <Button variant="warning" onClick={props.onHide}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}

/** 안내 메시지 */
function InfoModal(props) {

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

