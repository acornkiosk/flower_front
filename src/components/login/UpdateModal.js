import axios from "axios"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"

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
          <Form.Label column md="2"> 이름 </Form.Label>
          <Col md="3"><Form.Control type='text' name='userName' onChange={handleChange} value={item.userName} /></Col>
          <Form.Label column md="2"> 아이디 </Form.Label>
          <Col md="3"><Form.Control type='text' name='id' value={item.id} readOnly /></Col>
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