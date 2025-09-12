
interface HeaderTitleProps {
  page_name: string
}

const HeaderTitlePage = (props: HeaderTitleProps) => {
  return (
    <div className='w-fit h-fit box-border p-4 '>
      <h1 className="text-2xl text-blue-600 font-semibold border-l-4 pl-2 m-1"> {props.page_name}</h1>
    </div>
  )
}

export default HeaderTitlePage
