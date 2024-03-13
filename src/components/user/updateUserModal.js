import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

export default function UpdateModal(props) {
    const { userId, deleteShow } = props;
    const [Rank, setRank] = useState([]);
    const [userData, setUserData] = useState({ role: "" });
    const labelStyle = {
        textAlign: 'right'
    };

    const colGap = {
        marginTop: '8px',
        fontWeight: 'bold'
    }

    const handleChange = (e, roleId) => {
        const { checked } = e.target;
        let updatedRoles = userData.role.split(',');

        if (checked) {
            // 새롭게 체크된 체크박스의 value 값을 추가
            updatedRoles.push(roleId);
            console.log(updatedRoles)
        } else {
            // 체크가 해제된 체크박스의 value 값을 제거
            updatedRoles = updatedRoles.filter(role => role !== roleId);
            console.log(updatedRoles)
        }

        // 업데이트된 role 값을 문자열로 변환하여 설정
        setUserData({ ...userData, role: updatedRoles.join(',') });
    };

    const getRank = () => {
        axios.post("/api/common/child", { "code_id": 3000 }, { headers: { "Content-Type": "application/json" } })
            .then(res => {
                setRank(res.data.list);
            })
            .catch(error => {
                console.log("직급리스트: " + error);
            });
    };

    const getUser = () => {
        axios.post("/api/user/get", { id: userId })
            .then(res => {
                setUserData(res.data.dto);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const userUpdate = (e) => {
        e.preventDefault();
        const url = "/api/user/update";
        const formData = new FormData(e.target);
        formData.append("role", userData.role)
        axios.post(url, formData, { headers: { "Content-Type": "application/json" } })
            .then(res => {
                console.log(res.data);
                props.onHide();
                props.onUserUpdate();
            });
    };

    useEffect(() => {
        getRank();
    }, []);

    // useEffect(() => {
    //     getUser();
    // }, [userId]);

    useEffect(() => {
        if (userId != null) getUser();

        return () => {
            setUserData({});
        };
    }, [props.show]);

    //정보가 불러와지지 않으면 모달을 안띄우게 하기
    if (!userData.id) {
        return null;
    }
    return (
        <Modal
            {...props}
            size="lg"
            centered
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Form onSubmit={(e) => userUpdate(e)}>
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        사용자 정보 수정
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex justify-content-center">
                    <div className="col-md-6">
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label style={labelStyle} column md="3"> 이름 : </Form.Label>
                            <Col style={colGap}>{userData.userName} </Col>
                            <input type="hidden" name="userName" value={userData.userName} />
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label style={labelStyle} column md="3"> 아이디 : </Form.Label>
                            <input type="hidden" name="id" value={userData.id} />
                            <Col style={colGap}>{userData.id}</Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label style={labelStyle} column md="3" type="text"> 입사일 : </Form.Label>
                            <Col style={colGap}>{userData.regdate}</Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label style={labelStyle} column md="3"> 직급 : </Form.Label>
                            <Col md="4">
                                <Form.Select aria-label="직급" onChange={handleChange} value={userData.rank} name='rank'>
                                    {Rank.map((item, index) => {
                                        if (index < 2) return null;
                                        return <option key={item.code_id} value={item.code_id}>{item.code_name}</option>;
                                    })}
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </div>
                    <div className="col-md-3">
                        {/*<input type="text" name="role"  onChange={handleChange} defaultValue={userData.role} />*/}
                        <Form.Group className="mb-3 d-flex">
                            <Form.Check
                                onChange={(e) => handleChange(e, "4004")}
                                name="role4004"
                                checked={userData.role && userData.role.includes("4004")}
                                value="4004"
                            />
                            <Form.Label>주문 관리 권한</Form.Label>
                        </Form.Group>
                        <Form.Group className="mb-3 d-flex">
                            <Form.Check
                                onChange={(e) => handleChange(e, "4002")}
                                name="role4002"
                                checked={userData.role && userData.role.includes("4002")}
                                value="4002"
                            />
                            <Form.Label>메뉴 관리 권한</Form.Label>

                        </Form.Group>
                        <Form.Group className="mb-3 d-flex">
                            <Form.Check
                                onChange={(e) => handleChange(e, "4003")}
                                name="role4003"
                                checked={userData.role && userData.role.includes("4003")}
                                value="4003"
                            />
                            <Form.Label>키오스크 관리 권한</Form.Label>
                        </Form.Group>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={deleteShow}>직원 삭제</Button>
                    <Button variant="success" type="submit">저장</Button>
                    <Button variant="danger" onClick={props.onHide}>취소</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

