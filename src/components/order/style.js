const style = {
    // 모달 배경
    customModal: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    
    // 모달 헤더
    customModalHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      borderBottom: 'none'
    },
    
    // 모달 내용
    customModalBody: {
      padding: '20px'
    },
    
    // 모달 푸터
    customModalFooter: {
      backgroundColor: '#f8f9fa',
      borderTop: 'none'
    },
    
    // 완료 버튼 스타일
    customModalFooterPrimaryBtn: {
      backgroundColor: '#28a745',
      borderColor: '#28a745'
    },
    
    // 주문 취소 버튼 스타일
    customModalFooterDangerBtn: {
      backgroundColor: '#dc3545',
      borderColor: '#dc3545'
    },

    // 주문 알림 메시지
    orderMessageToast: {
      /** 부모객체(div참고) 기준으로 좌표를 찍는다. */
      position: 'absolute',
      /** UI상으로 묘하게 가운데처럼 보이는 자리 */
			left: '45%'
    }
  };
  
  export default style;
  