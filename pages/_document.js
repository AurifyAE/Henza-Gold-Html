import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        {/* Optimize for TV screens */}
        <meta name="screen-orientation" content="landscape" />
        <meta name="full-screen" content="yes" />
        <meta name="browsermode" content="application" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
