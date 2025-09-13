import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import NovaVenda from './pages/NovaVenda'
import NovoCliente from './pages/NovoCliente'
import SharedLayout from './components/SharedLayout'
import ClientsPage from './pages/ClientsPage'
import SalesPage from './pages/SalesPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route
                index
                element={<Home />}
              />
          <Route
                path="/vendas"
                element={<SalesPage />}
              />
          <Route
                path="/vendas/nova"
                element={<NovaVenda />}
              />
          <Route
                path="/clientes"
                element={<ClientsPage />}
              />
          <Route
                path="/clientes/novo"
                element={<NovoCliente />}
              />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
