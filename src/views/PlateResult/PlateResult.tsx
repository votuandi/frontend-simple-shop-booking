import AppButton from '@/components/AppButton'
import { useTranslation } from 'next-i18next'
import divinationArrangementApi from '@/utils/api/divinationArrangement/divinationArrangement.api'
import { useEffect } from 'react'
import { IListConvertToPhp, IGetListCoverToPhpResponse } from '@/utils/api/divinationArrangement'
import React from 'react'
export default function PlateResult() {
  const { t } = useTranslation()
  const [result, setResult] = React.useState<IGetListCoverToPhpResponse | null>(null)

  let GetListCoverToPhp = async (props: IListConvertToPhp) => {
    try {
      let res = await divinationArrangementApi.getListConvertToPhp({
        params: props.params,
      })
      setResult(res.data.params.items)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    let urlParams = new URLSearchParams(window.location.search)
    let _cboYear = urlParams.get('cboYear')
    let _cboMonth = urlParams.get('cboMonth')
    let _cboDay = urlParams.get('cboDay')
    let _cboHour = urlParams.get('cboHour')
    let _cboMinute = urlParams.get('cboMinute')
    let _cboSecond = urlParams.get('cboSecond')
    let _cboSec = urlParams.get('cboSec')

    GetListCoverToPhp({
      params: {
        cboYear: _cboYear,
        cboMonth: _cboMonth,
        cboDay: _cboDay,
        cboHour: _cboHour,
        cboMinute: _cboMinute,
        cboSecond: _cboSecond,
        cboSec: _cboSec,
      },
    })
  }, [])

  //   useEffect(() => {
  //     console.log(result)
  //   }, [result])

  return (
    <div className="relative h-fit pt-[110px] flex flex-col items-center justify-start">
      <div className="w-screen h-full relative py-[22px] flex flex-col items-center">
        <div className="relative inline-block h-[340px]">
          <img src="/img/Tarot/bannerTarot2.png " className="h-[340px]" alt="Banner" />
          <p className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2F1707] text-4xl leading-16 text-center font-bold font-noto-sans-tc tracking-wide">
            {t('Plate up result')}
          </p>
          <img
            className="absolute top-[50%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 h-[253px]"
            src="/img/Tarot/Group1.png"
            alt="Banner"
          />
          <img src="/img/Tarot/Group2.png" className="absolute top-[50%] left-[95%] transform -translate-x-1/2 -translate-y-1/2 " alt="Banner" />
        </div>
        <div className="block  w-[100%] md:w-[65%] h-auto z-10 mt-[-6%] mb-16 items-center mx-auto bg-[#fff]">
          <div className="flex justify-center mt-[4%]">
            <p className="mr-[2%] font-sans font-normal text-base leading-6 text-center tracking-wider text-[#745039]">{result?.lblDate}</p>
            <p className=" font-sans font-normal text-base leading-6 text-center tracking-wider text-[#745039]">{result?.lblDateLunar}</p>
          </div>
          <div className="flex justify-center">
            <p className=" font-sans font-normal text-base leading-6 text-center tracking-wider mt-4 text-[#745039]">{result?.lblBazi}</p>
          </div>
          <div className="flex justify-center mt-[3%]">
            <p className=" font-sans font-normal text-2xl leading-9 text-center tracking-wider text-[#2F1707]">
              {result?.lblJiqi} {result?.lblFu}
            </p>
          </div>
          <div className="grid grid-cols-3 mt-[5%] border border-[#75573A] w-[75%] mx-auto">
            {Object.values(result?.mainDivination! ?? {}).map((row, rowIndex) => (
              <div key={rowIndex} className="border border-[#75573A]  ">
                <div className="grid grid-cols-3">
                  {Object.values(row!).map((cell, subIndex) => (
                    <div
                      key={subIndex}
                      className=" border-t border-r border-[#808080] border-dashed  p-2 font-normal font-notosanstc text-base leading-7 text-center tracking-wider text-[#745039] whitespace-pre-line"
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[280px] h-fit pb-[100px] mx-auto">
          <AppButton text={t('開始占卜') ?? '開始占卜'} />
        </div>
      </div>
    </div>
  )
}
