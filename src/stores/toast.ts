import { defineStore } from 'pinia'

type ToastColor = 'success' | 'error' | 'warning' | 'info'

interface ToastState {
  show: boolean
  message: string
  color: ToastColor
  timeout: number
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    show: false,
    message: '',
    color: 'info',
    timeout: 3000,
  }),
  actions: {
    _show(message: string, color: ToastColor, timeout = 3000) {
      this.message = message
      this.color = color
      this.timeout = timeout
      this.show = true
    },
    success(message: string, timeout?: number) {
      this._show(message, 'success', timeout)
    },
    error(message: string, timeout?: number) {
      this._show(message, 'error', timeout)
    },
    warning(message: string, timeout?: number) {
      this._show(message, 'warning', timeout)
    },
    info(message: string, timeout?: number) {
      this._show(message, 'info', timeout)
    },
  },
})
