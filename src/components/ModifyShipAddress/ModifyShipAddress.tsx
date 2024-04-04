import React, { useEffect, useState } from 'react'
import AppDropdown from '../AppDropdown'
import { useTranslation } from 'next-i18next'
import * as styles from '@/utils/constants/classStyle.constant'
import { IShippingAddressItem } from '@/utils/api/user'
import { useRouter } from 'next/router'
import userApi from '@/utils/api/user/user.api'

type IProps = {
  shippingAddressItem: IShippingAddressItem | null
  addressIndex: number | null
  onChange: (value: any) => void
}

export default function ModifyShipAddress({ shippingAddressItem, addressIndex, onChange }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router

  const [listRegion, setListRegion] = useState<any>(null)
  const [listDistrict, setListDistrict] = useState<any>(null)
  const [regionId, setRegionId] = useState<number>(1)
  const [districtId, setDistrictId] = useState<number>(1)
  const [regionName, setRegionName] = useState<string>('')
  const [districtName, setDistrictName] = useState<string>('')
  const [deliveryAddress, setDeliveryAddress] = useState<string>('')
  const [unitAddress, setUnitAddress] = useState<string>('')
  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)

  let onFinish = () => {
    let newItem: IShippingAddressItem = {
      region_id: regionId,
      region_name: regionName,
      district_id: districtId,
      district_name: districtName,
      is_default: false,
      delivery_address: deliveryAddress,
      unit: unitAddress,
    }
    onChange({
      addressIndex: addressIndex,
      addressItem: newItem,
    })
  }

  //call API
  let getListRegion = async () => {
    try {
      let res = await userApi.getListRegion({
        params: {
          language: locale!.replace('-', '_'),
        },
      })
      setListRegion(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let getListDistrict = async () => {
    try {
      let res = await userApi.getListDistrict({
        params: {
          language: locale!.replace('-', '_'),
          region_id: regionId.toString(),
        },
      })
      setListDistrict(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getListRegion()
  }

  let onChangeRegion = (item: [number, string]) => {
    setRegionId(item[0])
    setRegionName(item[1])
  }

  let onChangeDistrict = (item: any) => {
    setDistrictId(item[0])
    setDistrictName(item[1])
  }

  useEffect(() => {
    if (shippingAddressItem) {
      setRegionId(shippingAddressItem.region_id)
      setRegionName(shippingAddressItem.region_name)
      setDistrictId(shippingAddressItem.district_id)
      setDistrictName(shippingAddressItem.district_name)
      setDeliveryAddress(shippingAddressItem.delivery_address)
      setUnitAddress(shippingAddressItem.unit)
    }
    fetchData()
  }, [])

  useEffect(() => {
    getListDistrict()
    setLoading(false)
  }, [regionId])

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-[1000px] h-[600px] flex flex-col relative justify-start items-start p-10">
          <p className="font-medium text-[32px] leading-[46px] tracking-[0.02em] text-medium-brown">{t('Add new address')}</p>
          <p className="font-normal text-lg leading-[26px] tracking-[0.02em] text-[#89817A]">{t('Enter new shipping address')}</p>
          <div className="w-full h-fit mt-10 flex flex-col gap-6 justify-center items-center">
            <div className="w-full h-fit grid grid-cols-2 gap-6">
              <div className="flex flex-col w-full h-hit">
                <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Select area')}</p>
                <AppDropdown
                  options={listRegion ? Object.values(listRegion) : []}
                  relatedOptions={listRegion ? Object.entries(listRegion) : null}
                  value={listRegion ? listRegion[regionId] : null}
                  onChange={(item) => onChangeRegion(item)}
                />
              </div>
              <div className="flex flex-col w-full h-hit">
                <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Select region')}</p>
                <AppDropdown
                  options={listDistrict ? Object.values(listDistrict) : []}
                  relatedOptions={listDistrict ? Object.entries(listDistrict) : null}
                  value={listDistrict ? listDistrict[districtId] : null}
                  onChange={(item) => onChangeDistrict(item)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full h-hit">
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Street/Building Name')}</p>
              <input
                className={styles.APP_INPUT}
                type="text"
                defaultValue={shippingAddressItem ? shippingAddressItem.delivery_address : ''}
                placeholder={t('ex_address')!}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col w-full h-hit">
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Street/Building Number/Floor/Unit')}</p>
              <input
                className={styles.APP_INPUT}
                type="text"
                defaultValue={shippingAddressItem ? shippingAddressItem.unit : ''}
                placeholder={t('ex_unit')!}
                onChange={(e) => setUnitAddress(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full h-fit flex justify-center items-center">
            <button
              className="w-[280px] h-fit p-3 bg-app-brown rounded-[6px] font-normal text-base leading-[23px] text-center tracking-widest text-white mt-14"
              onClick={() => onFinish()}
            >
              {t('Change')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
