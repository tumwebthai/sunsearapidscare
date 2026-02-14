import Script from 'next/script'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Server Component — ดึง tracking IDs จาก Supabase แล้ว inject script ที่เหมาะสม
export default async function TrackingScripts() {
  let codes: Record<string, string> = {}

  try {
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')
      .in('key', ['ga4_measurement_id', 'gtm_container_id', 'facebook_pixel_id', 'line_tag_id'])

    for (const row of data || []) {
      if (row.value) codes[row.key] = row.value
    }
  } catch {
    // ถ้าดึงไม่ได้ ไม่ inject อะไร
    return null
  }

  const ga4 = codes.ga4_measurement_id
  const gtm = codes.gtm_container_id
  const fbPixel = codes.facebook_pixel_id
  const lineTag = codes.line_tag_id

  // ถ้าไม่มี tracking code ใดๆ ไม่ render อะไร
  if (!ga4 && !gtm && !fbPixel && !lineTag) return null

  return (
    <>
      {/* Google Analytics 4 */}
      {ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4}');`}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtm && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
          </Script>
        </>
      )}

      {/* Facebook Pixel */}
      {fbPixel && (
        <Script id="fb-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {/* LINE Tag */}
      {lineTag && (
        <Script id="line-tag-init" strategy="afterInteractive">
          {`(function(g,d,o){g._ltq=g._ltq||[];g._lt=g._lt||function(){g._ltq.push(arguments)};var h=d.getElementsByTagName(o)[0];var j=d.createElement(o);j.async=true;j.src='https://d.line-scdn.net/n/line_tag/public/release/v1/lt.js';h.parentNode.insertBefore(j,h);})( window,document,'script');_lt('init',{customerType:'account',tagId:'${lineTag}'});_lt('send','pv',['${lineTag}']);`}
        </Script>
      )}

      {/* GTM noscript fallback */}
      {gtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </>
  )
}
