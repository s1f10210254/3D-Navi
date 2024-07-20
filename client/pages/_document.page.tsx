import { APP_NAME } from 'common/constants';
import { Head, Html, Main, NextScript } from 'next/document';
import { staticPath } from 'utils/$path';

function Document() {
  return (
    <Html lang="ja">
      <Head>
        <meta name="description" content={APP_NAME} />
        <link rel="icon" href={staticPath.images.$3d_navi_png} />
        <link
          href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Rampart+One&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default Document;
