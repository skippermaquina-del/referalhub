import Script from "next/script";

const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/** Carga la etiqueta de Google Ads solo si el ID está configurado. */
export function GoogleAds() {
  if (!adsId) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`} strategy="afterInteractive" />
      <Script id="google-ads-gtag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${adsId}');`}
      </Script>
    </>
  );
}
