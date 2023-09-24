interface PageHeaderProps {
  title: string
  subheader: string
  icon: string
}
const PageHeader = ({ title, subheader, icon }: PageHeaderProps) => {
  return (
    <div className='flex space-x-10 items-center border-b border-gray-200 dark:border-gray-800 pb-4'>
      <div className='w-16 h-16 rounded-lg flex items-center justify-center text-center text-2xl bg-emerald-500/20 '>
        {icon}
      </div>
      <div>
        <h2 className='text-gray-800 dark:text-white text-xl md:text-2xl font-semibold'>{title}</h2>
        <p className='text-gray-500 text-sm'>{subheader}</p>
      </div>
    </div>
  )
}

export default PageHeader
