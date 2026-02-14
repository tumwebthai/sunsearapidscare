import Link from 'next/link'
import { SITE_NAME, SITE_URL } from '@/lib/data'

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: SITE_URL },
      ...items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
      })),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        style={{
          padding: '16px 24px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <ol
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            listStyle: 'none',
            margin: 0,
            padding: 0,
            fontSize: 13,
            color: '#9CA3AF',
          }}
        >
          <li>
            <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
              หน้าแรก
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'rgba(198,167,94,0.4)' }}>/</span>
              {item.href ? (
                <Link href={item.href} style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: '#C6A75E' }}>{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
