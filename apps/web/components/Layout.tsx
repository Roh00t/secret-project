import React, { ReactNode } from 'react'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{fontFamily: 'Inter, system-ui, sans-serif', minHeight: '100vh'}}>
      <Header />
      <main>{children}</main>
    </div>
  )
}
