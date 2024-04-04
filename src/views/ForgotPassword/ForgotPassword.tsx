import AppLabel from '@/components/AppLabel'
import * as React from 'react'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import AppButton from '@/components/AppButton'
import { useEffect, useState } from 'react'
import { authApi } from '@/utils/api'
import { gotoPage } from '@/utils/helpers/common'

export interface IAppProps {}

export default function ForgotPassword(props: IAppProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<0 | 1>(0)
  const [areaCode, setAreaCode] = useState<string>('+852')
  const [phone, setPhone] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [otp, setOtp] = useState<string | null>(null)
  const [isValidPhone, setIfValidPhone] = useState<boolean>(true)
  const [password, setPassword] = useState<string>('')
  const [rePassword, setRePassword] = useState<string>('')
  const [passwordType, setPasswordType] = useState<string>('password')
  const [rePasswordType, setRePasswordType] = useState<string>('password')
  const [isValidPassword, setIfValidPassword] = useState<boolean>(true)
  const [isValidRePassword, setIfValidRePassword] = useState<boolean>(true)
  const [isMobile, setIfMobile] = useState<boolean>(false)

  //validate
  let handlePhone = (_phone: string) => {
    if (isNaN(+_phone)) {
      setIfValidPhone(false)
    } else {
      setIfValidPhone(true)
      setPhone(_phone)
    }
  }
  let handlePassword = (_password: string) => {
    if (_password.length < 8 || _password.length > 10) {
      setIfValidPassword(false)
    } else {
      setIfValidPassword(true)
    }
    setPassword(_password)
  }
  let handleRePassword = (_rePassword: string) => {
    if (_rePassword !== password) {
      setIfValidRePassword(false)
    } else {
      setIfValidRePassword(true)
    }
    setRePassword(_rePassword)
  }

  //Password display
  let changePasswordType = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password')
  }
  let changeRePasswordType = () => {
    setRePasswordType(rePasswordType === 'password' ? 'text' : 'password')
  }

  //call API
  let sendOTP = async () => {
    if (phone.length < 6) {
      setIfValidPhone(false)
      alert('Please enter correct phone number')
    } else
      try {
        let res = await authApi.sendOtpSms({
          params: {
            area_code: areaCode,
            phone: phone,
            verification_type: 1,
          },
        })
        if (res.status === 200) {
          setOtp(res.data.params.verify_code)
          alert('Send OTP Successfully!')
        }
      } catch (e) {
        console.log(e)
      }
  }
  let checkSmsForgotCode = async () => {
    if (otp && otp.length > 0) {
      try {
        let res = await authApi.checkPasswordResetOtp({
          params: {
            area_code: areaCode,
            phone: phone,
            code: otp!,
          },
        })
        if (res.status === 200) {
          setStep(1)
        } else {
          alert('Incorrect OTP')
        }
      } catch (e) {
        console.log(e)
      }
    } else {
      alert(t('Please Enter OTP'))
    }
  }
  let changePassword = async () => {
    if (isValidPassword && isValidRePassword) {
      try {
        let res = await authApi.changePassword({
          params: {
            area_code: areaCode,
            phone: phone,
            code: otp!,
            password: password,
          },
        })
        if (res.status === 200) {
          alert(t('Reset password successfully'))
          gotoPage('/')
        }
      } catch (e) {
        console.log(e)
      }
    }
  }

  useEffect(() => {
    const listenResizeWindows = () => {
      setIfMobile(window.innerWidth < 1400)
    }

    listenResizeWindows()

    window.addEventListener('resize', listenResizeWindows)
  }, [])

  return (
    <div className="relative w-screen h-full pt-14 pc:pt-[110px] pb-[150px] flex flex-col items-center justify-start">
      <div className="relative flex justify-center items-center bg-yellow-noise w-screen h-[220px]">
        <p className="font-bold text-[46px] leading-[67px] text-center tracking-widest text-medium-brown]">{t('Forgot Password')}</p>
        {!isMobile && <img className="absolute top-10 left-0 z-10" src="/img/pattern-cloud-07.png" alt="" />}
        {!isMobile && <img className="absolute top-14 right-0 z-10" src="/img/pattern-cloud-08.png" alt="" />}
      </div>

      {/* Step 0 */}
      {step === 0 && (
        <div className="w-screen h-fit relative flex flex-col items-center justify-start">
          <div className="flex flex-col w-full pc:w-[800px] px-3 pc:px-0 h-fit mt-10 mb-16 items-center">
            <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
              <AppLabel text={t('Phone number')} />
              <div className="flex flex-row w-full">
                <div className="w-[100px] mr-2">
                  <input className={styles.APP_INPUT} type="text" value={areaCode} onChange={(e) => setAreaCode(e.target.value)} />
                </div>
                <div className="w-full">
                  <input
                    className={isValidPhone ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                    type="string"
                    placeholder={t('Phone number') ?? 'Phone number'}
                    onChange={(e) => handlePhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
              <AppLabel text={t('Verification code')} />
              <div className="relative w-full">
                <input
                  className={styles.APP_INPUT}
                  type="text"
                  placeholder={t('Please enter')!}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-send.svg" alt="" onClick={() => sendOTP()} />
              </div>
            </div>
          </div>
          <div className="w-[280px] h-fit">
            <AppButton text={t('Submit')!} onClick={() => checkSmsForgotCode()} />
          </div>
        </div>
      )}
      {/* Step 0 */}
      {step === 1 && (
        <div className="w-screen h-fit relative flex flex-col items-center justify-start">
          <div className="flex flex-col w-[800px] h-fit mt-10 mb-16 items-center">
            <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
              <AppLabel text={t('Password')} />
              <div className="relative w-full">
                <input
                  className={isValidPassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                  type={passwordType}
                  placeholder={t('INPUT_PASSWORD')!}
                  onChange={(e) => handlePassword(e.target.value)}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changePasswordType()} />
              </div>
            </div>

            <div className={`${styles.DIV.TAB_FORM_FIELD} mt-5`}>
              <AppLabel text={t('Confirm password')} />
              <div className="relative w-full">
                <input
                  className={isValidRePassword ? styles.APP_INPUT : styles.APP_INVALID_INPUT}
                  type={rePasswordType}
                  placeholder={t('INPUT_CONFIRM_PASSWORD')!}
                  onChange={(e) => handleRePassword(e.target.value)}
                />
                <img className="absolute right-0 top-0 cursor-pointer" src="/icon/ic-eye.svg" alt="" onClick={() => changeRePasswordType()} />
              </div>
            </div>
          </div>
          <div className="w-[280px] h-fit">
            <AppButton text={t('Submit')!} onClick={() => changePassword()} />
          </div>
        </div>
      )}
    </div>
  )
}
