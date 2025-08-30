import React from 'react'
import SidebarButton from './ui/SidebarButton'

const Sidebar = () => {
  return (
    <div className='w-65 flex flex-col justify-between items-center border-r-1 border-gray-200 h-full'>
      
      <div className='w-full flex flex-col justify-items-center box-border p-2 gap-3'>
        <SidebarButton page_name='Início' to='/' />
        <SidebarButton page_name='Nova Venda' to='/vendas-nova' />
        <SidebarButton page_name='Vendas' to='/vendas' />
        <SidebarButton page_name='Clientes' to='/clientes' />
        <SidebarButton page_name='Estoque' to='/estoque' />
      </div>
      <div className='w-full flex flex-col justify-items-center box-border p-2 gap-3'>
        <SidebarButton page_name='Sair' to='/login'/>
      </div>
    </div>
  )
}

export default Sidebar
