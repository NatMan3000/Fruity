// A strawberry drawn as a love heart, for the "Made with ... by Josh & Kai" sign-off. Sticker style: a
// white die-cut edge and a soft drop shadow, so it reads on every screen colour (the 🍓 emoji vanished on
// the red season screens, Nathan, 3 Nov 2026).
export function HeartBerry({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="inline-block shrink-0 drop-shadow-[0_1px_1px_rgb(30_8_20/0.35)]" style={{ transform: 'rotate(-8deg)' }}>
      {/* the heart-shaped berry, its white sticker edge drawn first */}
      <path d="M16 29 C9 23 3.5 18.5 3.5 12.5 C3.5 8.6 6.4 6 9.8 6 C12.4 6 14.6 7.4 16 9.6 C17.4 7.4 19.6 6 22.2 6 C25.6 6 28.5 8.6 28.5 12.5 C28.5 18.5 23 23 16 29 Z" fill="#fff" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
      <path d="M16 29 C9 23 3.5 18.5 3.5 12.5 C3.5 8.6 6.4 6 9.8 6 C12.4 6 14.6 7.4 16 9.6 C17.4 7.4 19.6 6 22.2 6 C25.6 6 28.5 8.6 28.5 12.5 C28.5 18.5 23 23 16 29 Z" fill="#E8283C" />
      <path d="M9 10.5 C7.8 11.6 7.4 13.2 7.8 14.6" fill="none" stroke="#FF8A92" strokeWidth="1.6" strokeLinecap="round" />
      {/* seeds */}
      <g fill="#FFD84A">
        <ellipse cx="11" cy="15" rx="0.8" ry="1.1" />
        <ellipse cx="16" cy="14" rx="0.8" ry="1.1" />
        <ellipse cx="21" cy="15" rx="0.8" ry="1.1" />
        <ellipse cx="13.5" cy="19.5" rx="0.8" ry="1.1" />
        <ellipse cx="18.5" cy="19.5" rx="0.8" ry="1.1" />
        <ellipse cx="16" cy="24" rx="0.8" ry="1.1" />
        <ellipse cx="23.5" cy="11" rx="0.8" ry="1.1" />
      </g>
      {/* the leafy calyx in the heart's dip, white-edged like the berry */}
      <path d="M16 11.5 L10 8.6 L13.6 8 L11.2 4.4 L15 6.2 L16 2.4 L17 6.2 L20.8 4.4 L18.4 8 L22 8.6 Z" fill="#2FA84F" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 6.5 L16.8 1.6" stroke="#2FA84F" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
