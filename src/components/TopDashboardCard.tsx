import { MoveUpRight } from 'lucide-react';

interface TopCardProps {
  title: string;
  value: string;
  percentual: number;
}


const TopDashboardCard = (props: TopCardProps) => {
  return (
    <div className=" w-full flex flex-col gap-1 border-1 border-gray-200 rounded-2xl box-border p-4">
      <p className="text-gray-700">{props.title}</p>
      <h1 className="text-4xl font-semibold">{props.value}</h1>
      <div className="flex items-center gap-1 p-1 box-border bg-green-200 w-fit rounded-2xl mt-1">
        <p className="font-semibold text-green-800">+{props.percentual}%</p>
        <MoveUpRight size={20} className='text-green-800' />
      </div>
    </div>
  )
}

export default TopDashboardCard
