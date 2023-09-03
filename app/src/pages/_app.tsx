import '@/styles/globals.css'
import Header from '@/components/layouts/Header'
import type { AppProps } from 'next/app'
import { AuthProvider } from '@/components/auth/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap';
import '../sass/custom.scss'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <div className="page_root">
        <Header />
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </div>
    </>
  )
}
