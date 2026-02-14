export default function MarqueeBanner() {
  const items = [
    '✦ Premium Chauffeur Service',
    '✦ รับส่งสนามบิน 24/7',
    '✦ ป้ายเหลืองถูกกฎหมาย',
    '✦ ราคาเหมาจ่ายไม่มีแฝง',
    '✦ คะแนน 4.9/5 ดาว',
    '✦ คนขับมืออาชีพ',
  ]
  const repeated = [...items, ...items, ...items, ...items]

  return (
    <div style={{ background: '#12263A', borderTop: '1px solid rgba(198,167,94,0.15)', borderBottom: '1px solid rgba(198,167,94,0.15)', padding: '14px 0', overflow: 'hidden', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
        {repeated.map((item, i) => (
          <span key={i} style={{ color: '#C6A75E', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
