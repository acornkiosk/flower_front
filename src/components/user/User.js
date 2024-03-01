/** 달력기능 */
import * as React from 'react';
import { Button, Form, Modal, Row, Col, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

/** 주석처리가 많은 이유 : 달력기능 npm install 오류 확인되어 임시조치 */
function User() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get("/api/user/list", {})
    .then(res=>{
      const userList = res.data.list;
      console.log(userList)
    })
    .catch(error=>{
      //console.error('사용자 관리 : 정보 리스트 요청 오류:', error);
    })

  }, [])

  return (
    <>
      <h1>사용자 관리 페이지 입니다.</h1>
      <Button variant="light" onClick={() => { setShow(true) }}>등록하기</Button>
      <Table striped>
        <thead>
          <tr>
            <th>이름</th>
            <th>직급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>오영찬</td>
            <td>사장</td>
            <td><button>관리하기 아이콘</button></td>
          </tr>
        </tbody>
      </Table>
      <InsertModal show={show} onHide={() => { setShow(false) }}></InsertModal>
    </>
  )
}
export default User

/** 사용자 정보 등록 모달 */
function InsertModal(props) {

  const navigate= useNavigate()
   
    const goToMenuMain = () =>{
       navigate("/user")
    };
  const [Rank,setRank]=useState([])
  const [regDate,setRegDate]=useState([])

  const getRank= ()=>{
    
    axios.post("/api/common/child", {"code_id": 3000},
    { headers: { "Content-Type": "application/json" } })
    .then(res => {
      console.log("직급 리스트:"+res.data.list)
      setRank(res.data.list)
    }) 
    .catch(error=>{
      console.log("직급리스트: "+ error)
    }) 
  }
 
  const userInput =(e)=>{
    e.preventDefault();
   
    const url = "/api/user/add";
    const formData = new FormData(e.target);

    axios.post(url, formData,
      { headers: { "Content-Type": "application/json" } })
        .then(res=>{
            console.log(res.data);
            props.onHide(); 
        })  
  }

  

  useEffect(() => {
    getRank()
    

  }, [])


  return (
    
    <Modal
      {...props}
      size="xl"
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Form onSubmit={(e)=>userInput(e)}>

        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>

        <Modal.Body >
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1"> 아이디 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='id' /></Col>
            <Form.Label column md="1"> 비밀번호 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='password' /></Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1" > 이름 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='userName' /></Col>
         
            <Form.Label column md="1" > 직급 : </Form.Label>
            <Col md="5">
              <Form.Select aria-label="직급" name='rank'>
                {Rank.map(item=>
                  <option value={item.code_id}>{item.code_name}</option>
                )}

              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>

            <Form.Label column md="1"  type="date"  > 입사일 : </Form.Label>
           
            <Col md="5">
            <input type="date" name="regdate" />

            </Col>
            <Form.Label column md="1"></Form.Label>
            <Col md="5"></Col>
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" type="submit">추가</Button>
          <Button variant="danger" onClick={props.onHide}>취소</Button>
        </Modal.Footer>

      </Form>

    </Modal>
  )
}

// /** 사용자 정보 수정 모달 */
// function updateModal(props){

// }

// /** 안내 메시지 모달 */
// function infoModal(props){

// }