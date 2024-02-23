import axios from "axios"
import { useEffect, useState } from "react"
import { Button, Container, Form } from "react-bootstrap"

function AddMenu(){
    const [category,setCategory] = useState([])
    useEffect(()=>{
        getCategory()
    },[])
    
    const getCategory= ()=>{
        axios.post("/api/common/child", 1000,
        { headers: { "Content-Type": "application/json" } })
        .then(res => {
          console.log(res.data.list)
          setCategory(res.data.list)
        })
    }
    const menuInput =(e)=>{
        e.preventDefault();
    
        // 요청 url 
        const url = "/api/menu";
        // 요청 방식
        // 전송할 폼 데이터
        const formData = new FormData(e.target);
    
        axios.post(url, formData,
            { headers: { "Content-Type": "multipart/form-data" } })
            .then(res=>{
                console.log(res.data);
            }) 
       
    }


    return(
        <Container>
            
            <h1>메뉴 등록하기</h1>
            여기서 메뉴를 등록하시면 됩니다.
            <Form onSubmit={(e)=>menuInput(e)}>
            <fieldset >
                <Form.Group className="mb-3">
                <Form.Label >메뉴 이름</Form.Label>
                <Form.Control type="text" name="name" placeholder="메뉴이름" />
                </Form.Group>
                <Form.Group className="mb-3">

                <Form.Label >카테고리</Form.Label>
                <Form.Select name="category_id" >
                    <option>카테고리 선택</option>
                    {category.map(item=>

                     <option key={item.code_id} value={item.code_id}>{item.code_name}</option>
                    
                    )}
                    
                </Form.Select>

                <Form.Group className="mb-3">
                <Form.Label >가격</Form.Label>
                <Form.Control  type="number" name="price" placeholder="가격" />
                </Form.Group>
                <Form.Group className="mb-3"></Form.Group>

                <Form.Group className="mb-3">
                <Form.Label >요약설명</Form.Label>
                <Form.Control name="summary" placeholder="요약설명" />
                </Form.Group>
                <Form.Group className="mb-3"></Form.Group>

                <Form.Group className="mb-3">
                <Form.Label >상세설명</Form.Label>
                <Form.Control  name="description" placeholder="상세설명" />
                </Form.Group>
                <Form.Group className="mb-3"></Form.Group>


                <input type="file" name="image" accept="image/*"  />
                    
              
                </Form.Group>

                {/* <Form.Group className="mb-3">
                <Form.Check
                    type="checkbox"
                    id="disabledFieldsetCheck"
                    label="Can't check this"
                />
                </Form.Group> */}
                <Button type="submit">Submit</Button>
            </fieldset>
            </Form>
       
        </Container>
       
    )
}

export default AddMenu

