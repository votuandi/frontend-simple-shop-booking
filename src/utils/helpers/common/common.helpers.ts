import router from "next/router";

export const capitalizeFirstLetter = (input : string) => {
    return input.charAt(0).toUpperCase() + input.slice(1);
}

export const capitalizeFirstLetterAllWords = (input : string) => {
    let words = input.split(" ").map((word) => {
        return capitalizeFirstLetter(word)
        
    })
    return words.join(' ')
}

export const gotoPage = (path: string, query?: string) => {
    router.push({
      pathname: path,
      search:  query ?? "",
    });
  };

  export const isMobile = () => {
    return (
      typeof window !== "undefined" &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  };
  
  export const isIOS = () => {
    return (
      typeof window !== "undefined" &&
      ([
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.platform) ||
        navigator.userAgent.includes("Mac"))
    );
  };
  
  export const isEmpty = (val: any) => {
    return (
      ["", null, undefined].includes(val) ||
      (Array.isArray(val) && val.length === 0)
    );
  };
  
  export const isNumber = (number: any) => {
    return !isEmpty(number) && !isNaN(Number(number));
  };
  
  export const formatNumber = (
    number?: number | string,
    options?: Intl.NumberFormatOptions
  ) => {
    if (!isNumber(number)) return number;
    const locale = window.NextPublic.lang;
    return new Intl.NumberFormat(locale, options).format(Number(number));
  };
  
  export const decodeHTML = (input: string) => {
    const e = document.createElement("textarea");
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue || "";
  };
  
  export const formatFormData = (data: Object) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value) && value.some((v) => v instanceof File)) {
        fd.append(`${key}[]`, value as any);
      } else {
        fd.append(
          key,
          typeof value === "string" || value instanceof File
            ? value
            : JSON.stringify(value)
        );
      }
    });
    return fd;
  };

  export const isPhoneNumber = (phone: string) => {
    return phone.length >= 6
  }

  export const sumPrices = (prices: string[]) => {
    let numPrices = prices.map(p =>  Number(p.replaceAll(',', '')))
    return numPrices.reduce((a, b) => a + b, 0).toLocaleString('zh-HK', {
      style: 'currency',
      currency: 'HKD',
    })
  }

  export const halfSumPrices = (prices: string[]) => {
    let numPrices = prices.map(p =>  Number(p.replaceAll(',', '')))
    return (numPrices.reduce((a, b) => a + b, 0)/2).toLocaleString('zh-HK', {
      style: 'currency',
      currency: 'HKD',
    })
  }

  export const formatDate = (date: string) => {
    let _date = new Date(date)
    return `${_date.getFullYear()}-${_date.getMonth()+1}-${_date.getDay()}`
  }