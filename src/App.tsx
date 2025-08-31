import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import NovaVenda from './pages/NovaVenda'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route 
              path="/" 
              element={<Home />}
            />
        <Route 
              path="/vendas/nova" 
              element={<NovaVenda />}
            />
      </Routes>
    </BrowserRouter>
  )
}

export default App
