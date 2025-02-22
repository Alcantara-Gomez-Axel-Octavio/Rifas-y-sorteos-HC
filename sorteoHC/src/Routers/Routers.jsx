import { BrowserRouter, Routes, Route } from "react-router-dom"; // Correctamente importado
import HomePage from "../HomePage/HomePage";
import MetodosDePago from "../MetodosDePago/MetodosDePagoPage";
import ComprarBoletos from "../ComprarBoletos/ComprarBoletosPage.jsx";
import Login from "../Login/LoginPage.jsx";

export function MyRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/MetodosDePago" element={<MetodosDePago />} />
                <Route path="/ComprarBoletos" element={<ComprarBoletos />} />
                <Route path="/Login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}
