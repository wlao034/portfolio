import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Waraitip Laosangprateep — Engineering Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#f5f3ef',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 20, color: '#888880', marginBottom: 24 }}>
          Medical Engineering · Chemical Engineering
        </div>
        <div style={{ fontSize: 64, fontWeight: 500, color: '#1a1a1a', marginBottom: 20 }}>
          Waraitip Laosangprateep
        </div>
        <div style={{ fontSize: 28, color: '#1a7a5e' }}>
          Open to Thailand, South Korea, Singapore & beyond
        </div>
      </div>
    ),
    { ...size }
  )
}
