import React, { useEffect, useState } from 'react'
import * as styles from '@/utils/constants/classStyle.constant'
import { useTranslation } from 'next-i18next'

type IProps = {
  total: number
  current: number
  onChange: (value: any) => void
  bg?: string
}

export default function AppPagination({ total, current, onChange, bg }: IProps) {
  bg = bg ?? 'bg-white'
  const { t } = useTranslation()

  const [maxPage, setMaxPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    setMaxPage(Math.floor(total / 10) + 1)
    setCurrentPage(current)
  }, [])

  useEffect(() => {
    onChange(currentPage)
  }, [currentPage])

  return (
    <div className="w-full h-fit flex flex-row items-center justify-center text-app-brown text-base pc:text-xl ">
      <button
        className={`w-fit px-3 py-1 rounded-l-[6px] ${currentPage === 1 ? 'text-[#BFBFBF]' : 'hover:bg-app-brown hover:text-white'}`}
        onClick={() => setCurrentPage(currentPage === 1 ? 1 : currentPage - 1)}
      >
        {t('Previous')}
      </button>
      <div className="w-[140px] relative px-5 flex flex-row justify-center items-centers">
        <input
          className={
            'text-[#745039] text-base pc:text-xl p-4 w-full border-b-2 border-[#745039]-500 transition-all duration-200 bg-transparent  ::placeholder border-[#745039] placeholder-[#745039] placeholder-opacity-50 ::focus outline-none  focus:bg-[#74503915] focus:border-[#745039]-500s px-3 text-center'
          }
          type="number"
          placeholder={currentPage.toString()}
          onChange={(e) => setCurrentPage(Number(e.target.value))}
        />
        <p className="p-4 text-base pc:text-xl w-full h-fit">{`/ ${maxPage}`}</p>
      </div>
      <button
        className={`w-fit px-3 py-1 rounded-r-[6px] ${currentPage === maxPage ? 'text-[#BFBFBF]' : 'hover:bg-app-brown hover:text-white'}`}
        onClick={() => setCurrentPage(currentPage === maxPage ? maxPage : currentPage + 1)}
      >
        {t('Next')}
      </button>
    </div>
  )
}
