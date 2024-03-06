
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



export default function OwnerMange() {

    const navigate=useNavigate();
    //사장님(owner) 리스트 관리
    const [ownerlist, setOwnerlist] = useState([]);
    const rank=useSelector(state=>state.rank)
    //화면 refresh 하기
    const refresh = () => {
        axios.post("/api/user/list",{rank : 3002})
            .then(res => {
                setOwnerlist(res.data.list);
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
    const ownerDelete = (item) => {
        axios.post("/api/user/delete",item)
            .then(res => {
                alert(res.data.dto.userName + "님을 삭제 했습니다.")
                refresh()
            })
            .catch(error => {
                console.log(error)
            })
    }
if(rank===3001){
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
                            <td>{item.rank==3002 &&"super"}</td>
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
                                    ownerDelete(item)
                                }
                            }}>삭제</Button></td>
                        </tr>)
                    }
                </tbody>
            </Table>
            <AddModal show={showAddModal} refresh={refresh} setshow={setShowAddModal} />
            <UpModal show={showUpModal} setshow={setShowUpModal} item={currentItem} setCurrentItem={setCurrentItem} refresh={refresh} />
        </div>
    )
}
else{
    setTimeout(()=>{
        navigate("/")
      },5000)
      return(
        <div>
            <h1>잘못된 접근입니다. 로그인 후 이용해주세요</h1>
              
        </div>
    )
        
}
}


function AddModal(props) {
    //여기서 모달을 숨기고 싶으면 props.setshow(false) 가 실행되면 된다

    // 사장(owner) 추가
    const ownerInsert = () => {
        axios.post("/api/user/add", ownerdata)
            .then(res => {
                alert(res.data.dto.id + "님(owenr) 등록 되었습니다.")
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
    const [ownerdata, setOwnerdata] = useState({
        userName: "",
        id: "",
        password: "",
        rank: 3002 // 초기값으로 설정해야 할 경우 여기에 넣으세요
    });
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
                <Form.Label  column md="2"> 이름 : </Form.Label>
                <Col md="10"><Form.Control type='text' name="userName" onChange={ownerChange} placeholder="userName" /></Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-4">
                <Form.Label    column md="2"> 아이디 : </Form.Label>
                <Col md="10"><Form.Control type='text' name='id'onChange={ownerChange} placeholder="ID 입력해주세요"  /></Col>
            </Form.Group>
            
            <Form.Group as={Row} className="mb-4">
             <Form.Label  column md="2"> 비밀번호 : </Form.Label>
                <Col md="10"><Form.Control type='password' name='password' onChange={ownerChange} placeholder="Password" /></Col>
            </Form.Group>
           
            </Modal.Body>
            <Modal.Footer>

                <Button onClick={ownerInsert}>등록</Button>
                <Button onClick={() => { props.setshow(false) }} >Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function UpModal(props) {

    const {item, setCurrentItem,refresh,setshow} = props
    //모달창에 입력값 바뀌면 state 값 바꾸기
    const handleChange = (e) => {
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
                 사장님 정보 수정
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
           
            <Form.Group as={Row} className="mb-3">
                <Form.Label   column md="2"> 이름 </Form.Label>
                <Col md="3"><Form.Control type='text' name='userName' onChange={handleChange} value={item.userName}/></Col>
                <Form.Label  column md="2"> 아이디 </Form.Label>
                <Col md="3"><Form.Control type='text' name='id' value={item.id} readOnly /></Col>
            </Form.Group>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    handleSave()
                }}>수정</Button>
                <Button onClick={() => {
                  setshow(false)
                }}>취소</Button>
                
            </Modal.Footer>
        </Modal>
    );
}