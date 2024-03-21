import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

/** 사용자 정보 등록 모달 */
export default function InsertModal(props) {
    const { onHide, onUserAdded, pageInfoList } = props
    const [Rank, setRank] = useState([])
    const labelStyle = {
        textAlign: 'right'
    };
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        userName: "",
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
    const userInput = (e) => {
        e.preventDefault();
        const url = "/api/user/add";
        const formData = new FormData(e.target);
        axios.post(url, formData)
            .then(res => {
                onHide();
                onUserAdded();
            })
            .catch(error => {
                setErrorMessage("사용자 추가 중 오류가 발생했습니다.");
            });
    }
    useEffect(() => {
        setFormData({
            id: "",
            password: "",
            userName: "",
            regdate: ""
        });
        setErrorMessage("")
        getRank()
    }, [props.show])
    const handleAddUserId = (e) => {
        e.preventDefault();
        const existedId = pageInfoList.map(user => user.id);
        // 새로운 아이디가 이미 존재하는지 확인
        if (existedId.includes(formData.id)) {
            setErrorMessage("이미 존재하는 아이디입니다.");
        } else {
            // 존재하지 않으면 사용자 추가 수행
            userInput(e);
        }
    }
    const isFormValid = () => {
        const validate = {};
        validate.id = !/^[a-zA-Z0-9]{4,20}$/.test(formData.id)
        validate.password = !(formData.password.length >= 4 && formData.password.length <= 8)
        validate.userName = !(formData.userName.length <= 5)
        validate.regdate = !formData.regdate
        return Object.values(validate).every(val => !val)
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    return (
        <Modal
            {...props}
            size="lg"
            centered
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Form onSubmit={handleAddUserId}>
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title"></Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    {errorMessage && <p style={{ color: 'red', marginLeft: "50px" }}>{errorMessage}</p>}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label style={labelStyle} column md="2"> 아이디 : </Form.Label>
                        <Col md="3"><Form.Control type='text' name='id' value={formData.id} onChange={handleChange} /></Col>
                        <Form.Label style={labelStyle} column md="2"> 비밀번호 : </Form.Label>
                        <Col md="3"><Form.Control type='password' name='password' value={formData.password} onChange={handleChange} /></Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label style={labelStyle} column md="2" > 이름 : </Form.Label>
                        <Col md="3"><Form.Control type='text' name='userName' value={formData.userName} onChange={handleChange} /></Col>
                        <Form.Label style={labelStyle} column md="2" > 직급 : </Form.Label>
                        <Col md="3">
                            <Form.Select aria-label="직급" name='rank'>
                                {Rank.map((item, index) => {
                                    if (index < 2) return null;
                                    return <option key={item.code_id} value={item.code_id}>{item.code_name}</option>
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
                    <Button variant="success" type="submit" disabled={!isFormValid()}>추가</Button>
                    <Button variant="danger" onClick={onHide}>취소</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}