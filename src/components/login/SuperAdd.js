import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal, Table } from "react-bootstrap";


export default function SuperAdd() {

     //사장님(owner) 리스트 관리
     const [ownerlist,setOwnerlist] =useState([]);
    

    //화면 refresh 하기
    const refresh=()=>{
        axios.get("/super/ownerList"
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
    //modal 관리
    const [modalShow, setModalShow] = useState(false);
    //const isShow= useSelector(state => state.isShow) <LoginModal show={!isSHow}></LoginModal>

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
            <h1>super 등록 (관리자 모드)</h1>
          
            <br/>

            <h4>사장님(OWENR) 목록</h4>
            <button onClick={() => setModalShow(true)}> 사장님 추가</button>
            <TestModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            
            />
            <Table>
                <thead>
                    
                    <tr>
                        <td>ID</td>
                        <td>USERNAME</td>
                        <td>RANK</td>
                        <td>ROLE</td>
                        <td>REGDATE</td>
                        <td>삭제</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        ownerlist.map(item=><tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.userName}</td>
                            <td>{item.rank}</td>
                            <td>{item.role}</td>
                            <td>{item.regdate}</td>
                            <td><button onClick={()=>{
                       
                                if(window.confirm("삭제할거냐?")){
                                    ownerDelete(item.id)
                                }else{
                                    console.log("취소")
                                }
                            }}>삭제</button></td>
                        </tr>)
                    }
                </tbody>
            </Table>
        </div>
    );
}

function TestModal(props) {
     //modal 관리
     const [modalShow, setModalShow] = useState(false);
     
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
                props.onHide();
                alert(res.data+"님(owenr) 등록 되었습니다.")
                props.refresh();
               
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
    const [ownerdata,setOwnerdata] =useState([]);
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
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
          <Button onClick={(props.onHide)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
