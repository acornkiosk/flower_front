import axios from "axios"
import { useEffect, useState } from "react"
import { Button, CloseButton, Col, Container, Form, InputGroup, Modal, Row, Table } from "react-bootstrap"
import * as Icon from 'react-bootstrap-icons';

function Kiosk() {
  //화면 로딩시
  useEffect(() => {
    //table에 출력할 키오스크 정보를 받아옴
    axios.get("/api/kiosk/list")
      .then(res => {
        setKiosk(res.data.list)
      })
  }, [])
  //키오스크 정보를 저장하는 state
  const [kiosk, setKiosk] = useState([])
  //추가모달 state
  const [addModalShow, setAddModalShow] = useState(false)
  //수정 모달 state
  const [updateModalShow, setUpdateModalShow] = useState(false)
  // 수정시 data state
  const [data, setData] = useState({})
  // 체크박스 state
  const [checked, setChecked] = useState({})
  //추가 form
  const [location, setLocation] = useState("")
  //체크박스(선택된) 키오스크
  const [selectedKiosk, setSelectedKiosk] = useState([])
  //전체  체크박스 state
  const [allCheck, setAllCheck] = useState(false)
  //체크박스 체크시 호출 함수
  const handleCheckBoxChange = (e, item) => {
    const isChecked = e.target.checked
    setChecked({
      ...checked,
      [item.id]: isChecked
    })
    if (isChecked) {
      //체크된 키오스크 저장
      setSelectedKiosk([...selectedKiosk, item])
    } else {
      //체크된 키오스크에서 삭제
      let newState = selectedKiosk.filter(tmp => tmp.id !== item.id)
      setSelectedKiosk(newState)
    }
  }
  //전체 체크박스 체크시 호출 함수
  const handleAllCheckBox = (e) => {
    const isChecked = e.target.checked
    setAllCheck(isChecked)
    // 체크 상태에 따라 선택된 키오스크 배열 업데이트
    let newSelectedKiosk = []
    if (isChecked) {
      newSelectedKiosk = [...kiosk]
    }
    // checked 상태 업데이트
    const newChecked = {};
    kiosk.forEach(tmp => {
      newChecked[tmp.id] = isChecked
    })
    setChecked(newChecked)
    setSelectedKiosk(newSelectedKiosk)
  }
  //추가 요청 함수
  const addKiosk = () => {
    //키오스크 추가 옵션
    axios.post('/api/kiosk', { location: location })
      .then(res => {
        setKiosk(res.data.list)
        setAddModalShow(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  //수정 요청 함수
  const updateKiosk = () => {
    //키오스크 추가 옵션
    axios.post('/api/kiosk/update/location', data)
      .then(res => {
        let newState = kiosk.map(item => {
          if (item.id === data.id) {
            item.location = data.location
          }
          return item
        })
        setKiosk(newState)
        setUpdateModalShow(false)
      })
      .catch(error => {
        console.log(error)
      })
  }
  //수정 버튼 클릭 함수
  const showUpdateModal = (item) => {
    setUpdateModalShow(true)
    setData({
      id: item.id,
      location: item.location
    })
  }
  //input 값 변경시 location 업데이트
  const handleChange = (event) => {
    setLocation(event.target.value)
    setData({
      ...data,
      location: event.target.value
    })
  }
  //전원변경 함수
  const changePower = (data) => {
    //전원이 on이면
    if (data.power === "on") {
      //전원을 꺼준다
      axios.post("/api/kiosk/turnOff", data.id, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          let newState = kiosk.map(item => {
            if (item.id === data.id) {
              item.power = "off"
            }
            return item
          })
          setKiosk(newState)
        })
        .catch((error) => { console.log(error) })
    } else { //전원이 꺼져있다면
      //전원을 켜준다
      axios.post("/api/kiosk/turnOn", data.id, { headers: { "Content-Type": "application/json" } })
        .then(res => {
          let newState = kiosk.map(item => {
            if (item.id === data.id) {
              item.power = "on"
            }
            return item
          })
          setKiosk(newState)
        })
        .catch((error) => { console.log(error) })
    }
  }
  //삭제 버튼 기능
  const deleteKiosk = () => {
    //삭제하기 위한 키오스크 배열
    const kioskIdsToDelete = selectedKiosk.map((kiosk) => kiosk.id);

    selectedKiosk.forEach(tmp => {
      console.log(tmp)
      axios.post("/api/kiosk/delete", tmp,
        { headers: { "Content-Type": "application/json" } })
        .then(res => {
          let newKiosk = kiosk.filter(kiosk => !kioskIdsToDelete.includes(kiosk.id))
          setKiosk(newKiosk)
        })
        .catch(error => {
          console.log(error)
        })
    })
    //선택된 키오스크 초기화
    setSelectedKiosk([])
  }
  return (
    <Container>

      <Row className="justify-content-md-center">
        <Col>
          <h1>키오스크 관리 페이지</h1>
        </Col>
        <Col md="auto">
          <Button variant="success" className="me-3">전원 켜기</Button>
          <Button variant="danger" className="me-3">전원 끄기</Button>
          <Button className="me-3" onClick={() => { setAddModalShow(true) }}>추가하기</Button>
          <Button variant="warning" style={{ color: "white" }} onClick={deleteKiosk}>삭제하기</Button>
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
      {/* 키오스크 수정 modal */}
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
              <Button variant="primary" type="button" onClick={updateKiosk}>
                변경하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check type={`checkbox`} checked={allCheck} onChange={(e) => { handleAllCheckBox(e) }} />
            </th>
            <th>ID</th>
            <th>Location</th>
            <th>Power</th>
          </tr>
        </thead>
        <tbody>
          {kiosk.map(item =>
            <tr key={item.id}>
              <td>
                <Form.Check type={`checkbox`} id={item.id} checked={checked[item.id] || false} onChange={(e) => {
                  handleCheckBoxChange(e, item)
                }} />
              </td>
              <td className="justify-content-md-center">{item.id}</td>
              <td className="justify-content-md-center">{item.location} <Icon.Pencil onClick={() => showUpdateModal(item)} /></td>
              <td>{item.power}
                {item.power === "on" && <Icon.Power style={{ color: "green" }} onClick={() => { changePower(item) }} />}
                {item.power === "off" && <Icon.Power style={{ color: "red" }} onClick={() => { changePower(item) }} />}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  )
}


export default Kiosk