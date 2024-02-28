import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function Cart() {
  const orders = useSelector(state => state.orders)
  console.log("orders")
  return (
    <>
      <Container className="border border-5 rounded">

      </Container>
    </>
  )
}