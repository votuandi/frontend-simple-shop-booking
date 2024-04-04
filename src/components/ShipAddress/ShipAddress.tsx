import React, { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import AppDropdown from '../AppDropdown/AppDropdown'
import AppPopup from '../AppPopup/AppPopup'
import ModifyShipAddress from '../ModifyShipAddress/ModifyShipAddress'
import userApi from '@/utils/api/user/user.api'
import { IShippingAddressItem } from '@/utils/api/user'

type IModifiedAddress = {
  addressIndex: number
  addressItem: IShippingAddressItem
}

type IProps = {
  isMobile: boolean
}

export default function ShipAddress({ isMobile }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { locale } = router
  const { data: session } = useSession()

  const [firstFetch, setFirstFetch] = useState<boolean>(true)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [isShowPopup, setShowPopup] = useState<boolean>(false)
  const [listShippingAddress, setListShippingAddress] = useState<IShippingAddressItem[]>([])
  const [selectedAddressItem, setSelectedAddressItem] = useState<IShippingAddressItem | null>(null)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)

  let openPopup = (_item: IShippingAddressItem | null, _index: number | null) => {
    setSelectedAddressItem(_item)
    setSelectedAddressIndex(_index)
    setShowPopup(true)
  }

  let hiddenPopup = () => {
    setShowPopup(false)
  }

  let getFullAddress = (item: IShippingAddressItem) => {
    return item ? `${item.region_name} ${item.district_name} ${item.delivery_address} ${item.unit}` : ''
  }

  let handleModifyAddress = (modifiedAddress: IModifiedAddress) => {
    let _listShippingAddress = [...listShippingAddress]

    if (modifiedAddress.addressIndex == null) {
      if (_listShippingAddress.length === 0) {
        modifiedAddress.addressItem.is_default = true
      }
      _listShippingAddress.push(modifiedAddress.addressItem)
    } else {
      _listShippingAddress[modifiedAddress.addressIndex] = modifiedAddress.addressItem
    }
    setListShippingAddress([..._listShippingAddress])
    hiddenPopup()
  }

  //call APi
  let getShippingAddressInfo = async () => {
    try {
      let res = await userApi.getListShippingAddress({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
        },
      })
      setListShippingAddress(res.data.params)
    } catch (e) {
      console.log(e)
    }
  }

  let updateShippingAddressInfo = async () => {
    try {
      let res = await userApi.updateListShippingAddress({
        params: {
          language: locale!.replace('-', '_'),
          token: localStorage.getItem('token') ?? '',
          delivery_address: JSON.stringify(listShippingAddress),
        },
      })
      if (res.status === 200) {
        await getShippingAddressInfo()
      }
    } catch (e) {
      console.log(e)
    }
  }

  let fetchData = async () => {
    await getShippingAddressInfo()
    setLoading(false)
  }

  let removeAddress = (index: number) => {
    if (listShippingAddress.length === 1) {
      setListShippingAddress([])
      return
    } else {
      let newListAddress = [...listShippingAddress]
      newListAddress = newListAddress.slice(index, 1)
      setListShippingAddress([...newListAddress])
    }
  }

  useEffect(() => {
    if (!firstFetch) fetchData()
    setFirstFetch(false)
  }, [locale])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="w-screen h-fit bg-background-01 py-10 flex flex-col items-center">
          <div className="w-[1400px] h-fit bg-white p-[60px] rounded-[10px] items-center flex flex-col">
            <div className="flex flex-row justify-between items-start w-full h-fit">
              <p className="font-medium text-3xl leading-[43px] tracking-wider text-medium-brown w-fit text-start">{t('Shipping Address')}</p>
              <div className="w-fit h-fit flex flex-row justify-center items-center cursor-pointer">
                <img className="w-[18px] h-[18px] mr-2" src="/icon/ic-add-cir.svg" alt="" />
                <p
                  className="w-fit h-[18px] font-normal text-lg leading-[18px] text-right tracking-[0.02em] text-[#EEB545]"
                  onClick={() => openPopup(null, null)}
                >
                  {t('Add new address')}
                </p>
              </div>
            </div>
            <div className="w-full h-fit flex flex-col mt-12">
              <p className="font-normal text-sm leading-5 tracking-wider text-medium-brown">{t('Name')}</p>
              <AppDropdown
                options={listShippingAddress.map((adr) => getFullAddress(adr))}
                relatedOptions={listShippingAddress}
                value={getFullAddress(listShippingAddress.filter((adr) => adr.is_default)[0])}
              />
            </div>
            {listShippingAddress.map((item, index) => {
              return (
                <div className="w-full h-fit flex flex-row mt-12 justify-between items-start" key={index}>
                  <div className="flex flex-col justify-start items-start">
                    <p className="font-normal text-base leading-[200%] text-[#89817A]">{`${t('Shippinng address')} ${index + 1}`}</p>
                    <p className="font-normal text-lg leading-[180%] tracking-[0.08em]">{getFullAddress(item)}</p>
                  </div>
                  <div className="flex flex-row justify-center items-center w-fit h-fit font-normal text-lg leading-[18px] text-right tracking-[0.02em] text-[#EEB545] gap-3 ::[&>p] cursor-pointer">
                    <p onClick={() => openPopup(item, index)}>{t('Edit')}</p>
                    <p onClick={() => removeAddress(index)}>{t('Delete')}</p>
                  </div>
                </div>
              )
            })}
            <button
              className="w-fit h-fit px-[123px] py-[14px] rounded-[6px] bg-app-brown text-white mt-10"
              onClick={() => updateShippingAddressInfo()}
            >
              {t('Save')}
            </button>
          </div>
          <AppPopup isShow={isShowPopup} onClose={() => hiddenPopup()}>
            <ModifyShipAddress
              shippingAddressItem={selectedAddressItem}
              addressIndex={selectedAddressIndex}
              onChange={(value) => handleModifyAddress(value)}
            />
          </AppPopup>
        </div>
      )}
    </div>
  )
}
