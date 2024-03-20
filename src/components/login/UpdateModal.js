import axios from "axios"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"
import User from "../../pages/User"
import { useState } from "react"
import { useEffect } from "react"

export default function UpdateModal(props) {
  const { item, setCurrentItem, refresh, setshow } = props

  // 정규식 표현에 대한 true.false state값
  const [pass,setPass]=useState({
    passNewId:false,
    passUserName:false,
    passNewPassword:false,
    duplicateId:false
  })
    //input type dirty 검사
    const [dirty,setDirty]=useState({
      isId:false,
      isUserName:false,
      isPassword:false,
      isDuplicateId:false
    })

  // id,password,userName 값 모두 true 일경우
  const [passAll,setPassAll]=useState(false)
//state 값을 초기화 하는 부분
const reset=()=>{
  setPassAll(false)
  setPass({
    passNewId:false,
    passUserName:false,
    passNewPassword:false,
    duplicateId:false
  })
  setDirty({
    isId:false,
    isUserName:false,
    isPassword:false,
    isDuplicateId:false
  })

}
  //passAll 에 state 값을 pass(id,userName,password )값이 변동될때마다 상태 변경
  useEffect(() => {
    const isPassAll = pass.passNewId && pass.duplicateId && pass.passUserName && pass.passNewPassword ;
    setPassAll(isPassAll);
  }, [pass]);

  //모달창에 입력값 바뀌면 state 값 바꾸기
  const handleChange = (e) => {
    const idReg= /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
    const userNameReg=/^[가-힣]{2,16}$/;
    const passwordReg= /^.{4,16}$/;
    
    if(e.target.name === "userName"){
      setDirty({
        ...dirty,
        isUserName:true
      })
      if(userNameReg.test(e.target.value)){
        setPass({
          ...pass,
          passUserName:true
        })
      }else{
        setPass({
          ...pass,
          passUserName:false
        })
      }
          
      
    }else if(e.target.name === "newId"){
      setDirty({
        ...dirty,
        isId:true
      })
      if(idReg.test(e.target.value)){
        setPass({
          ...pass,
          passNewId:true
        })
      }else{
        setPass({
          ...pass,
          passNewId:false
        })
      }

    }else if(e.target.name === "newPassword"){
      setDirty({
        ...dirty,
        isPassword:true
      })
      if(passwordReg.test(e.target.value)){
        setPass({
          ...pass,
          passNewPassword:true
        })
      }else{
        setPass({
          ...pass,
          passNewPassword:false
        })
      }
    }


    setCurrentItem({
      ...item,
      [e.target.name]: e.target.value
    })
  }
  const handleSave = () => {
    axios.post("/api/user/update", item)
      .then(res => {
        //회원 목록 보기로 이동
        refresh()
        setshow(false)
        reset()
      })
      .catch(error => {
        console.log(error)
        alert("업데이트 실패했습니다.")
      })
  }
    //아이디 중복 체크
  const checkId = () => {
    setDirty({
      ...dirty,
      isDuplicateId:true
    })
    const id = item.newId
      axios.post("/api/user/checkid", {id})
      .then(res => {
          setPass({
            ...pass,
            duplicateId:res.data
          })
      })
      .catch(error => {
          console.log(error);
      });
};

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          사장님(owner) 정보 수정
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2"> 이름 변경: </Form.Label>
          <Col md="4"><Form.Control type='text' name='userName' onChange={handleChange} placeholder={item.userName} isInvalid={dirty.isUserName && !pass.passUserName} isValid={pass.passUserName}/>
          <Form.Control.Feedback type="invalid">이름: 한글를 사용해 주세요. (특수기호, 공백 사용 불가)</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback></Col>
         </Form.Group>

          <Form.Group as={Row} className="mb-3">
          <Form.Label column md="2"> 아이디 변경:  </Form.Label>
          <Col md="4"><Form.Control type='text' name='newId'  onChange={handleChange} placeholder={item.id}  readOnly={pass.duplicateId} isInvalid={dirty.isId &&!pass.passNewId || pass.passNewId && !pass.duplicateId}  isValid={pass.passNewId && pass.duplicateId}/>
          <Form.Control.Feedback type="invalid">
            {
              !pass.passNewId && !pass.duplicateId ? "아이디를 입력해주세요": pass.passNewId && !dirty.isDuplicateId  ? "중복 체크해주세요": pass.passNewId && dirty.isDuplicateId ? "이미 존재하는 아이디입니다." : ""
            }
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
          {pass.passNewId && <Col><Button onClick={checkId} disabled={pass.duplicateId}>중복확인</Button></Col>}
          </Col>
        </Form.Group>
   
         <Form.Group as={Row} className="mb-6">
          <Form.Label column md="2"> 비밀번호 변경:</Form.Label>
          <Col md="4"><Form.Control type='text' name='newPassword'  onChange={handleChange} placeholder="새로운 비밀번호" isInvalid={ dirty.isPassword && !pass.passNewPassword} isValid={pass.passNewPassword}/>
          <Form.Control.Feedback type="invalid">비밀번호: 4~16자를 사용해 주세요.</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Control type='hidden' name='id' value={item.id}/>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" disabled={!passAll} onClick={handleSave}>수정</Button>
        <Button variant="outline-warning" onClick={() => {
          setshow(false)
          reset()
        }}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
}