
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState, useEffect } from 'react'
import { MyRoutes } from './Routers/Routers';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/datos")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div className="App">
      <MyRoutes/> 
      <div className='Desarrolladores'>
        
      </div>
        
    </div>

  );
}

export default App;
