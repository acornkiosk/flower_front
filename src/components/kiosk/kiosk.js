import axios from "axios"
import { useEffect, useState } from "react"
import { Button, CloseButton, Col, Container, Form, InputGroup, Modal, Row, Table } from "react-bootstrap"

function Kiosk() {
  //키오스크 정보를 저장하는 state
  const [kiosk, setKiosk] = useState([])
  //추가모달 state
  const [addModalShow, setAddModalShow] = useState(false)
  //추가 form
  const [location, setLocation] = useState("")
  //화면 로딩시
  useEffect(() => {
    //table에 출력할 키오스크 정보를 받아옴
    axios.get("/api/kiosk/list")
      .then(res => {
        setKiosk(res.data.list)
      })
  }, [])
  //추가 요청 함수
  const addKiosk = () => {
    //키오스크 추가 옵션
    axios.post('/api/kiosk', { location: location })
      .then(res => {
        setKiosk([...kiosk, res.data.dto])
        setAddModalShow(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  //input 값 변경시 location 업데이트
  const handleChange = (event) => {
    setLocation(event.target.value)
  }
  return (
    <Container>

      <Row className="justify-content-md-center">
        <Col>
          <h1>키오스크 관리 페이지 입니다.</h1>
        </Col>
        <Col md="auto">
          <Button onClick={() => { setAddModalShow(true) }}>추가하기</Button>
        </Col>
      </Row>
      {/* 키오스크 추가 modal */}
      <Modal size="lg" centered show={addModalShow} onHide={() => setAddModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>키오스크 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>키오스크 위치</InputGroup.Text>
            <Form.Control type="text" placeholder="키오스크 위치 입력" onChange={handleChange} />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={() => { setAddModalShow(false) }}>닫기</Button>
            </Col>
            <Col md="auto">
              <Button variant="primary" type="button" onClick={addKiosk}>
                추가하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Power</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {kiosk.map(item =>
            <tr key={item.id}>
              <td className="justify-content-md-center">{item.id}</td>
              <td className="justify-content-md-center">{item.location}</td>
              <td>{item.power}</td>
              <td>
                <CloseButton onClick={() => {
                  axios.post("/api/kiosk/delete", item.id,
                    { "Content-Type": "application/json" })
                  .then(res =>{
                    let newKiosk = kiosk.filter(kiosk =>  kiosk.id !== item.id)
                    console.log(newKiosk)
                  })
                }}></CloseButton>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}

export default Kiosk