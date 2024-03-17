import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

export default function AddModal(props) {
  const { addModalShow, setAddModalShow, combinedHandleChange, addKiosk, isLocationValid } = props
  const [currentLocation, setCurrentLocation] = useState("");

  // 모달이 열릴 때마다 위치 초기화
  useEffect(() => {
    if (addModalShow) {
      setCurrentLocation("");
    }
  }, [addModalShow]);

  return (
    <>
      <Modal size="lg" centered show={addModalShow} onHide={() => { setAddModalShow(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>키오스크 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>키오스크 위치</InputGroup.Text>
            <Form.Control type="text" placeholder="키오스크 위치 입력" value={currentLocation}
              onChange={(e) => {
                setCurrentLocation(e.target.value); // 현재 위치 상태 업데이트
                combinedHandleChange(e);
              }}
              disabled={!addModalShow} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={() => { setAddModalShow(false) }}>닫기</Button>
            </Col>
            <Col md="auto">
              <Button variant="primary" type="button" onClick={addKiosk} disabled={!isLocationValid || !currentLocation}>
                추가하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}