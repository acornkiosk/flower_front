import axios from "axios";
import { Button, Modal } from "react-bootstrap";

export default function DeModal(props) {
    const {id, refresh, setshow} = props
    const ownerDelete = () => {
        axios.post("/api/user/delete", {id})
            .then(res => {
                alert(res.data.dto.userName + "님을 삭제 했습니다.")
                refresh()
                setshow(false)
            })
            .catch(error => {
                console.log(error)
            })
    }
  return (
    <Modal
      {...props}
      centered
      style={{ marginTop: '20px' }}
    >
      <Modal.Header closeButton>
        <Modal.Title >
          경고
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4> <strong>{id}</strong> 사장님을 삭제하시겠습니까?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger"  onClick={ownerDelete}>삭제</Button>
        <Button variant="outline-success" onClick={()=>{
            setshow(false)
        }}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}