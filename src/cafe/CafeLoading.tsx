// Shown while the game's chunk downloads (App.tsx Suspense fallback). Inline styles: cafe.css
// arrives with the chunk, so this cannot use it.
export function CafeLoading() {
  return (
    <div
      role="status"
      style={{
        position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 12, background: 'linear-gradient(#BDEBFF, #FFF4D6)', color: '#2B2340',
        fontFamily: 'ui-rounded, system-ui, sans-serif', fontWeight: 700, fontSize: 20,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 64 }}>🥣</span>
      Opening the cafe...
    </div>
  )
}
