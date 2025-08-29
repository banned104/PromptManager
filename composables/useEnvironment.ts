export const useEnvironment = () => {
  const isTauri = () => {
    if (typeof window === 'undefined') return false
    return '__TAURI__' in window
  }

  const isWeb = () => {
    return !isTauri()
  }

  return {
    isTauri,
    isWeb
  }
}