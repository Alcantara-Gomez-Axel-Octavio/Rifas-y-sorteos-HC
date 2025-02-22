import './App.css'
import { useState, useEffect } from 'react'
import { MyRoutes } from './Routers/Routers';

function App() {
  // Si no necesitas cargar datos de esta ruta, puedes eliminar el useEffect
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   fetch("http://localhost:3001/api/datos")
  //     .then(response => response.json())
  //     .then(data => setData(data))
  //     .catch(error => console.error("Error:", error));
  // }, []);

  return (
    <div className="App">
      <MyRoutes/>      
    </div>
  );
}

export default App;
