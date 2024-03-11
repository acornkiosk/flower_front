import axios from "axios"
import { Button, CloseButton, Col, Modal, Row } from "react-bootstrap"
import ConvertOptions from "./util"
import React from "react"

export default function DetailModal(props) {
  let order_id
  let kiosk_id
  if (props.data.length !== 0) {
    order_id = props.data[0].order_id
    kiosk_id = props.data[0].kiosk_id
  }
  /** DetailModal.js <--> Order.js <--> orderItem.js  */
  const { setShowModal } = props
  const { setDeleteModal } = props

  //완료버튼을 누를시 
  function onCompleted() {
    for (let item of props.data) {
      item.is_completed = 'true'
      console.log(item)
      axios.post("/api/order/update", item)
        .then(res => {
          if (res.data.status === 'OK') {
            console.log("부자되자!")
            setDeleteModal({target:item.order_id})
          }
        })
        .catch(error => console.log(error))
    }
    setShowModal(false)
  }

  //주문취소 버튼을 누를시
  function onDelete() {
    console.log(order_id)
    axios.post("/api/order/deleteAll", { order_id: order_id })
      .then(res => {
        if (res.data.status === 'OK') {
          console.log("배가 불렀네")
          setShowModal(false)
        }
      })
    setDeleteModal({target:order_id})
  }

  return (
    <Modal
      show={props.show}
      size="lg"
      centered
    >
      <Modal.Header className="d-flex">
        <Modal.Title className="flex-fill" >
          <Row className="justify-content-between">
            <Col>{order_id}번 주문 내역</Col>
            <Col>키오스크 : {kiosk_id}번</Col>
            <Col className="text-end"><CloseButton onClick={() => {
              props.setShowModal(false)
            }}></CloseButton></Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.data.map(item =>
          <React.Fragment key={item.order_id}>
            <Row className="mb-3 ms-3">
              <Col>
                <Row>{item.menu_name} X {item.menu_count}</Row>
                <Row>{ConvertOptions(item.options)}</Row>
              </Col>
              <Col>주문 시간 : {item.regdate}</Col>
            </Row>
          </React.Fragment>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onCompleted}>완료</Button>
        <Button onClick={onDelete}>주문 취소</Button>
      </Modal.Footer>
    </Modal>
  );
}