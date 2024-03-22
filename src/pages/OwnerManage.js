
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import AddModal from "../components/login/AddModal";
import UpdateModal from "../components/login/UpdateModal";
import Error from "./Error";
import DelModal from "../components/login/DelModal";

export default function OwnerMange() {
    //사장님(owner) 리스트 관리
    const [ownerlist, setOwnerlist] = useState([]);
    const rank = useSelector(state => state.rank)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showUpModal, setShowUpModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [currentItem, setCurrentItem] = useState({})
    const [ownerId, setOwnerId] = useState()
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

    const strRole=(role)=>{
        let a=role.split(",");
        let b=[];
        for(let i=0; i<a.length; i++){
            if(a[i]==="4001"){
                b[i]=" 직원 관리 및 대쉬보드"
            }else if(a[i]==="4002"){
                b[i]=" 메뉴 관리"
            }
            else if(a[i]==="4003"){
                b[i]=" 키오스크 관리"
            }
            else if(a[i]==="4004"){
                b[i]=" 주문 관리"
            }
        }
        return b;
    }

    if (rank === 3001) {
        return (
            <div >
                <h1 style={{ textAlign: 'center' }}>super 전용 (관리자 모드)</h1>
                <h4>사장님(OWENR) 목록</h4>
                <Button variant="success" onClick={() => {
                    setShowAddModal(true)
                }}> 추가</Button>
                <Table>
                    <thead>
                        <tr>
                            <td>아이디</td>
                            <td>사장님 이름</td>
                            <td>직급</td>
                            <td>접근 권한</td>
                            <td>가입 날짜</td>
                            <td>수정</td>
                            <td>삭제</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            ownerlist.map((item) => <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.userName}</td>
                                <td>{item.rank === 3002 && "owner"}</td>
                                <td>
                                {strRole(item.role)}
                                </td>
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
                <DelModal show={deleteModal} id={ownerId} refresh={refresh} setshow={setDeleteModal} />
                <AddModal show={showAddModal} refresh={refresh} setshow={setShowAddModal} />
                <UpdateModal show={showUpModal} setShow={setShowUpModal} item={currentItem} setCurrentItem={setCurrentItem} refresh={refresh} />
            </div>
        )
    }
    else {
        return (
            <Error />
        )
    }
}