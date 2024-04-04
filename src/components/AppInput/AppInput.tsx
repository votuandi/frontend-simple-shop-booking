import * as React from 'react'
import styled from '@emotion/styled'

interface InputProps {
  className?: string
  containerStyle?: React.CSSProperties
  errors?: boolean
  disabled?: boolean
  inputStyle?: React.CSSProperties
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  readOnly?: boolean
  required?: boolean
  type?: string
  value: string
  wrapperStyle?: React.CSSProperties
}
const InputComponent: React.FC<InputProps> = ({
  className,
  containerStyle,
  errors,
  disabled,
  inputStyle,
  name,
  onChange,
  placeholder,
  readOnly,
  required,
  type,
  value,
  wrapperStyle,
}) => {
  const inputRef = React.useRef(null)

  return (
    <div className={className}>
      <div className="h-full">
        <input
          ref={inputRef}
          aria-label={name}
          data-testid={name}
          tabIndex={0}
          type={type}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          style={inputStyle}
          disabled={disabled}
          readOnly={readOnly}
          className="text-[#745039] w-full text-xl p-4 border-b-2 border-[#745039]-500 transition-all duration-200 bg-transparent  ::placeholder border-[#745039] placeholder-[#745039] placeholder-opacity-50 ::focus outline-none  focus:bg-white focus:border-[#745039]-500"
        />
      </div>
      {/* {errors && !value && required && <Errors data-testid="errors">Required!</Errors>} */}
    </div>
  )
}

const AppInput = styled(InputComponent)``

export default AppInput
