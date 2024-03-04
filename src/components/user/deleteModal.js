import axios from "axios";
import { Button, Modal } from "react-bootstrap";

export default function DeleteModal(props) {
    const { userId } = props;
    const deleteUser=()=>{
        axios.post("/api/user/delete",{id:userId},
        { headers: { "Content-Type": "application/json" } })
        .then(res=>{
          console.log(res.data);
          props.onHide();
          props.onUserDelete();
          props.updateHide();
        })
      }

    return (
      <Modal
        {...props} 
        size="sm"
        centered
        style={{ marginTop: '20px' }}
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
          <Button variant="danger" onClick={deleteUser}>삭제</Button>
          <Button variant="warning" onClick={props.onHide}>취소</Button>
        </Modal.Footer>
      </Modal>
    );
  }