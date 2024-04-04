import AppDropdown from '@/components/AppDropdown'
import AppLabel from '@/components/AppLabel'
import * as React from 'react'
import { useTranslation } from 'next-i18next'
import AppButton from '@/components/AppButton'
import divinationArrangementApi from '@/utils/api/divinationArrangement/divinationArrangement.api'
import { useEffect } from 'react'
import { IGetTimeOfDayItem, ILunarCalendarResponse } from '@/utils/api/divinationArrangement'
import { gotoPage } from '@/utils/helpers/common'
import { useRouter } from 'next/router'
import courseApi, { IGetListItem } from '@/utils/api/course'

export interface IAppProps {}

export default function QimenDunjia(props: IAppProps) {
  const { t } = useTranslation()
  const startYear = 2000
  const endYear = new Date().getFullYear() + 10

  const [years, setYears] = React.useState(Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index))
  const [selectedYear, setSelectedYear] = React.useState<string>('')
  const [lunarYear, setLunarYear] = React.useState<string[]>([])
  const [lunarMonth, setLunarMonth] = React.useState<string[]>([])
  const [lunarDay, setLunarDay] = React.useState<string[]>([])

  const [selectedMonth, setSelectedMonth] = React.useState<string>('')
  const [selectedDay, setSelectedDay] = React.useState<string>('')
  const [selectedHour, setselectedHour] = React.useState('')
  const [selectedMinute, setselectedMinute] = React.useState('')
  const [selectedSecond, setselectedSecond] = React.useState('')
  const [selectedSec, setselectedSec] = React.useState('')
  const [courseNames, setCourseNames] = React.useState<string[]>([])
  const [timeOfDay, setTimeOfDay] = React.useState<IGetTimeOfDayItem | null>(null)

  const router = useRouter()
  const { locale } = router

  const [days, setDays] = React.useState<string[]>([])

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    if (!years.includes(Number(value))) {
      const updatedYears = [...years, Number(value)]
      updatedYears.sort((a, b) => a - b)
      setYears(updatedYears)
    }
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  const handleDayChange = (value: string) => {
    setSelectedDay(value)
  }

  const handleHourChange = (value: string) => {
    setselectedHour(value)
  }
  const handleMinuteChange = (value: string) => {
    setselectedMinute(value)
  }
  const handleSecondChange = (value: string) => {
    setselectedSecond(value)
  }
  const handleSecChange = (value: string) => {
    setselectedSec(value)
  }

  const months = [
    { value: '1', label: '01' },
    { value: '2', label: '02' },
    { value: '3', label: '03' },
    { value: '4', label: '04' },
    { value: '5', label: '05' },
    { value: '6', label: '06' },
    { value: '7', label: '07' },
    { value: '8', label: '08' },
    { value: '9', label: '09' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
  ]

  const hours = Array.from({ length: 24 }, (_, index) => {
    const hour = index.toString().padStart(2, '0')
    return { value: hour, label: hour }
  })
  const minutes = Array.from({ length: 60 }, (_, index) => {
    const minutes = index.toString().padStart(2, '0')
    return { value: minutes, label: minutes }
  })
  const seconds = Array.from({ length: 60 }, (_, index) => {
    const seconds = index.toString().padStart(2, '0')
    return { value: seconds, label: seconds }
  })
  const secs = Array.from({ length: 1000 }, (_, index) => {
    const secs = index.toString().padStart(2, '0')
    return { value: secs, label: secs }
  })

  //call API
  let getDayByYearMonth = async () => {
    try {
      let res = await divinationArrangementApi.getDayByYearMonth({
        params: {
          cboYear: selectedYear,
          cboMonth: selectedMonth,
        },
      })
      return res.data.params.days
    } catch (e) {
      console.log(e)
    }
  }
  let getLunarCalendar = async () => {
    try {
      let res = await divinationArrangementApi.getLunarCalendar({
        params: {
          cboYear: selectedYear,
          cboMonth: selectedMonth,
          cboDay: selectedDay,
        },
      })
      return res.data.params
    } catch (e) {
      console.log(e)
    }
  }
  let getList = async () => {
    try {
      let res = await courseApi.getList({
        params: {
          language: locale!.replace('-', '_'),
        },
      })
      setCourseNames(
        res.data.params.map((c: IGetListItem) => {
          return c.name
        })
      )
    } catch (e) {
      console.log(e)
    }
  }
  let getTimeOfDay = async () => {
    try {
      let res = await divinationArrangementApi.getTimeOfDay({
        params: {
          language: locale!.replace('-', '_'),
        },
      })
      setTimeOfDay(res.data.params)
    } catch (error) {}
  }

  // fetching Data
  let fetchDayByYearMonth = async () => {
    let _days = await getDayByYearMonth()
    const listDays = Array.from({ length: _days }, (_, index) => String(index + 1))
    setDays(listDays)
  }

  let fetchLunarCalendar = async () => {
    let LunarDmy: ILunarCalendarResponse = await getLunarCalendar()

    setLunarYear([LunarDmy.year])
    setLunarMonth([LunarDmy.month])
    setLunarDay([LunarDmy.day])
  }

  useEffect(() => {
    fetchDayByYearMonth()
  }, [selectedYear, selectedMonth])

  useEffect(() => {
    fetchLunarCalendar()
  }, [selectedYear, selectedMonth, selectedDay])
  useEffect(() => {
    getList()
    getTimeOfDay()
  }, [])

  useEffect(() => {
    getList()
    getTimeOfDay()
  }, [locale])

  let getResult = () => {
    if (
      selectedYear.length === 4 &&
      selectedMonth.length === 2 &&
      selectedDay.length > 0 &&
      selectedHour.length > 0 &&
      selectedMinute.length > 0 &&
      selectedSec.length > 0
    ) {
      let cboYear = selectedYear
      let cboMonth = selectedMonth
      let cboDay = selectedDay
      let cboHour = selectedHour
      let cboMinute = selectedMinute
      let cboSecond = selectedSecond
      let cboSec = selectedSec
      let query: string = `?cboYear=${cboYear}&cboMonth=${cboMonth}&cboDay=${cboDay}&cboHour=${cboHour}&cboMinute=${cboMinute}&cboSecond=${cboSecond}&cboSec=${cboSec}`
      gotoPage('/plate-result', query)
    } else {
      alert(t('Please enter correct input!'))
    }
  }

  return (
    <div className="relative h-fit pt-[110px] flex flex-col items-center justify-start">
      <div className="w-screen h-full relative py-[22px] flex flex-col items-center">
        <div className="relative inline-block">
          <img src="/img/Tool/BannerTool.png" className="" alt="Banner" />
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl leading-16 text-center font-bold font-noto-sans-tc tracking-wide">
            {t('Qimen dunjia')}
          </p>
        </div>
        {/* <div className="w-[1360px] h-full flex flex-row justify-between"> */}
        <div className="block space-x-3 w-[100%] md:w-[40%] h-fit mt-10 mb-4 items-center mx-auto ">
          <div>
            <AppLabel text={t('Date')} />
          </div>
          <div className="flex space-x-3">
            <AppDropdown
              options={years.map((year) => year.toString())}
              placeholder={t('Year') ?? 'Year'}
              value={selectedYear}
              onChange={(value) => handleYearChange(value)}
              disabled={false}
            />
            <AppDropdown
              options={months.map((month) => month.label)}
              placeholder={t('Month') ?? 'Month'}
              value={selectedMonth}
              onChange={(value) => handleMonthChange(value)}
              disabled={false}
            />
            <AppDropdown
              options={days}
              placeholder={t('Day') ?? 'Day'}
              value={selectedDay}
              onChange={(value) => handleDayChange(value)}
              disabled={false}
            />
          </div>
        </div>
        {/* </div> */}
        <div className="block space-x-3 w-[100%] md:w-[40%] h-fit mt-10 mb-4 items-center mx-auto ">
          <div>
            <AppLabel text={t('Lunar date')} />
          </div>
          <div className="flex space-x-3">
            <AppDropdown options={lunarYear} placeholder={t('Year') ?? 'Year'} value={lunarYear[0]} onChange={() => {}} disabled={true} />
            <AppDropdown options={lunarMonth} placeholder={t('Month') ?? 'Month'} value={lunarMonth[0]} onChange={() => {}} disabled={true} />
            <AppDropdown options={lunarDay} placeholder={t('Day') ?? 'Day'} value={lunarDay[0]} onChange={() => {}} disabled={true} />
          </div>
        </div>
        <div className="block space-x-3 w-[100%] md:w-[40%] h-fit mt-10 mb-4 items-center mx-auto ">
          <div>
            <AppLabel text={t('Time')} />
          </div>
          <div className="flex space-x-3">
            <AppDropdown
              options={hours.map((hour) => hour.label)}
              placeholder={t('Hour') ?? 'Hour'}
              value={selectedHour}
              onChange={(value) => handleHourChange(value)}
              disabled={false}
            />
            <AppDropdown
              options={minutes.map((minutes) => minutes.label)}
              placeholder={t('Minute') ?? 'Minute'}
              value={selectedMinute}
              onChange={(value) => handleMinuteChange(value)}
              disabled={false}
            />
            <AppDropdown
              options={seconds.map((seconds) => seconds.label)}
              placeholder={t('Second') ?? 'Second'}
              value={selectedSecond}
              onChange={(value) => handleSecondChange(value)}
              disabled={false}
            />
            <AppDropdown
              options={secs.map((secs) => secs.label)}
              placeholder={t('Sec') ?? 'Sec'}
              value={selectedSec}
              onChange={(value) => handleSecChange(value)}
              disabled={false}
            />
          </div>
        </div>
        {/* s */}
        <div className=" w-[40%] md:w-[15%]  h-fit pb-[100px] mx-auto pt-8">
          <AppButton text={t('Submit') ?? 'Submit'} onClick={() => getResult()} />
        </div>
      </div>
    </div>
  )
}
