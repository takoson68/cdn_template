export class ModalNotifier {
  notify(message) {
    const modal = document.createElement('div')
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
        <div style="background:#fff;padding:20px;border-radius:8px;">
          <p>${message}</p>
          <button id="modal-close">關閉</button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
    document.getElementById('modal-close')?.addEventListener('click', () => {
      document.body.removeChild(modal)
    })
  }
}