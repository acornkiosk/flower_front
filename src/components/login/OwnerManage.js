import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";



export default function OwnerMange() {

     //사장님(owner) 리스트 관리
     const [ownerlist,setOwnerlist] =useState([]);
   
    //화면 refresh 하기
    const refresh=()=>{
        axios.get("/super/ownerList",{
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        }
        )
        .then(res=>{
            setOwnerlist(res.data);
        })
        .catch(error=>{
            console.log(error)
        })
    }
    //owenr리스트 get 하기
   useEffect(()=>{
        refresh()
    },[])
    //추가 modal 관리
    const addmodal=useSelector(state=>state.addmodal)  
    //수정 modal
    const upmodal=useSelector(state=>state.upmodal)
    const dispatch=useDispatch()
    const [upid,setUpid]=useState({});
    //사장님 삭제
    const ownerDelete=(id)=>{
        axios.delete("/super/ownerDelete/"+id,{
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        })
        .then(res=>{
            alert(res.data+"님을 삭제 했습니다.")
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
            <button onClick={()=>{dispatch({type:"UPDATE_AddMODAL", payload:true})}}> 사장님 추가</button>
            <AddModal show={addmodal} refresh={refresh} />
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
                        ownerlist.map((item)=><tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.userName}</td>
                            <td>{item.rank}</td>
                            <td>{item.role}</td>
                            <td>{item.regdate}</td>
                            <td>
                            <Button variant="warning" onClick={()=>{
                            dispatch({type:"UPDATE_UpMODAL", payload:true });
                            setUpid(item.id)
                            }}>
                                수정
                            </Button>    
                            </td>
                            <UpModal show={upmodal} refresh={refresh} id={upid}/>  
 
                            <td><Button variant="danger" onClick={()=>{
                                if(window.confirm("삭제할거냐?")){
                                    ownerDelete(item.id)
                                }else{
                                    console.log("취소")
                                }
                            }}>삭제</Button></td>
                            </tr>)
                    }
                </tbody>
            </Table>
        </div>
    );
}

function AddModal(props) {
    const dispatch=useDispatch()

    // 사장(owner) 추가
    const ownerInsert = () => {
        axios.post("/super/ownerInsert", ownerdata, { // 수정된 부분: onwerdata -> ownerdata
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        })
            .then(res => {
                console.log(res.data);
                alert(res.data+"님(owenr) 등록 되었습니다.")
                dispatch({type:"UPDATE_AddMODAL", payload:false})
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
    const [ownerdata,setOwnerdata] =useState({});
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
        <input type="text" placeholder="Password" name="password"  onChange={ownerChange}/>
        <input type="text" placeholder="userName" name="userName" onChange={ownerChange} />

        </Modal.Body>
        <Modal.Footer>
       
          <Button onClick={ownerInsert}>등록</Button>
          <Button onClick={()=>{dispatch({type:"UPDATE_AddMODAL", payload:false})}} >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function UpModal(props) {
    const dispatch = useDispatch();
     //state로 값을 관리
    const [owner, setOwner] = useState({
        id:"",
        userName:"",
        newId:""
    });
    //모달창에 입력값 바뀌면 state 값 바꾸기
    const handleChange = (e)=>{
        setOwner({
            ...owner,
            [e.target.name]:e.target.value
            
        })
        console.log("변경")
    }
    //해당 사장 정보 불러오기
    
    useEffect(()=>{
        axios.post("/super/getOwner",props.id, {
            headers: {
                Authorization: localStorage.token
            }
        })
        .then(res => {
            console.log(res.data)
            setOwner(res.data); // 단일 객체가 아닌 여러 개의 속성을 가진 객체를 업데이트 해야 함
        })
        .catch(error => {
            console.log(error);
        });
    },[props.id])
   

   
    const handleSave = ()=>{
        axios.put("/super/ownerUpdate/"+props.id,owner,{
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.token
            }
        })
        .then(res=>{
            //회원 목록 보기로 이동
            console.log(res.data)
            props.refresh()
            dispatch({type:"UPDATE_UpMODAL", payload:false})
        })
        .catch(error=>{
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
          {owner.id} 사장님
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <label htmlFor="newId">새로운 아이디</label>
        <input type="text" name="newId"  onChange={handleChange} />
        <label htmlFor="userName">이름</label>
        <input type="text" name="userName" value={owner.userName} onChange={handleChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            handleSave()
          }}>수정</Button>
          <Button onClick={() => {
            dispatch({ type: "UPDATE_UpMODAL", payload: false })
          }}>취소</Button>
        </Modal.Footer>
      </Modal>
    );
  }
  