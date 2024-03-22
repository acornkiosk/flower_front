import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

/** 사용자 정보 등록 모달 */
export default function InsertModal(props) {
    const { onHide, onUserAdded, pageinfolist } = props
    const [Rank, setRank] = useState([])
    const labelStyle = {
        textAlign: 'right'
    };
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        userName: "",
        rank:3003,
        regdate: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const getRank = () => {
        axios.post("/api/common/child", { "code_id": 3000 })
            .then(res => {
                setRank(res.data.list)
            })
            .catch(error => {
                console.log("직급 리스트: " + error)
            })
    }
    const userInput = () => {
        const url = "/api/user/add";
        axios.post(url, formData)
            .then(res => {
                onHide();
                onUserAdded(1)
            })
            .catch(error => {
                setErrorMessage("사용자 추가 중 오류가 발생했습니다.");
            });
    }
    //초기화
    useEffect(() => {
        setFormData({
            id: "",
            password: "",
            userName: "",
            rank:3003,
            regdate: ""
        });
        setPassAll(false)
        setPass({
          passId: false,
          passUserName: false,
          passPassword: false,
          duplicateId: false,
          passDate:false
        })
        setDirty({
            isId:false,
            isUserName:false,
            isPassword:false,
            isDate:false,
            isDuplicateId:false
          })
        setErrorMessage("")
        getRank()
    }, [props.show])



 // 정규식 표현에 대한 true.false state값
 const [pass, setPass] = useState({
    passId: false,
    passUserName: false,
    passPassword: false,
    duplicateId: false,
    passDate:false
  })
  //input type dirty 검사
  const [dirty,setDirty]=useState({
    isId:false,
    isUserName:false,
    isPassword:false,
    isDate:false,
    isDuplicateId:false

  })
//아이디 중복 체크
const checkId = () => {
    setDirty({
      ...dirty,
      isDuplicateId:true
    })
    const id = formData.id;
      axios.post("/api/user/checkid", {id})
      .then(res => {
          console.log(res.data.hasID);
          setPass({
            ...pass,
            duplicateId:res.data.hasID
          })
      })
      .catch(error => {
        console.log(error);
      });
  };

  // id,password,userName 값 모두 true 일경우
  const [passAll, setPassAll] = useState(false)
  useEffect(() => {
    const isPass = pass.passId && pass.passUserName && pass.passPassword && pass.duplicateId &&pass.passDate
    setPassAll(isPass)
  }, [pass]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const idReg = /^[a-zA-Z][a-zA-Z0-9]{2,15}$/;
        const userNameReg = /^[가-힣]{2,16}$/;
        const passwordReg = /^.{4,16}$/;
    
        if (e.target.name === "userName") {
          setDirty({
            ...dirty,
            isUserName: true
          })
          if (userNameReg.test(e.target.value)) {
            setPass({
              ...pass,
              passUserName: true
            })
          } else {
            setPass({
              ...pass,
              passUserName: false
            })
          }
    
    
        } else if (e.target.name === "id") {
          setDirty({
            ...dirty,
            isId: true
          })
          if (idReg.test(e.target.value)) {
            setPass({
              ...pass,
              passId: true
            })
          } else {
            setPass({
              ...pass,
              passId: false
            })
          }
    
        } else if (e.target.name === "password") {
          setDirty({
            ...dirty,
            isPassword: true
          })
          if (passwordReg.test(e.target.value)) {
            setPass({
              ...pass,
              passPassword: true
            })
          } else {
            setPass({
              ...pass,
              passPassword: false
            })
          }
        } else if (e.target.name === "regdate") {
            setDirty({
              ...dirty,
              isDate: true
            })
            if (passwordReg.test(e.target.value)) {
              setPass({
                ...pass,
                passDate: true
              })
            } else {
              setPass({
                ...pass,
                passDate: false
              })
            }
          }        


        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <Modal
        show={props.show}
        onHide={props.onHide}
            size="lg"
            centered
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">직원 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label style={labelStyle} column md="2"> 아이디 : </Form.Label>
                        <Col md="3"><Form.Control type='text' name='id' value={formData.id} onChange={handleChange} readOnly={pass.duplicateId} isInvalid={dirty.isId &&!pass.passId || pass.passId && !pass.duplicateId}  isValid={pass.passId && pass.duplicateId} />
                        <Form.Control.Feedback type="invalid">
                            {
                            !pass.passId && !pass.duplicateId ? "아이디를 입력해주세요": pass.passId && !dirty.isDuplicateId  ? "중복 체크해주세요": pass.passId && dirty.isDuplicateId ? "이미 존재하는 아이디입니다." : ""
                            }
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
                        {pass.passId && <Col><Button onClick={checkId} disabled={pass.duplicateId}>중복확인</Button></Col>}
                        </Col>
                        <Form.Label style={labelStyle} column md="2"> 비밀번호 : </Form.Label>
                        <Col md="3"><Form.Control type='password' name='password' value={formData.password} onChange={handleChange}  isInvalid={dirty.isPassword && !pass.passPassword} isValid={pass.passPassword} />
                        <Form.Control.Feedback type="invalid">비밀번호: 4~16자를 사용해 주세요.</Form.Control.Feedback>
                         <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label style={labelStyle} column md="2" > 이름 : </Form.Label>
                        <Col md="3"><Form.Control type='text' name='userName' value={formData.userName} onChange={handleChange} isInvalid={dirty.isUserName && !pass.passUserName} isValid={pass.passUserName} />
                        <Form.Control.Feedback type="invalid">
                        이름: 한글를 사용해 주세요. (특수기호, 공백 사용 불가)
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">사용가능합니다.</Form.Control.Feedback>
                        </Col>
                        <Form.Label style={labelStyle} column md="2" > 직급 : </Form.Label>
                        <Col md="3">
                            <Form.Select aria-label="직급" name='rank' onChange={handleChange}>
                                {Rank.map((item, index) => {
                                    if (index < 2) return null;
                                    return <option key={item.code_id} value={item.code_id} >{item.code_name}</option>
                                })}
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Form.Label style={labelStyle} column md="2" type="date" > 입사일 : </Form.Label>
                        <Col md="3">
                            <input type="date" name="regdate" value={formData.regdate} onChange={handleChange} />
                        </Col>
                        <Form.Label column md="1"></Form.Label>
                        <Col md="5"></Col>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={userInput}  disabled={!passAll}>추가</Button>
                    <Button variant="danger" onClick={onHide}>취소</Button>
                </Modal.Footer>

        </Modal>
    )
}