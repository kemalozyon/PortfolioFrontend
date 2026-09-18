import { useLayoutEffect } from 'react'

const AppReady = ({ children }) => {
  useLayoutEffect(() => {
    document.documentElement.removeAttribute('data-app-loading')
  }, [])
  return children
}

export default AppReady
