import AppButton from '@/components/AppButton'
import { gotoPage } from '@/utils/helpers/common'
import { useTranslation } from 'next-i18next'

export default function Tarot() {
  const { t } = useTranslation()

  return (
    <div className="relative h-fit pt-[110px] flex flex-col items-center justify-start">
      <div className="w-screen h-full relative py-[22px] flex flex-col items-center">
        <div className="relative inline-block">
          <img src="/img/Tool/BannerTool.png" className="" alt="Banner" />
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl leading-16 text-center font-bold font-noto-sans-tc tracking-wide">
            {t('I-ching tarot')}
          </p>
        </div>
        <div className="block space-x-3  h-fit mt-20 mb-4 items-center mx-auto ">
          <img src="/img/Tarot/tarot-card.png" className="" alt="Banner" />
        </div>
        <div className="block space-x-3 w-[100%] md:w-[45%] h-fit mt-10 mb-16 items-center mx-auto ">
          <p className="font-normal font-notosans font-size-16 leading-200 text-center text-[#745039] flex-none order-0 flex-grow-1">
            易經塔羅牌易經塔羅牌易經塔羅牌易經塔羅牌易經塔羅牌，易經塔羅牌易經塔羅牌易經塔羅牌，易經塔羅牌易經塔羅牌易經塔羅牌易經塔羅牌。易經塔羅牌易經塔羅牌，易經塔羅牌易經塔羅牌易經塔羅牌，然後開始占卜。
          </p>
        </div>
        <div className="w-[280px] h-fit pb-[100px] mx-auto" onClick={() => gotoPage('/result')}>
          <AppButton text={t('Start divination')!} />
        </div>
      </div>
    </div>
  )
}
