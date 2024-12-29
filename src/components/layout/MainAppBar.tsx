import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

type Props = {
    children: React.ReactNode | null | undefined
}

export default function MainAppBar({ children }: Props) {
  return (
    <AppBar sx={{ width: 'calc(100% - 240px)', backgroundColor: '#fff' }} position="fixed">
      <Toolbar>
        {children}
      </Toolbar>
    </AppBar>
  )
}