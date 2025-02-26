import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../AuthContext/AuthContext.jsx";
import HomePage from "../HomePage/HomePage";
import MetodosDePago from "../MetodosDePago/MetodosDePagoPage";
import ComprarBoletos from "../ComprarBoletos/ComprarBoletosPage.jsx";
import Login from "../Login/LoginPage.jsx";
import AdministradorPage from "../Administrador/AdministradorPage.jsx";
import PrivateRoute from "../PrivateRoute/PrivateRoute.jsx";

export function MyRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/MetodosDePago" element={<MetodosDePago />} />
          <Route path="/ComprarBoletos" element={<ComprarBoletos />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Administrador" element={<PrivateRoute element={<AdministradorPage />} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
