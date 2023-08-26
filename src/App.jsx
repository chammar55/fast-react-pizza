import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./ui/Home";
import Error from "./ui/Error";
import Menu, { loader as menuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import CreateOrder from "./features/order/CreateOrder";
import Order from "./features/order/Order";
import AppLayout from "./ui/AppLayout";

// This is to use the data fetching using react-router
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />, // (error handling) NOTE: if we place it here in parent then any error occur in children will be handle by this unless its handled in child itself, like we handle in bellow menu route
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: menuLoader, // This loader will use menuloader function to load the data in this page
        errorElement: <Error />, // (error handling ) it will deal with the error occur in this page
      },
      { path: "/cart", element: <Cart /> },
      { path: "/order/new", element: <CreateOrder /> },
      { path: "/order/:orderId", element: <Order /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
