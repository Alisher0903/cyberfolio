import { ImageResponse } from 'next/og';

export const alt = 'Alisher Sodiqov — Frontend Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        color: '#E8F4FD',
        background: '#050A0E',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', color: '#00FF87', fontSize: 28, marginBottom: 28 }}>
        @alisher_sodiqov
      </div>
      <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
        Frontend Developer
      </div>
      <div style={{ display: 'flex', color: '#7FA8C4', fontSize: 32, marginTop: 24 }}>
        React · Next.js · TypeScript · Accessible Web
      </div>
      <div
        style={{
          display: 'flex',
          width: 180,
          height: 4,
          marginTop: 54,
          background: '#00FF87',
          boxShadow: '0 0 24px #00FF87',
        }}
      />
    </div>,
    size,
  );
}
