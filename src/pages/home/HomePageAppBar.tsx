import { Typography, Box } from '@mui/material'
import MainAppBar from '../../components/layout/MainAppBar'

type Props = {}

export default function HomePageAppBar({}: Props) {
  return (
    <MainAppBar>
      <Box sx={{ display: 'flex' }}>
        <Typography variant="h6">Home Page</Typography>
      </Box>
    </MainAppBar>
  )
}