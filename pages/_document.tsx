import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content="#1A1A1A" />
          <meta
            name="description"
            content="Star Cabs provides 24-hour taxi and airport transportation throughout Metairie and the Greater New Orleans area."
          />
          <meta property="og:site_name" content="Star Cabs" />
          <meta property="og:title" content="Star Cabs | Metairie, LA Taxi Service" />
          <meta
            property="og:description"
            content="24-hour taxi and airport transportation throughout Metairie and the Greater New Orleans area."
          />
          <meta name="twitter:card" content="summary" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
