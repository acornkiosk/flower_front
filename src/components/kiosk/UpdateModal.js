import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap"

export default function UpdateModal(props) {
  const { updateModalShow, setUpdateModalShow, data, handleChange, updateKiosk } = props
  return (
    <>
      <Modal size="lg" centered show={updateModalShow} onHide={() => setUpdateModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{data.id}번 키오스크 위치 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>키오스크 번호</InputGroup.Text>
            <Form.Control type="text" value={data.id} readOnly />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>키오스크 위치</InputGroup.Text>
            <Form.Control type="text" value={data.location} onChange={handleChange} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={() => { setUpdateModalShow(false) }}>닫기</Button>
            </Col>
            <Col md="auto">
              <Button variant="primary" type="button" onClick={() => { updateKiosk('location') }}>
                변경하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}