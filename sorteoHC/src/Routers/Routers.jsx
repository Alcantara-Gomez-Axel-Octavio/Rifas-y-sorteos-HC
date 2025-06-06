import { BrowserRouter, Routes, Route } from "react-router-dom"; // Correctamente importado
import HomePage from "../HomePage/HomePage";
import MetodosDePago from "../MetodosDePago/MetodosDePagoPage";
import ComprarBoletos from "../ComprarBoletos/ComprarBoletosPage.jsx";
export function MyRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/MetodosDePago" element={<MetodosDePago />} />
                <Route path="/ComprarBoletos" element={<ComprarBoletos />} />
            </Routes>
        </BrowserRouter>
    );
}
