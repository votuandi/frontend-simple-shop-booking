declare module "*.svg" {
  import React = require("react")
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

interface Window {
  NextPublic: {
    lang: "zh-HK" | "en-US"
    version: string
  }
}
