import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function AddModal(props) {
  //여기서 모달을 숨기고 싶으면 props.setshow(false) 가 실행되면 된다
  const { setshow, refresh } = props
    //사장님(owner) 추가 
  const [ownerdata, setOwnerdata] = useState({
    userName: "",
    id: "",
    password: "",
    rank: 3002 // 초기값으로 설정해야 할 경우 여기에 넣으세요
  });
// 정규식 표현에 대한 true.false state값
  const [pass,setPass]=useState({
    passId:false,
    passUserName:false,
    passPassword:false,
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
  
  //passAll 에 state 값을 pass(id,userName,password )값이 변동될때마다 상태 변경
  useEffect(()=>{
    const  isPass=pass.passId && pass.passUserName && pass.passPassword && pass.duplicateId
    setPassAll(isPass)
  }, [pass]);

  // 사장(owner) 추가
  const ownerInsert = () => {
    axios.post("/api/user/add", ownerdata)
      .then(res => {
        alert(res.data.dto.userName + "님(owenr) 등록 되었습니다.")
        setshow(false)
        refresh()
        reset()
      })
      .catch(error => {
        console.log(error);
        alert("오류입니다.")
      });
  };
  //state 값을 초기화 하는 부분
  const reset=()=>{
    setPassAll(false)
    setPass({
     passId:false,
     passUserName:false,
     passPassword:false,
     duplicateId:false
    })
    setOwnerdata({
     userName: "",
     id: "",
     password: "",
     rank: 3002
    })
    setDirty({
      isId:false,
      isUserName:false,
      isPassword:false,
      isDuplicateId:false
    })
  }
  //사장 (owner) input값 
  const ownerChange = (e) => {
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
          
      
    }else if(e.target.name === "id"){
      setDirty({
        ...dirty,
        isId:true
      })
      if(idReg.test(e.target.value)){
        setPass({
          ...pass,
          passId:true
        })
      }else{
        setPass({
          ...pass,
          passId:false
        })
      }

    }else if(e.target.name === "password"){
      setDirty({
        ...dirty,
        isPassword:true
      })
      if(passwordReg.test(e.target.value)){
        setPass({
          ...pass,
          passPassword:true
        })
      }else{
        setPass({
          ...pass,
          passPassword:false
        })
      }
    }

    setOwnerdata({
      ...ownerdata,
      [e.target.name]:e.target.value
    })
    
  };
  //아이디 중복 체크
  const checkId = () => {
    setDirty({
      ...dirty,
      isDuplicateId:true
    })
    const id = ownerdata.id;
      axios.post("/api/user/checkid", id)
      .then(res => {
          console.log(res.data);
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
          사장님(owner) 추가
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 이름 : </Form.Label>
          <Col md="10"><Form.Control type='text' name="userName" onChange={ownerChange} placeholder="userName" isInvalid={dirty.isUserName && !pass.passUserName} isValid={pass.passUserName} />
          <Form.Control.Feedback type="invalid">
          이름: 한글를 사용해 주세요. (특수기호, 공백 사용 불가)
            </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
          </Col>
          
        </Form.Group>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 아이디 : </Form.Label>
          <Col md="8"><Form.Control type='text' name='id' onChange={ownerChange} placeholder="ID 입력해주세요" readOnly={pass.duplicateId} isInvalid={dirty.isId &&!pass.passId || pass.passId && !pass.duplicateId}  isValid={pass.passId && pass.duplicateId}/>
          <Form.Control.Feedback type="invalid">
          {
              !pass.passId && !pass.duplicateId ? "아이디를 입력해주세요": pass.passId && !dirty.isDuplicateId  ? "중복 체크해주세요": pass.passId && dirty.isDuplicateId ? "이미 존재하는 아이디입니다." : ""
            }
          </Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
          </Col>
         {pass.passId && <Col><Button onClick={checkId} disabled={pass.duplicateId}>중복확인</Button></Col>}
        </Form.Group>
        <Form.Group as={Row} className="mb-4">
          <Form.Label column md="2"> 비밀번호 : </Form.Label>
          <Col md="10"><Form.Control type='password' name='password' onChange={ownerChange} placeholder="Password" isInvalid={ dirty.isPassword && !pass.passPassword} isValid={pass.passPassword}/>
          <Form.Control.Feedback type="invalid">비밀번호: 4~16자를 사용해 주세요.</Form.Control.Feedback>
          <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
          </Col>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-success" onClick={ownerInsert} disabled={!passAll}>등록</Button>
        <Button variant="outline-warning" onClick={() => {
           setshow(false)
            reset()
           }} >취소</Button>
      </Modal.Footer>
    </Modal>
  );
}