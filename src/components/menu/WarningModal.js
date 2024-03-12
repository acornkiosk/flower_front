import { Button, Modal } from "react-bootstrap";

export default function WarningModal(props) {
  const { deletemenu, onHide, value_id } = props
  return (
    <Modal
      {...props}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title >
          경고
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>보고 계신 정보를 정말 삭제하시겠습니까?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => { deletemenu(value_id) }}>삭제</Button>
        <Button variant="warning" onClick={onHide}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}