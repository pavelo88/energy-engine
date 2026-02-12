import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AssetTrack AI | Energy Engine España',
    short_name: 'AssetTrack AI',
    description: 'Plataforma de mantenimiento predictivo y gestión de activos impulsada por IA.',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    icons: [
      {
        "src": "/android-chrome-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/android-chrome-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
}
