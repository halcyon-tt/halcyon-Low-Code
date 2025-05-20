import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/home";
const router = createBrowserRouter([
  {
    path:"/",
    element:(
      <Home/>
    )
  },
  {
    path:"/home",
    element:(
      <Home/>
    )
  }
]);

export default router;