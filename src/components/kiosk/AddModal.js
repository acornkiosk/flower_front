import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

export default function AddModal(props) {
  const { addModalShow, setAddModalShow, pageInfo, addKiosk } = props
  /** 유효성 검사 통과시 나타낼 UI */
  const [isValid, setIsValid] = useState(false)
  /** 유효성 검사 실패시 나타낼 UI */
  const [isInvalid, setIsInvalid] = useState(false)
  /** 유효성 검사 실패 사유를 나타낼 함수 */
  const [validationMessage, setValidationMessage] = useState("")
  /** 유효성 검사 성공시에만 등록버튼 활성화 */
  const [pass, setPass] = useState(false)
  /** 키오스크 정보추가시 입력한 값을 보관 */
  const [inputValue, setInputValue] = useState(null)
  /** 이미 등록된 정보중에 위치정보가 동일한 게 있는 지 체크(중복방지) */
  const kioskLocation = pageInfo.list.map(item => item.location)

  /** 입력할 때마다 호출 */
  useEffect(() => {
    /** 실시간으로 유효성 검사 UI 적용 */
    const errorMessageSpan = document.getElementById("errorMessage");
    if (errorMessageSpan && isInvalid) {
      errorMessageSpan.innerText = validationMessage;
    }
  }, [isInvalid, validationMessage]);

  /** 입력 값의 유효성 검사 결과를 나타내는 함수 */
  const isValidInput = (event) => {
    /** 입력값 추출 */
    const { value } = event.target
    setInputValue(value)

    /** 정규식 표현들 */
    const reg1 = /^.{1,20}$/
    const reg2 = /^(?!.*\s{2,}).{1,20}$/
    const reg3 = /^[ㄱ-ㅎ가-힣a-zA-Z0-9]+(\s[ㄱ-ㅎ가-힣a-zA-Z0-9]+)*$/;

    if (value === '') {
      setPass(false)
      setIsValid(false)
      setIsInvalid(false)
      setValidationMessage(null)
    } else if (!reg1.test(value)) {
      setPass(false)
      setIsValid(false)
      setIsInvalid(true)
      setValidationMessage('최대 20자까지 입력 가능하고 첫글자는 공백이어서는 안됩니다.');
    } else if (!reg2.test(value) && reg1.test(value)) {
      setPass(false)
      setIsValid(false)
      setIsInvalid(true)
      setValidationMessage('공백을 연속 두번 허용할 수 없습니다.');
    } else if (!reg3.test(value)) {
      setPass(false)
      setIsValid(false)
      setIsInvalid(true)
      setValidationMessage('기호를 제외한 영문자와 한글만 입력이 가능합니다.');
    } else if (kioskLocation.includes(value)) {
      setPass(false)
      setIsValid(false)
      setIsInvalid(true)
      setValidationMessage('이미 등록된 위치입니다.');
    } else {
      setPass(true)
      setIsValid(true)
      setIsInvalid(false)
      setValidationMessage(null)
    }
  }

  return (
    <>
      <Modal size="lg" centered show={addModalShow} onHide={() => {
        setAddModalShow(false)
        setPass(false)
        setIsValid(false)
        setIsInvalid(false)
        setValidationMessage('')
      }}>
        <Modal.Header closeButton>
          <Modal.Title>키오스크 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text>키오스크 위치</InputGroup.Text>
            <Form.Control type="text" placeholder="키오스크 위치 입력"
              /** input 값 */
              onChange={isValidInput}
              /** UI 상으로 실패를 나타냄 */
              isInvalid={isInvalid}
              /** UI 상으로 성공을 나타냄 */
              isValid={isValid}
            />
            <Form.Control.Feedback type="invalid">
              <span id="errorMessage"></span>
            </Form.Control.Feedback>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Row className="justify-content-md-end">
            <Col md="auto">
              <Button variant="secondary" onClick={() => {
                setAddModalShow(false)
                setPass(false)
                setIsValid(false)
                setIsInvalid(false)
                setValidationMessage('')
              }}>닫기</Button>
            </Col>
            <Col md="auto">
              <Button
                variant="primary"
                type="button"
                /** 데이터 전달하여 추가시키기 */
                onClick={() => addKiosk(inputValue)}
                /** disabled: 조건 불충족시 기능 비활성화 */
                disabled={!pass}>추가하기
              </Button>
            </Col>
          </Row>
        </Modal.Footer>
      </Modal>
    </>
  )
}