import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
            rel="stylesheet"
          />

          <link
            href="/ko-fi-logo.png"
            rel="shortcut icon"
            type="image/x-icon"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
