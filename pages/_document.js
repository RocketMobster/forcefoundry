import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const prefix = process.env.NODE_ENV === 'production' ? '/forcefoundry' : '';
  
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
