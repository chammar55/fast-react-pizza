import { Outlet } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import Header from "./Header";

function AppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* For eccessimg children routes within AppLayout */}
      </main>
      <CartOverview />
    </div>
  );
}

export default AppLayout;
