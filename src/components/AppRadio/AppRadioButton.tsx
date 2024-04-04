import React, { useState } from 'react'
import Option from './Option'

interface IProps {
  options: string[]
  onChange?: (selectedIndex: number) => void
  value?: number
}
const AppRadioButton = ({ options, onChange, value }: IProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(value)
  function onSelect(index: number) {
    setSelectedIndex(index)
    onChange && onChange(index)
  }
  return (
    <div>
      <div className="flex justify-between">
        {options.map((el, index) => (
          <Option key={index} index={index} selectedIndex={selectedIndex} onSelect={(index) => onSelect(index)} text={el} />
        ))}
      </div>
    </div>
  )
}
export default AppRadioButton
