import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap"
import { DashCircle, PlusCircle } from "react-bootstrap-icons"
import { useSelector, useDispatch } from "react-redux"

export default function Menu(props) {
  const commonTable = useSelector(state => state.commonTable)
  const orders = useSelector(state => state.orders)
  const dispatch = useDispatch();
  const { category } = props
  const [menu, setMenu] = useState([])
  const [selectedMenu, setSelectedMenu] = useState({})
  const [showModal, setShowModal] = useState(false)
  //기타 옵션 
  const [checked, setChecked] = useState({})
  //개인 옵션
  const [wrap, setWrap] = useState(0)
  //포장 옵션
  const [bag, setBag] = useState(0)
  const [options, setOptions] = useState({
    etc: [],
    bag: [],
    self: []
  })
  //메뉴 개수 state
  const [count, setCount] = useState(1)
  //장바구니
  const [cart, setCart] = useState([])
  //장바구니 추가
  const addCart = (item, options) => {
    //order_id는 장바구니에서 최종적으로 주문할때 추가
    //kiosk_id는 처음 키오스크에 로그인할때 부여하기로 결정 
    let list = orders
    const order = {
      kiosk_id: 2,
      menu_name: item.name,
      menu_price: item.price,
      menu_count: count,
      options: options
    }
    list.push(order)
    const action = {
      type: "UPDATE_ORDERS",
      payload: list
    }
    dispatch(action)
    closeModal()
  }
  //모달 닫는 함수
  const closeModal = () => {
    setShowModal(false)
    setCount(1)
    setChecked({})
    setBag(0)
    setWrap(0)
  }
  //상세 모달 열릴시 
  const openModal = (item) => {
    const list = []

    setSelectedMenu(item)

    for (let tmp of commonTable) {
      if (tmp.p_code_id === item.category_id) {
        list.push(tmp)
      }
    }
    setOptions({ ...options, self: list })
    setShowModal(true)
  }
  //체크박스 선택시 옵션 저장 함수
  const handleChange = (e, item) => {
    const isChecked = e.target.checked
    setChecked({
      ...checked,
      [item.code_id]: isChecked
    })
  }
  //옵션을 DB에 넣기 위해 리스트 형태로 변형
  const convertOption = () => {
    let result = ""
    if (wrap !== 0) {
      result += wrap + ", "
    }

    if (bag !== 0) {
      result += bag + ", "
    }

    let etcKeys = Object.keys(checked).filter(key => checked[key] === true)
    etcKeys.forEach(tmp => result += tmp + ", ")
    return result
  }
  //공통 option 설정
  useEffect(() => {
    const etcList = []
    const bagList = []
    for (let item of commonTable) {
      if (item.p_code_id === 2012) {
        etcList.push(item)
      }

      if (item.p_code_id === 2016) {
        bagList.push(item)
      }
    }
    setOptions({ ...options, etc: etcList, bag: bagList })
  }, [])
  
  //카테고리에 맞는 menu를 출력해쥐야함
  useEffect(() => {
    axios.post("/api/menu/list", { category_id: category })
      .then(res => setMenu(res.data.list))
      .catch(error => console.log(error))
  }, [])
  //개수 빼기 함수 
  const minus = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }
  //개수 추가 함수
  const plus = () => {
    if (count < 9) {
      setCount(count + 1)
    }
  }
  return (
    <>
      {
        menu.map(item =>
          <Card style={{ width: "23.5%" }} className="me-3">
            <Card.Img variant="top" src="/images/header.jpg" style={{ width: "100%" }} />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>{item.summary}</Card.Text>
              <Card.Text>{item.price}원</Card.Text>
              <Button variant="primary" onClick={() => {
                openModal(item)
              }}>주문하기</Button>
            </Card.Body>
          </Card>
        )
      }
      {/* 메뉴 상세 정보 modal */}
      <Modal size="lg" centered show={showModal} onHide={() => {
        setShowModal(false)
        setCount(0)
      }}>
        <Modal.Header closeButton>
          <Modal.Title>메뉴 상세정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col><Image src="/images/header.jpg" style={{ width: "100%" }} /></Col>
            <Col>
              <h1>{selectedMenu.name} {selectedMenu.price}원</h1>
              <h2>{selectedMenu.summary}</h2>
              <h3>{selectedMenu.description}</h3>
            </Col>
          </Row>
          <Row>
            <h1>{selectedMenu.category} 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.self.map(item =>
                <Col>
                  <Card className="me-3">
                    <Card.Img variant="top" src="/images/header.jpg" style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check inline label={item.code_name} type="radio" name="group1" value={item.code_id} onChange={(e) => { setWrap(e.target.value) }} />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </Row>
          <Row>
            <h1>기타 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.etc.map(item =>
                <Col>
                  <Card className="me-3">
                    <Card.Img variant="top" src="/images/header.jpg" style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check inline label={item.code_name} type="checkbox" checked={checked[item.code_id] || false} onChange={(e) =>
                          handleChange(e, item)
                        } />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </Row>
          <Row className="mt-3">
            <h1>포장 옵션</h1>
            <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {options.bag.map(item =>
                <Col>
                  <Card className="me-3">
                    <Card.Img variant="top" src="/images/header.jpg" style={{ width: "100%" }} />
                    <Card.Body>
                      <Card.Title>
                        <Form.Check inline label={item.code_name} name="group2" type="radio" value={item.code_id} onChange={(e) => { setBag(e.target.value) }} />
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              )}
            </Row>
          </Row>
          <Row className="text-end">
            <h1>
              <Button variant="link" size="lg" style={{ color: 'black' }} onClick={minus}><DashCircle /></Button>
              {count}
              <Button variant="link" size="lg" style={{ color: 'black' }} onClick={plus}><PlusCircle /></Button>
            </h1>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={closeModal}>닫기</Button>
            </Col>
            <Col md="auto">
              <Button variant="primary" type="button" onClick={() => {
                addCart(selectedMenu, convertOption())
              }}>
                추가하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}