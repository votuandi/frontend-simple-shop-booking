import Document, { Html, Head, Main, NextScript } from 'next/document'
import nextI18nextConfig from '@@/next-i18next.config'

export default class MyDocument extends Document {
  render() {
    const currentLocale = this.props.__NEXT_DATA__.locale ?? nextI18nextConfig.i18n!.defaultLocale
    return (
      <Html lang="en">
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.cdnfonts.com/css/perpetua-titling-mt" rel="stylesheet"></link>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.NextPublic = {
                  lang: "${currentLocale}"
                }
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
