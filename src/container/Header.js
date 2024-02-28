import Cart from "../components/cart/Cart";
import HeaderImg from "../components/header/HeaderImg";
import HeaderMenu from "../components/header/HeaderMenu";

export default function Header() {
  return (
    <div>
      <HeaderImg/>
      <HeaderMenu/>
      <Cart/>
    </div>
  )
}