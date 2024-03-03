import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Col, Form, Modal, Row } from "react-bootstrap"

/** 사용자 정보 등록 모달 */
export default function InsertModal(props) {

 
   
    const [Rank,setRank]=useState([])
    const labelStyle = {
        textAlign: 'right'
      };

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

    const userInput =(e)=>{
        e.preventDefault();
        
        const url = "/api/user/add";
        const formData = new FormData(e.target);

        axios.post(url, formData,
        { headers: { "Content-Type": "application/json" } })
            .then(res=>{
                console.log(res.data);
                props.onHide(); 
                props.onUserAdded();
            })  
    }



    useEffect(() => {
        getRank()
        

    }, [])


    return (
        
        <Modal
        {...props}
        size="lg"
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        >
        <Form onSubmit={(e)=>userInput(e)}>

            <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
            </Modal.Title>
            </Modal.Header>

            <Modal.Body >
            <Form.Group as={Row} className="mb-3">
                <Form.Label   style={labelStyle} column md="2"> 아이디 : </Form.Label>
                <Col md="3"><Form.Control type='text' name='id' /></Col>
                <Form.Label style={labelStyle} column md="2"> 비밀번호 : </Form.Label>
                <Col md="3"><Form.Control type='text' name='password' /></Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Form.Label style={labelStyle} column md="2" > 이름 : </Form.Label>
                <Col md="3"><Form.Control type='text' name='userName' /></Col>
            
                <Form.Label style={labelStyle} column md="2" > 직급 : </Form.Label>
                <Col md="3">
                <Form.Select aria-label="직급" name='rank'>
                    {Rank.map((item,index)=>{
                    if(index<2) return null;
                    return <option key={item.code_id} value={item.code_id}>{item.code_name}</option>
                    })}

                </Form.Select>
                </Col>
            </Form.Group>

            <Form.Group as={Row}>

                <Form.Label style={labelStyle} column md="2"  type="date"  > 입사일 : </Form.Label>
                
                <Col md="3">
                <input type="date" name="regdate" />

                </Col>
                <Form.Label column md="1"></Form.Label>
                <Col md="5"></Col>
            </Form.Group>

            </Modal.Body>

            <Modal.Footer>
            <Button variant="success" type="submit">추가</Button>
            <Button variant="danger" onClick={props.onHide}>취소</Button>
            </Modal.Footer>

        </Form>

        </Modal>
    )
}