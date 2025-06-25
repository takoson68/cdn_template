export class ToastNotifier {
  notify(message) {
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.position = 'fixed'
    toast.style.bottom = '20px'
    toast.style.left = '20px'
    toast.style.padding = '10px'
    toast.style.backgroundColor = '#333'
    toast.style.color = '#fff'
    toast.style.borderRadius = '4px'
    document.body.appendChild(toast)
    setTimeout(() => document.body.removeChild(toast), 3000)
  }
}