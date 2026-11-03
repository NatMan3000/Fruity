import { preloadable } from './preloadable'

// The two 3D heroes' scenes (lazy chunks). Preloadable, so a hero whose chunk is already in renders it
// straight away: through React.lazy it suspended once even then, and React held the reveal back about
// 300 ms, which left Now's dish empty that long after the welcome's tap (Welcome.tsx preloads them).
export const HeroDish = preloadable(() => import('../three/HeroDish'))
export const SpinFruit = preloadable(() => import('../three/SpinFruit'))
