import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";



export default function OwnerMange() {

    //사장님(owner) 리스트 관리
    const [ownerlist, setOwnerlist] = useState([]);

    //화면 refresh 하기
    const refresh = () => {
        axios.get("/super/ownerList", {
            headers: {
                "Content-Type": "application/json"
            }
        }
        )
            .then(res => {
                setOwnerlist(res.data);
            })
            .catch(error => {
                console.log(error)
            })
    }
    //owenr리스트 get 하기
    useEffect(() => {
        refresh()
    }, [])

    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpModal, setShowUpModal] = useState(false)
    const [currentItem, setCurrentItem] = useState({})

    //사장님 삭제
    const ownerDelete = (id) => {
        axios.delete("/super/ownerDelete/" + id, {
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        })
            .then(res => {
                alert(res.data + "님을 삭제 했습니다.")
                refresh()
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div>
            <h1>super 전용 (관리자 모드)</h1>

            <h4>사장님(OWENR) 목록</h4>
            <Button variant="success" onClick={() => {
                setShowAddModal(true)
            }}> 추가</Button>
            <Table>
                <thead>

                    <tr>
                        <td>ID</td>
                        <td>USERNAME</td>
                        <td>RANK</td>
                        <td>ROLE</td>
                        <td>REGDATE</td>
                        <td>수정</td>
                        <td>삭제</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        ownerlist.map((item) => <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.userName}</td>
                            <td>{item.rank}</td>
                            <td>{item.role}</td>
                            <td>{item.regdate}</td>
                            <td>
                                <Button variant="warning" onClick={() => {
                                    setShowUpModal(true)
                                    //setUpid(item.id)
                                    setCurrentItem(item)
                                }}>
                                    수정
                                </Button>
                            </td>
                            <td><Button variant="danger" onClick={() => {
                                if (window.confirm("삭제할거냐?")) {
                                    ownerDelete(item.id)
                                }
                            }}>삭제</Button></td>
                        </tr>)
                    }
                </tbody>
            </Table>
            <AddModal show={showAddModal} refresh={refresh} setshow={setShowAddModal} />
            <UpModal show={showUpModal} setshow={setShowUpModal} item={currentItem} refresh={refresh} />
        </div>
    );
}

function AddModal(props) {
    //여기서 모달을 숨기고 싶으면 props.setshow(false) 가 실행되면 된다

    // 사장(owner) 추가
    const ownerInsert = () => {
        axios.post("/super/ownerInsert", ownerdata, { // 수정된 부분: onwerdata -> ownerdata
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                alert(res.data + "님(owenr) 등록 되었습니다.")
                props.setshow(false)
                props.refresh()
            })
            .catch(error => {
                console.log(error);
            });

    };

    //사장 (owner) input값 
    const ownerChange = (e) => {
        setOwnerdata({
            ...ownerdata,
            [e.target.name]: e.target.value
        });
    };

    //사장님(owner) 추가 
    const [ownerdata, setOwnerdata] = useState({});
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
                <input type="text" placeholder="ID" name="id" onChange={ownerChange} />
                <input type="text" placeholder="Password" name="password" onChange={ownerChange} />
                <input type="text" placeholder="userName" name="userName" onChange={ownerChange} />

            </Modal.Body>
            <Modal.Footer>

                <Button onClick={ownerInsert}>등록</Button>
                <Button onClick={() => { props.setshow(false) }} >Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function UpModal(props) {
    //state로 값을 관리
    const [owner, setOwner] = useState(props.item);
    //모달창에 입력값 바뀌면 state 값 바꾸기
    const handleChange = (e) => {
        setOwner({
            ...owner,
            [e.target.name]: e.target.value

        })
    }


    const handleSave = () => {
        axios.put("/super/ownerUpdate/" + props.item.id, owner, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                //회원 목록 보기로 이동
                props.refresh()
                props.setshow(false)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.item.userName} 사장님 정보
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label htmlFor="newId">새로운 아이디</label>
                <input type="text" name="newId" onChange={handleChange} />
                <label htmlFor="userName">이름</label>
                <input type="text" name="userName" value={props.item.userName} onChange={handleChange} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    handleSave()
                }}>수정</Button>
                <Button onClick={() => {
                    props.setshow(false)
                }}>취소</Button>
            </Modal.Footer>
        </Modal>
    );
}