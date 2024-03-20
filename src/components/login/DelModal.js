import axios from "axios";
import { useState } from "react";
import { Button, Form, FormControl, Modal } from "react-bootstrap";

export default function DelModal(props) {
    const {id, refresh, setshow} = props
    const [valueSame,setValueSame]=useState(false);
    const [inputValue,setInputValue]=useState("");
    const test=id + " 사장님을 삭제합니다."
    
    const handleChange=(e)=>{
      setInputValue(e.target.value)
    }


    //owner 삭제 axious
    const ownerDelete = () => {
      if(test === inputValue){
        axios.post("/api/user/delete", {id})
                    .then(res => {
                        alert(res.data.dto.userName + "님을 삭제 했습니다.")
                        refresh()
                        setshow(false)
                        setValueSame(false)
                    })
                    .catch(error => {
                        console.log(error)
                    })
      }else{
        setValueSame(true)
        alert("문구가 틀립니다,")
      }
       
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
        <p> 다음 문구를 입력해주세요 "{test}"</p>
        <FormControl type="text" onChange={handleChange} isInvalid={valueSame} />
        <Form.Control.Feedback type="invalid">문구를 올바르게 입력해주세요</Form.Control.Feedback>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger"  onClick={ownerDelete}>삭제</Button>
        <Button variant="outline-success" onClick={()=>{
            setshow(false)
            setValueSame(false)
        }}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}