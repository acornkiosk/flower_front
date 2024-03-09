import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";





function UpdateMenu() {
    const [category, setCategory] = useState([])
    const [menuData, setMenuData] = useState({
        name: '',
        category_id: '',
        price: '',
        summary: '',
        img_name: '',
        description: ''
    });

    const navigate = useNavigate()
    const [isSold, setIsSold] = useState(false);  // "true" true
    const [getViewImage, setGetViewImage] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [deleteImage, setDeleteImage] = useState(menuData.img_name)
    const fileInputRef = useRef(null);

    const { menuId } = useParams();

    const goToMenuMain = () => {
        navigate("/menu")
    };

    //메뉴 가져오기
    const getMenuInfo = (menuId) => {
        const requestData = {
            id: menuId,
        };
        axios.post("/api/menu/get", requestData)
            .then(res => {
                let checkedValue = res.data.dto.is_sold
                if (checkedValue === "true") {
                    res.data.dto.is_sold = true;
                } else {
                    res.data.dto.is_sold = false;
                }
                setMenuData(res.data.dto)
                setIsSold(res.data.dto.is_sold)

                if (res.data.dto.img_name != null) {
                    let img_name = res.data.dto.img_name
                    getMenuImage(img_name)
                }
            })

    }

    useEffect(() => {
        getCategory()
        getMenuInfo(parseInt(menuId, 10))


    }, [])

    const deleteMenu = () => {
        axios.post("/api/menu/delete", { "id": menuData.id })
            .then(res => {
                goToMenuMain()
            })
    }

    //카테고리 가져오기
    const getCategory = () => {
        axios.post("/api/common/child", { "code_id": 1000 })
            .then(res => {
                setCategory(res.data.list)
            })
    }

    // 서버에서 이미지 가져오기
    const getMenuImage = (img_name) => {
        axios.post("/upload/images", { name: img_name },
            { responseType: 'blob' })
            .then(res => {
                const reader = new FileReader()
                reader.readAsDataURL(res.data)
                reader.onload = (e) => {
                    setGetViewImage(e.target.result)
                }
            })
    }
    const menuUpdate = (e) => {
        e.preventDefault();
        // 요청 url 
        const url = "/api/menu/update";
        // 요청 방식
        // 전송할 폼 데이터
        const formData = new FormData(e.target);
        formData.append("id", parseInt(menuId))
        formData.append("is_sold", isSold.toString())

        axios.post(url, formData,
            { headers: { "Content-Type": "multipart/form-data" } })
            .then(res => {
                goToMenuMain()

            })

    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setMenuData({ ...menuData, [name]: value });
    };


    const handleImageChange = (e) => {
        //선택한 파일 얻어내기 or 불러온 파일
        const file = e.target.files[0]
        if (!file) {
            return; // 함수 종료
        }
        //선택한 파일로 부터 이미지 로딩하기
        const reader = new FileReader()
        reader.readAsDataURL(file)
        //로딩이 완료되었을 때 호출되는 함수 등록
        reader.onload = (event) => {
            //읽은 이미지 데이터
            const data = event.target.result
            setPreviewImage(data)
        }
    }
    const handleFileReset = () => {
        setPreviewImage(null)
        // 파일 입력(input) 요소를 초기화하려면 ref를 사용하여 해당 요소를 찾아서 초기화합니다.
        if (fileInputRef.current) {

            fileInputRef.current.value = ''; // 파일 입력 요소의 값(value)을 비웁니다.
            setDeleteImage(null)
            setGetViewImage(null)

        }

    };
    const handleCheckboxChange = (e) => {
        const newValue = e.target.checked;
        setIsSold(newValue);
    };

    const previewStyle = {
        "width": "200px",
        "height": "200px",
        borderRadius: "10px", // 여러단어 조합인 경우에는 카멜 케이스로 작성 가능
        cursor: "pointer"
    }



    return (
        <Container>
            <h1>메뉴 수정하기</h1>
            <Form onSubmit={(e) => menuUpdate(e)} className="text-bg-secondary p-3 rounded">
                <div className="d-flex justify-content-between" >
                    <div className="" style={{ width: '400px' }}>
                        <Form.Group className="mb-3">
                            <Form.Label  >카테고리</Form.Label>
                            <Form.Select name="category_id" key={menuData.category_id} onChange={handleChange} defaultValue={menuData.category_id} placeholder="카테고리 선택">
                                {category.map(item =>
                                    <option key={item.code_id} value={item.code_id}>{item.code_name}</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >메뉴 이름</Form.Label>
                            <Form.Control type="text" name="name" onChange={handleChange} value={menuData.name} placeholder="메뉴이름" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >가격</Form.Label>
                            <Form.Control type="number" name="price" onChange={handleChange} value={menuData.price} placeholder="가격" />
                        </Form.Group>
                        <Form.Group className="mb-3"></Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label >요약설명</Form.Label>
                            <Form.Control name="summary" onChange={handleChange} value={menuData.summary} placeholder="요약설명" />
                        </Form.Group>
                        <Form.Group className="mb-3"></Form.Group>
                    </div>
                    <div className="d-flex justify-content-center mx-auto ">
                        <div>
                            <Form.Group className="mb-3">
                                <Form.Label >품절 여부</Form.Label>
                                <Form.Check
                                    checked={isSold}
                                    onChange={handleCheckboxChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label >이미지 선택하기</Form.Label>
                                <div className="d-flex justify-content-center text-bg-light p-3">
                                    {(!getViewImage && !previewImage) ?
                                        <svg width="200" style={{ cursor: "pointer" }} height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="200" height="200" fill="#9C9B9B" onClick={() => { fileInputRef.current.click(); }} />
                                            <path d="M78.4358 66.536H81.0918V95.528H78.4358V66.536ZM65.8278 68.776C70.1158 68.776 73.1878 72.712 73.1878 78.856C73.1878 85.032 70.1158 88.968 65.8278 88.968C61.5718 88.968 58.4998 85.032 58.4998 78.856C58.4998 72.712 61.5718 68.776 65.8278 68.776ZM65.8278 71.176C63.0118 71.176 61.0278 74.184 61.0278 78.856C61.0278 83.56 63.0118 86.632 65.8278 86.632C68.6758 86.632 70.6278 83.56 70.6278 78.856C70.6278 74.184 68.6758 71.176 65.8278 71.176ZM88.5133 69.384H101.825V88.232H88.5133V69.384ZM99.2333 71.528H91.1053V86.088H99.2333V71.528ZM107.873 66.536H110.529V95.528H107.873V66.536ZM123.967 70.696H126.111V75.4C126.111 81.512 122.431 87.656 117.823 89.928L116.287 87.816C120.479 85.832 123.967 80.392 123.967 75.4V70.696ZM124.479 70.696H126.623V75.4C126.623 80.296 130.111 85.288 134.367 87.112L132.863 89.224C128.191 87.048 124.479 81.416 124.479 75.4V70.696ZM117.247 69.512H133.407V71.752H117.247V69.512ZM137.311 66.568H139.967V95.496H137.311V66.568ZM68.7718 108.288H71.1398V109.152C71.1398 114.048 65.9238 117.472 60.0038 118.368L59.0118 116.224C64.1318 115.552 68.7718 112.672 68.7718 109.152V108.288ZM69.8918 108.288H72.2278V109.152C72.2278 112.672 76.8998 115.552 82.0198 116.224L80.9958 118.368C75.1078 117.472 69.8918 114.048 69.8918 109.152V108.288ZM59.8118 107.008H81.2198V109.152H59.8118V107.008ZM57.4118 120.448H83.6198V122.624H57.4118V120.448ZM69.3798 121.792H72.0358V128.448H69.3798V121.792ZM60.7398 131.68H80.7078V133.856H60.7398V131.68ZM60.7398 125.664H63.3638V132.512H60.7398V125.664ZM107.873 105.536H110.529V134.528H107.873V105.536ZM88.5133 108H91.1373V115.648H99.4893V108H102.145V127.552H88.5133V108ZM91.1373 117.76V125.376H99.4893V117.76H91.1373ZM128.031 120.032H130.687V125.088H128.031V120.032ZM116.287 119.104H142.431V121.248H116.287V119.104ZM129.343 124.288C135.551 124.288 139.263 126.112 139.263 129.376C139.263 132.608 135.551 134.432 129.343 134.432C123.135 134.432 119.423 132.608 119.423 129.376C119.423 126.112 123.135 124.288 129.343 124.288ZM129.343 126.336C124.831 126.336 122.111 127.424 122.111 129.376C122.111 131.296 124.831 132.384 129.343 132.384C133.887 132.384 136.575 131.296 136.575 129.376C136.575 127.424 133.887 126.336 129.343 126.336ZM127.647 107.936H130.015V108.8C130.015 113.472 124.703 116.608 118.719 117.344L117.759 115.232C122.943 114.688 127.647 112.096 127.647 108.8V107.936ZM128.767 107.936H131.103V108.8C131.103 112.096 135.807 114.688 140.991 115.232L140.031 117.344C134.047 116.608 128.767 113.472 128.767 108.8V107.936ZM118.687 106.88H140.095V109.024H118.687V106.88Z" fill="white" />
                                        </svg>
                                        :
                                        (!previewImage ? <img src={getViewImage} onClick={() => { fileInputRef.current.click(); }} style={previewStyle} alt="메뉴 이미지" /> :
                                            <img src={previewImage} onClick={() => { fileInputRef.current.click(); }} style={previewStyle} alt='미리보기 이미지' />)} <br />
                                    <input type="file" name="image" onClick={() => { fileInputRef.current.click(); }} ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} accept="image/*" />
                                </div>
                                <div className="d-flex justify-content-center mt-2 ">
                                    <input type="text" name="img_name" style={{ display: "none" }} onChange={handleChange} value={menuData.img_name} accept="image/*" />
                                    <Button onClick={handleFileReset}>이미지 취소</Button>
                                </div>
                            </Form.Group>
                        </div>
                    </div>
                </div>
                <div>
                    <Form.Group className="mb-3">
                        <Form.Label >상세설명</Form.Label>
                        <Form.Control as="textarea" style={{ height: '100px' }} name="description" onChange={handleChange} value={menuData.description} placeholder="상세설명" />
                    </Form.Group>
                    <div className="d-flex justify-content-center ">
                        <Button onClick={() => { navigate('/menu') }} style={{ marginRight: '15px' }}>취소</Button>
                        <Button variant="success" type="submit" style={{ marginRight: '15px' }} >수정</Button>
                        <Button variant="btn btn-danger" onClick={deleteMenu}>삭제</Button>
                    </div>
                </div>
            </Form>

        </Container>

    )
}

export default UpdateMenu

