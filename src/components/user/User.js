/** 달력기능 */
import * as React from 'react';
import { Button, Form, Modal, Row, Col, Table } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

/** 주석처리가 많은 이유 : 달력기능 npm install 오류 확인되어 임시조치 */
function User() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get("/api/user/list", {})
      .then(res => {
        const userList = res.data.list;
        console.log(userList)
      })
      .catch(error => {
        console.error('사용자 관리 : 정보 리스트 요청 오류:', error);
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

  return (
    <Modal
      {...props}
      size="xl"
      dialogClassName="modal-90w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Form>

        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1"> 아이디 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='id' /></Col>
            <Form.Label column md="1"> 비밀번호 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='password' /></Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1" > 이름 : </Form.Label>
            <Col md="5"><Form.Control type='text' name='id' /></Col>
            <Form.Label column md="1" > 직급 : </Form.Label>
            <Col md="5">
              <Form.Select aria-label="여기는 누르기 전에 UI 상에 보여질 정보를 입력하는 곳" name='rank'>
                <option value="0">반복문 사용해서 하나씩 배치되도록 코딩하면 될거야</option>
                <option value="1">3000번대 데이터 나열하기</option>
                <option value="2">우리팀 엑셀 공통코드 참고하기</option>
                <option value="3">직급종류</option>
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column md="1" type="date"> 입사일 : </Form.Label>
            <Col md="5">
              <input type="date" />
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