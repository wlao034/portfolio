import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Waraitip Laosangprateep — Engineering Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const imageData = await fetch(
    new URL('../public/ptofile.jpg', import.meta.url)
  ).then((res) => res.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '80px',
          background: '#f5f3ef',
          fontFamily: 'sans-serif',
        }}
      >
        <img
          src={imageData as any}
          width={220}
          height={220}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '56px',
            border: '4px solid #1a7a5e',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 20, color: '#888880', marginBottom: 20 }}>
            Medical Engineering · Chemical Engineering
          </div>
          <div style={{ fontSize: 56, fontWeight: 500, color: '#1a1a1a', marginBottom: 16 }}>
            Waraitip Laosangprateep
          </div>
          <div style={{ fontSize: 26, color: '#1a7a5e' }}>
            Open to Thailand, South Korea, Singapore & beyond
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
