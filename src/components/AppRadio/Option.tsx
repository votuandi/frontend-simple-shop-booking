interface OptionProps {
  index: number
  selectedIndex?: number
  onSelect: (index: number) => void
  text: string
}

const Option = (props: OptionProps) => {
  const isSelected = props.index === props.selectedIndex
  return (
    <div className="flex flex-row items-center">
      <div className={`flex items-center rounded-full w-4 h-4  border-2 border-app-brown  ${isSelected}`} onClick={() => props.onSelect(props.index)}>
        <div className={`rounded-full w-4 h-4 mr-[15px] ${isSelected ? 'bg-app-brown  text-white font-bold' : ''}`}>
          {isSelected && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              viewBox="0 0 22 17"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-1 justify-between ml-[15px] w-fit">
        <span className="text-app-brown   text-xs font-bold lg:font-normal lg:text-sm">{props.text}</span>
      </div>
    </div>
  )
}

export default Option
