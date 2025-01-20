import { createBrowserRouter } from "react-router-dom";
import Detail from "./pages/Detail";
import App from "./App";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "pokemon/:pokemonId",
        element: <Detail />,
      },
    ],
  },
]);

export default router;
