import axios from "axios"
import React from "react"
import { Button, CloseButton, Col, Modal, Row } from "react-bootstrap"
import ConvertOptions from "./util"
import style from "./style"

export default function DetailModal(props) {
  let order_id
  let kiosk_id
  if (props.data.length !== 0) {
    order_id = props.data[0].order_id
    kiosk_id = props.data[0].kiosk_id
  }
  /** DetailModal.js <--> Order.js <--> orderItem.js  */
  const { show, setShowModal, setDeleteModal, data } = props
  //완료버튼을 누를시 
  function onCompleted() {
    for (let item of data) {
      item.is_completed = 'true'
      axios.post("/api/order/update", item)
        .then(res => {
          if (res.data.status === 'OK') {
            setDeleteModal({ target: item.order_id })
          }
        })
        .catch(error => console.log(error))
    }
    setShowModal(false)
  }
  //주문취소 버튼을 누를시
  function onDelete() {
    axios.post("/api/order/deleteAll", { order_id: order_id })
      .then(res => {
        if (res.data.status === 'OK') {
          setShowModal(false)
        }
      })
    setDeleteModal({ target: order_id })
  }
  return (
    <Modal
      show={show}
      size="lg"
      centered
      style={style.customModal}
    >
      <Modal.Header className="d-flex" style={style.customModalHeader}>
        <Modal.Title className="flex-fill">
          <Row className="justify-content-between">
            <Col>{order_id}번 주문 내역</Col>
            <Col className="text-end ms-auto">키오스크 : {kiosk_id}번</Col>
            <Col className="text-end"><CloseButton onClick={() => {
              setShowModal(false);
            }}></CloseButton></Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={style.customModalBody}>
        {data.map(item =>
          <React.Fragment key={item.order_id}>
            <Row className="mb-3 ms-3">
              <Col>
                <Row className="text" style={{ fontSize: '1.5rem' }}>{item.menu_name} X {item.menu_count}</Row>
                <Row className="text" style={{ fontSize: '1.2rem', color: 'darkred' }}>{ConvertOptions(item.options)}</Row>
              </Col>
              <Col className="text" style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>주문 시간 : {item.regdate}</Col>
            </Row>
          </React.Fragment>
        )}
      </Modal.Body>
      <Modal.Footer style={style.customModalFooter}>
        <Button style={style.customModalFooterPrimaryBtn} onClick={onCompleted}>완료</Button>
        <Button style={style.customModalFooterDangerBtn} onClick={onDelete}>주문 취소</Button>
      </Modal.Footer>
    </Modal>
  );
}