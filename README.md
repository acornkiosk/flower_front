# flower kiosk

**팀 프로젝트의 프론트 엔드 Repository 입니다.**

[백엔드 Repositroy](https://github.com/acornkiosk/Flower_back)

## 프로젝트 특징

## 프로젝트 특징

* React, Spring Boot을 기반으로 꽃을 판매하는 키오스크 서비스
    
* 프론트엔드와 백엔드를 분리하여 프로젝트 개발
    * 각 파트의 별도 Repository를 생성 후 작업
    * 프론트 : React 프레임워크 이용
    * 백엔드 : Spring Boot를 이용

* 회원가입은 X

* 로그인 처리는 Spring Boot Security와 Jwt Token방식으로 처리

* 초기 더미데이터는 DBeaver를 통한 DB에 직접 삽입
  
* RestApi 방식으로 CRUD 구현
    * 키오스크 정보 추가, 조회, 수정, 삭제, 키오스크 전원 변경   
    * 메뉴 정보 추가, 조회, 수정, 삭제
    * 사용자 정보 추가, 조회, 수정, 삭제
    * 주문 정보 추가, 조회, 수정, 삭제

## 개요

* 명칭 : flower_kiosk

* 개발 인원 : 7명

* 개발 기간 : 2024.02.18 ~ 2024.03.29

* 주요 기능 
	* 키오스크 관리 : 추가, 조회, 삭제, 위치 변경, 전원 변경
	* 메뉴 관리 : 추가, 조회, 수정, 삭제
	* 사용자 관리 : 추가, 조회, 수정, 삭제 
	* 주문 관리 : 추가, 조회, 수정 , 삭제
	* 로그인 관리 : 로그인 role 설정, Jwt를 이용한 로그인 상태 유지

* 개발 언어 : JavaScript

* 개발 라이브러리 : React.js

* 형상 관리 툴 : git

* 협업 툴 : Notion 
* 간단 소개 : 꽃 키오스크 서비스 프로젝트
## 사용 패키지

* React Bootstrap, Icons
  * 각종 아이콘
* bootstrap
  * 부트스트랩과 react를 연동
* axios
  * 서버 통신을 위한 패키지
* react-router-dom
  * 라우팅을 위한 패키지
* react-redux, redux
  * 프론트엔드에서 데이터의 전역관리를 위한 패키지

## 테이블 설계
![flowerDB](https://github.com/acornkiosk/flower_front/assets/94777814/b7e18eef-0821-4096-9b0a-5901e8ba38c2)

## API 설계
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/6824e7d2-e84c-4a5a-99f8-be109596d44d)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/7d834a8d-638b-46da-a27e-f31ef82be611)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/1bc0943a-ff3a-4432-a1fb-cfd4982b3fe7)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/aabaf8a9-3c89-4055-a831-a19ddbef72dd)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/32aa5b4c-6eb5-4137-aecd-375539b26f7c)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/9e72a990-f936-4132-bc4f-ff6d0fead894)
## 로그인 프로세스
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/769b7e44-8d16-45f4-808d-7af70177fd63)
![image](https://github.com/acornkiosk/Flower_back/assets/94777814/957b97ec-fc02-4e73-a76b-cb2fe456cd52)

## 개발 역할분담 (프론트)

| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |
| 김동주         | 주문관리 키오스크 관리 페이지, 초기 프로젝트 셋팅 |  |                          


| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |
| 김대원         | 메뉴 관리 페이지 |  |                         
| 이승우         | 메뉴정보 조회기능 |     


| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |
| 이준호         | 사용자 관리 페이지 |  |                       
| 오영찬         | 사용자 관리 페이지 |         


| 이름       | 진행 목록                                                    |
| ------------ | ------------------------------------------------------------- |
| 정도경         | 로그인 관리 페이지 |  |                         
| 이안철         | 로그인 관리 페이지 |  
## 개발 타임라인

## 개발 타임라인(백엔드, 프론트 공통)

| 일자       | 진행 목록                                                    |
| ---------- | ------------------------------------------------------------ |
| 2024.02.17 | [ 프로젝트 화면계획서 V0.1 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br />백엔드 Repository 생성 |
| 2024.02.19 | [ 프로젝트 화면계획서 V0.3 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) |
| 2024.02.20 | [ 프로젝트 화면계획서 V0.5 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> 키오스크 관리 DB, API 추가|
| 2024.02.21 | [ 프로젝트 화면계획서 V0.6 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> 주문 관리 DB, API 추가<br/> 프론트 Repository 생성|
| 2024.02.23 | [ 프로젝트 화면계획서 V0.7 작성](https://drive.google.com/drive/folders/19cVOkx5jpWMl9KqFia3Dd_BrflqpRaVl) <br/> API 명세서 작성|
| 2024.02.24 | 키오스크 관리 기능 완료|


## Contents

### 메인 페이지


### 로그인 관리 페이지



### 키오스크 관리 페이지

### 주문 관리 페이지

### 사용자 관리 페이지

### 메뉴 관리 페이지
