import axios from "axios"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import User from "../../pages/User"

export default function UpdateModal(props) {
  const { item, setCurrentItem, refresh, setshow } = props
  //모달창에 입력값 바뀌면 state 값 바꾸기
  const handleChange = (e) => {
    setCurrentItem({
      ...item,
      [e.target.name]: e.target.value
    })
  }
  const handleSave = () => {
    axios.post("/api/user/update", item)
      .then(res => {
        //회원 목록 보기로 이동
        refresh()
        setshow(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          사장님 정보 수정
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6"> 이름 : <strong> {item.userName} </strong></Form.Label>
          <Form.Label column md="2"> 이름 변경:  </Form.Label>
          <Col md="4"><Form.Control type='text' name='userName' onChange={handleChange}placeholder="이름 입력" /></Col>
         </Form.Group>
          <Form.Group as={Row} className="mb-3">
          <Form.Label column md="6"> 아이디 :<strong> {item.id} </strong></Form.Label>
          <Form.Label column md="2"> 아이디 변경:  </Form.Label>
          <Col md="4"><Form.Control type='text' name='newId'  onChange={handleChange} placeholder="아이디 입력"/></Col>
       
        </Form.Group>
        <Form.Group as={Row} className="mb-6">
          <Form.Label column md="6"> </Form.Label>
          <Form.Label column md="2"> 비밀번호 변경:</Form.Label>
          <Col md="4"><Form.Control type='text' name='password'  onChange={handleChange} placeholder="비밀번호 입력"/></Col>
    
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          handleSave()
        }}>수정</Button>
        <Button onClick={() => {
          setshow(false)
        }}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}