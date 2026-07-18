import {
  Boxes,
  Building2,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import SidebarButton from "./ui/SidebarButton";
import SidebarAccordion from "./ui/SidebarAccordion";
import { handleLogout } from "../services/authService";

const Sidebar = () => {
  const iconSize = 18;
  const handleLogoutCall = async () => {
    await handleLogout();
  }


  return (
    <div className="w-60 flex flex-col justify-between items-center border-r-1 border-gray-200 bg-white h-full print:hidden">
      <div className="w-full flex flex-col justify-items-center box-border p-2 gap-3">
        <SidebarButton
          page_name="Início"
          to="/"
          icon={<LayoutDashboard size={iconSize} />}
          end
        />

        <SidebarAccordion
          page_name="Vendas"
          icon={<ShoppingCart size={iconSize} />}
          items={[
            { page_name: "Nova venda", to: "/vendas/nova" },
            { page_name: "Listagem de vendas", to: "/vendas" },
          ]}
        />

        <SidebarAccordion
          page_name="Clientes"
          icon={<Users size={iconSize} />}
          items={[
            { page_name: "Novo cliente", to: "/clientes/novo" },
            { page_name: "Listagem de clientes", to: "/clientes" },
          ]}
        />

        <SidebarAccordion
          page_name="Estoque"
          icon={<Boxes size={iconSize} />}
          items={[
            { page_name: "Novo produto", to: "/produtos/novo" },
            { page_name: "Listagem de produtos", to: "/produtos" },
          ]}
        />

        <SidebarAccordion
          page_name="Fornecedores"
          icon={<Building2 size={iconSize} />}
          items={[
            { page_name: "Novo fornecedor", to: "/fornecedores/novo" },
            { page_name: "Listagem de fornecedores", to: "/fornecedores" },
          ]}
        />
      </div>
      <div className="w-full flex flex-col justify-items-center box-border p-2 gap-3">
        <SidebarButton
          page_name="Ajustes"
          to="/ajustes"
          icon={<Settings size={iconSize} />}
          end
        />
        <SidebarButton
          page_name="Sair"
          onClick={handleLogoutCall}
          icon={<LogOut size={iconSize} />}
          end
        />
      </div>
    </div>
  );
};

export default Sidebar;
