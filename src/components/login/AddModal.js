import axios from "axios";
import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function AddModal(props) {
  //여기서 모달을 숨기고 싶으면 props.setshow(false) 가 실행되면 된다
  const { setshow, refresh } = props
  // 사장(owner) 추가
  const ownerInsert = () => {
    axios.post("/api/user/add", ownerdata)
      .then(res => {
        alert(res.data.dto.id + "님(owenr) 등록 되었습니다.")
        setshow(false)
        refresh()
      })
      .catch(error => {
        console.log(error);
      });
  };
  //사장 (owner) input값 
  const ownerChange = (e) => {
    setOwnerdata({
      ...ownerdata,
      [e.target.name]: e.target.value
    });
  };
  //사장님(owner) 추가 
  const [ownerdata, setOwnerdata] = useState({
    userName: "",
    id: "",
    password: "",
    rank: 3002 // 초기값으로 설정해야 할 경우 여기에 넣으세요
  });
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          사장님(owner) 추가
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 이름 : </Form.Label>
          <Col md="10"><Form.Control type='text' name="userName" onChange={ownerChange} placeholder="userName" /></Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 아이디 : </Form.Label>
          <Col md="10"><Form.Control type='text' name='id' onChange={ownerChange} placeholder="ID 입력해주세요" /></Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 비밀번호 : </Form.Label>
          <Col md="10"><Form.Control type='password' name='password' onChange={ownerChange} placeholder="Password" /></Col>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={ownerInsert}>등록</Button>
        <Button variant="outline-danger" onClick={() => { setshow(false) }} >Close</Button>
      </Modal.Footer>
    </Modal>
  );
}