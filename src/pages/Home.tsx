import Header from "../components/Header";
import HeaderTitlePage from "../components/HeaderTitlePage";
import Sidebar from "../components/Sidebar";
import TopDashboardCard from "../components/TopDashboardCard";

function Home() {

  return (
    <div className="w-full flex flex-col flex-1 h-screen" >
        <Header />
        <div className="w-full flex flex-1 ">
          <Sidebar />
          <div className="flex flex-1 flex-col w-fit box-border">
            <HeaderTitlePage page_name="Dashboard"/>
            <div className="w-full flex flex-1 flex-col p-4 box-border">
              <div className="flex gap-5">
                <TopDashboardCard title="Vendas no periodo" value={"84"} percentual={10} />
                <TopDashboardCard title="Valor total das vendas" value={"R$45.119,00"} percentual={15}/>
                <TopDashboardCard title="Ticket médio das vendas" value="R$539,00" percentual={5}/>
                <TopDashboardCard title="Novos clientes" value="23" percentual={5}/>
              </div>

            </div>
          </div>          
        </div>
    </div>
  )
}

export default Home;