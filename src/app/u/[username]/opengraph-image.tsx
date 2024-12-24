import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'X Persona Analysis'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OpenGraphImage({
  params,
}: {
  params: { username: string }
}) {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #ffffff, #f7f9fa)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: 60, fontWeight: 'bold' }}>X Persona Analysis</div>
        <div style={{ fontSize: 40, marginTop: 20 }}>@{params.username}</div>
      </div>
    )
  )
}