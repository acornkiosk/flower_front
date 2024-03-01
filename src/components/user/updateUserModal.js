import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

// /** 사용자 정보 수정 모달 */
export default function UpdateModal(props) {

    const { userId } = props;
    const [Rank,setRank]=useState([])
    const [userData,setUserData]=useState([])
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    //직급불러오기
    const getRank= ()=>{
      
      axios.post("/api/common/child", {"code_id": 3000},
      { headers: { "Content-Type": "application/json" } })
      .then(res => {
        console.log("직급 리스트:"+res.data.list)
        setRank(res.data.list)
      }) 
      .catch(error=>{
        console.log("직급리스트: "+ error)
      }) 
    }
    // user정보 불러오기
    const getUser= ()=>{
      
      axios.post("/api/user/get",{ id:userId},
      { headers: { "Content-Type": "application/json" } })
      .then(res=>{
        console.log("userData: " +res.data.dto)
        setUserData(res.data.dto);
       
        
      })
      .catch(error=>{
        console.log(error);
           
      })
    }
    
    const userUpdate =(e)=>{
      e.preventDefault();
     
      const url = "/api/user/update";
      const formData = new FormData(e.target);
  
      axios.post(url, formData,
        { headers: { "Content-Type": "application/json" } })
          .then(res=>{
              console.log(res.data);
              props.onHide(); 
              props.onUserUpdate();
              
          })  
    }
  
    
  
    useEffect(() => {
     
      getRank()
     
  
    }, [])

    
    // useEffect(() => {
    //     getUser();
    // }, [userId]);//userId 값이 바뀔때 마다 초기화

    useEffect(() => {
        // 모달이 닫힐 때 userData 초기화
        getUser();
        return () => {
            setUserData({});
        };
    }, [props.show]); // 모달이 열릴 때마다 userData 초기화
  



    // userData가 비어 있을 때 모달 렌더링 방지 "깜빡거림 방지"
    if (!userData.id) {
        return null;
    }

    return (
      
      <Modal
        {...props}
        size="xl"
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Form onSubmit={(e)=>userUpdate(e)}>
      
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
            </Modal.Title>
          </Modal.Header>
  
          <Modal.Body >
          <div>
            
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1" > 이름 : </Form.Label>
           
            <Col><p>{userData.userName}</p></Col>
          </Form.Group>
  
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1"> 아이디 : </Form.Label>
            <input type="hidden" name="id" value={userData.id}  />
            <Col><p>{userData.id}</p></Col>
             
          </Form.Group>
  
          <Form.Group as={Row}>
            <Form.Label column md="1"  type="text"   > 입사일 : </Form.Label>
            <Col><p>{userData.regdate}</p></Col>
            
          </Form.Group>
          <input type="text" name="role"  onChange={handleChange} defaultValue={userData.role} />
          <Form.Group as={Row} className="mb-3">
            <Form.Label column md="1" > 직급 : </Form.Label>
            <Col md="5">
              <Form.Select aria-label="직급" onChange={handleChange} value={userData.rank} name='rank'>
                {Rank.map((item,index)=>{
                  if(index<2) return null;
                  return <option value={item.code_id}>{item.code_name}</option>
                })}
  
              </Form.Select>
            </Col>
          </Form.Group>
          </div>
          </Modal.Body>
         
          <Modal.Footer>
            <Button variant="danger">직원삭제</Button>
            <Button variant="success" type="submit">저장</Button>
            <Button variant="danger" onClick={props.onHide}>취소</Button>
          </Modal.Footer>
  
        </Form>
       
      </Modal>
    )
  }