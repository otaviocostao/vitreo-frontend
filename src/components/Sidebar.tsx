
import { Boxes, LayoutDashboard, PlusCircle, ShoppingCart, Users } from 'lucide-react'
import SidebarButton from './ui/SidebarButton'

const Sidebar = () => {
  const iconSize = 18;

  return (
    <div className='w-65 flex flex-col justify-between items-center border-r-1 border-gray-200 bg-white h-full'>
      
      <div className='w-full flex flex-col justify-items-center box-border p-2 gap-3'>
        <SidebarButton 
        page_name='Início' 
        to='/' 
        icon={<LayoutDashboard size={iconSize} />}
        end 
      />
      <SidebarButton 
        page_name='Nova Venda' 
        to='/vendas/nova' 
        icon={<PlusCircle size={iconSize} />}
        end 
      />
      <SidebarButton 
        page_name='Vendas' 
        to='/vendas' 
        icon={<ShoppingCart size={iconSize} />} 
        end
      />
      <SidebarButton 
        page_name='Clientes' 
        to='/clientes' 
        icon={<Users size={iconSize} />}
        end 
      />
      <SidebarButton 
        page_name='Estoque' 
        to='/estoque' 
        icon={<Boxes size={iconSize} />} 
        end
      />
      </div>
    </div>
  )
}

export default Sidebar
