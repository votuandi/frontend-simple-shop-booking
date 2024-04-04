import AppButton from '@/components/AppButton'
import { useTranslation } from 'next-i18next'
import { Row, Col } from 'reactstrap'

export default function Result() {
  const { t } = useTranslation()

  return (
    <div className="relative h-fit pt-[110px] flex flex-col items-center justify-start">
      <div className="w-screen h-full relative py-[22px] flex flex-col items-center">
        <div className="relative inline-block">
          <img src="/img/Tarot/bannerTarot2.png" className="" alt="Banner" />
          <p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#2F1707] text-4xl leading-16 text-center font-bold font-noto-sans-tc tracking-wide">
            {t('Fortune-telling results')}
          </p>
          <img className="absolute top-[70%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 " src="/img/Tarot/Group1.png" alt="Banner" />
          <img src="/img/Tarot/Group2.png" className="absolute top-[70%] left-[95%] transform -translate-x-1/2 -translate-y-1/2 " alt="Banner" />
        </div>
        <Row className="flex w-[60%] mx-auto pt-[5%] pb-[5%] ">
          <Col md="8" xs="12" className=" w-[100%] text-center flex flex-col justify-center items-center">
            <img src="/img/Tarot/img-tarot.png" className="mx-auto" />
            <span className="font-noto-sans-tc font-medium text-2xl leading-10 tracking-wider text-[#75573A]">坤卦・上上卦</span>
          </Col>
          <Col md="4" xs="6" className=" ml-[10%]">
            <span className="font-noto-sans-tc font-medium text-lg leading-7 tracking-wider text-[#75573A] h-auto ">
              卦象曰：肥羊失群入山崗，餓虎逢之把口張，適口充腸心歡喜，卦若占之大吉昌。
            </span>
            <p className="w-900 h-14 font-noto-sans-tc font-normal text-base leading-6 text-[#9F6834] h-auto pt-[10px] pb-[25px]">
              這個卦是同卦（下坤上坤）相疊，陰性。象徵地（與乾卦相反），順從天。承載萬物，伸展無窮無盡。坤卦以雌馬為象徵，表明地道生育撫養萬物，而又依天順時，性情溫順。它以「先迷後得」證明「坤」順從「乾」，依隨「乾」，才能把握正確方向，遵循正道，獲取吉利。
            </p>
            <span className="font-noto-sans-tc font-medium text-lg leading-7 tracking-wider text-[#75573A] h-auto ">卦象分析 - 事業</span>
            <p className="w-900 h-14 font-noto-sans-tc font-normal text-base leading-6 text-[#9F6834] h-auto pt-[10px] pb-[25px]">
              諸項事業可以成功，得到預想的結果，但開始出師不利，為困境所擾。切莫冒險急進，須小心謹言慎行，尤其不可單槍匹馬，獨斷專行。取得朋友的關心和支持最為重要，在他人的合作下，共同完成事業。忠厚、溫和，待人真誠，熱心助人，因此也能得到他人的幫助，可往往因不提防小人而受到傷害，但無大礙。性格靈活，工作方法多樣，可以左右逢源，得到讚許。難，消除災難。因此，應注重內心修養，積蓄養德，效法大地，容忍負重，寬厚大度，以直率、方正、含蓄為原則，不得貪功自傲，持之以恆，謀求事業的成功。
            </p>
            <span className="font-noto-sans-tc font-medium text-lg leading-7 tracking-wider text-[#75573A]">卦象分析 - 經商</span>
            <p className="w-900 h-14 font-noto-sans-tc font-normal text-base leading-6 text-[#9F6834] h-auto pt-[10px]">
              機遇不很好，切莫冒險，以穩健為妥，遇到挫折，務必即時總結經驗。注意儲存貨物，待價而沽，處處小心為是。
            </p>
          </Col>
        </Row>
        <div className="w-[280px] h-fit pb-[100px] mx-auto">
          <AppButton text={t('Back to homepage')!} />
        </div>
      </div>
    </div>
  )
}
