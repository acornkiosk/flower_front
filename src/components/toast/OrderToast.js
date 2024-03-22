import { Toast } from "react-bootstrap"
import { useDispatch } from "react-redux"
import style from "../order/style"
import { useEffect } from "react"

export default function OrderToast() {
  const dispatch = useDispatch()

  /** 알림소리 => 크롬 음악정책 */
  // useEffect(() => {
  //   const dieSound = new Audio("/sounds/DingDong.mp3");
  //   dieSound.currentTime = 0;
  //   dieSound.play();
  // }, []);
  
  return (
    <>
      <Toast
        style={style.orderMessageToast}
        onClose={() => {
          dispatch({ type: "SET_TOAST", payload: false })
        }}
        delay={3000} autohide
        variant="success">
        <Toast.Header>
          <strong className="me-auto">매출상승!</strong>
          <small>일하자</small>
        </Toast.Header>
        <Toast.Body>새로운 주문이 들어왔습니다</Toast.Body>
      </Toast>
    </>
  )
}