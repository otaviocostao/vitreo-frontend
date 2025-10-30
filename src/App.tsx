import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SharedLayout from './components/SharedLayout'
import ClientsPage from './pages/ClientsPage'
import SalesPage from './pages/SalesPage'
import StockPage from './pages/StockPage'
import SuppliersPage from './pages/SuppliersPage'
import SettingsPage from './pages/SettingsPage'
import RegisterProductPage from './pages/RegisterProductPage'
import RegisterSupplierPage from './pages/RegisterSupplierPage'
import RegisterClientPage from './pages/RegisterClientPage'
import RegisterSellPage from './pages/RegisterSellPage'

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
                element={<RegisterSellPage />}
              />
          <Route
                path="/clientes"
                element={<ClientsPage />}
              />
          <Route
                path="/clientes/novo"
                element={<RegisterClientPage />}
              />
          <Route
                path="/clientes/:id"
                element={<RegisterClientPage />}
              />
          <Route
                path="/produtos"
                element={<StockPage />}
              />
          <Route
                path="/produtos/novo"
                element={<RegisterProductPage />}
              />
          <Route
                path="/produtos/:id"
                element={<RegisterProductPage />}
              />
          <Route
                path="/fornecedores"
                element={<SuppliersPage />}
              />
          <Route
                path="/fornecedores/novo"
                element={<RegisterSupplierPage />}
              />
          <Route
                path="/fornecedores/:id"
                element={<RegisterSupplierPage />}
              />
          <Route
                path="/ajustes"
                element={<SettingsPage />}
              />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
