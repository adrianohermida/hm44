import React, { useEffect } from "react";

export default function TrackingScripts() {
  useEffect(() => {
    // Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=UA-72669401-1';
    document.head.appendChild(gaScript);

    const gaConfig = document.createElement('script');
    gaConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'UA-72669401-1');
      gtag('config', 'G-72669401');
      gtag('event', 'conversion', {'send_to': 'AW-10971865779/vWxdCJnmvrYYELPF5e8o'});
    `;
    document.head.appendChild(gaConfig);

    // Google Tag Manager
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-TMBHHW6');
    `;
    document.head.appendChild(gtmScript);

    // Yandex Meta
    const yandexMeta = document.createElement('meta');
    yandexMeta.name = 'yandex-verification';
    yandexMeta.content = 'c3948e3c433b8b27';
    document.head.appendChild(yandexMeta);
  }, []);

  return null;
}