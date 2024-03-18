
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddModal from "../components/login/AddModal";
import UpdateModal from "../components/login/UpdateModal";
import Error from "./Error";
import DeModal from "../components/login/DeModal";


export default function OwnerMange() {
    //사장님(owner) 리스트 관리
    const [ownerlist, setOwnerlist] = useState([]);
    const rank = useSelector(state => state.rank)
    //화면 refresh 하기
    const refresh = () => {
        axios.post("/api/user/list", { rank: 3002, pageNum: 0 })
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
    const [deleteModal,setDeleteModal]=useState(false)
    const [currentItem, setCurrentItem] = useState({})
    const [ownerId,setOwnerId]=useState()
   
    if (rank === 3001) {
        return (
            <div >
                <h1 style={{  textAlign: 'center' }}>super 전용 (관리자 모드)</h1>
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
                                <td>{item.rank == 3002 && "owner"}</td>
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
                                        setOwnerId(item.id)
                                        setDeleteModal(true)
                                }}>삭제</Button></td>
                            </tr>)
                        }
                    </tbody>
                </Table>
                <DeModal show={deleteModal} id={ownerId} refresh={refresh} setshow={setDeleteModal} />
                <AddModal show={showAddModal} refresh={refresh} setshow={setShowAddModal} />
                <UpdateModal show={showUpModal} setshow={setShowUpModal} item={currentItem} setCurrentItem={setCurrentItem} refresh={refresh} />
            </div>
        )
    }
    else {

        return (
            <Error />
        )
    }
}