'use client'

// Root-layout error boundary: catches errors thrown in the root layout itself.
// Must render its own <html>/<body> because it replaces the root layout.
export default function GlobalError({ error, reset }) {
  return (
    <html dir="rtl" lang="ar">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '24px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            حدث خطأ غير متوقع
          </h2>
          <p style={{ color: '#6B7280', margin: 0 }}>تعذّر تحميل التطبيق. حاول إعادة التحميل.</p>
          <button
            onClick={() => reset()}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              background: '#0F5B3E',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  )
}
