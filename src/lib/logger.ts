export function createLogger(
  prefix = '',
  options?: {
    enableLog?: boolean
    enableInfo?: boolean
    enableWarn?: boolean
    enableError?: boolean
  }
): Pick<typeof console, 'log' | 'info' | 'error' | 'warn'> {
  const log = options?.enableLog ?? true ? console.log.bind(console, prefix) : () => {}
  const info = options?.enableInfo ?? true ? console.info.bind(console, prefix) : () => {}
  const error = options?.enableError ?? true ? console.error.bind(console, prefix) : () => {}
  const warn = options?.enableWarn ?? true ? console.warn.bind(console, prefix) : () => {}
  return { log, info, error, warn }
}
