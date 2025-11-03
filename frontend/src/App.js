import "./App.css";
import Navbar from "./views/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import { routeController } from "./controllers/route.controller";

import Mensaje from "./views/Mensaje/Mensaje";

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          {routeController.map((r, index) => (
            <Route key={index} path={r.path} element={r.element} />
          ))}
        </Routes>
      </main>
      <Mensaje />
    </>
  );
}

export default App;
