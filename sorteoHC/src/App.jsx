import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/datos")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error:", error));
  }, []);

  return (
    <div>
      <h1>Datos desde MySQL</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
