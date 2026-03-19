const ModalType = {
    CONFIRM: 'confirm',
    ALERT: 'alert',
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
};

const ModalIcon = {
    confirm: '❓',
    alert: '⚠️',
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    danger: '🚨'
};

class ModalManager {
    constructor() {
        this.overlay = null;
        this.currentResolve = null;
        this.init();
    }

    init() {
        this.overlay = document.getElementById('modal-overlay');
        if (!this.overlay) {
            this.createModalDOM();
            this.overlay = document.getElementById('modal-overlay');
        }
        this.bindEvents();
    }

    createModalDOM() {
        const modalHTML = `
            <div id="modal-overlay" class="modal-overlay">
                <div class="modal-container">
                    <button class="modal-close" id="modal-close">&times;</button>
                    <span class="modal-icon" id="modal-icon"></span>
                    <h3 class="modal-title" id="modal-title"></h3>
                    <p class="modal-message" id="modal-message"></p>
                    <div class="modal-buttons" id="modal-buttons"></div>
                    <div class="modal-progress" id="modal-progress" style="display: none;">
                        <div class="modal-progress-bar" id="modal-progress-bar"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    bindEvents() {
        const closeBtn = document.getElementById('modal-close');
        closeBtn?.addEventListener('click', () => this.closeModal(false));

        this.overlay?.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.closeModal(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
                this.closeModal(false);
            }
        });
    }

    openModal(options) {
        return new Promise((resolve) => {
            const {
                type = ModalType.CONFIRM,
                title = '',
                message = '',
                confirmText = 'Aceptar',
                cancelText = 'Cancelar',
                showCancel = true,
                autoClose = false,
                duration = 5000,
                size = 'normal'
            } = options;

            this.currentResolve = resolve;

            const iconEl = document.getElementById('modal-icon');
            const titleEl = document.getElementById('modal-title');
            const messageEl = document.getElementById('modal-message');
            const buttonsEl = document.getElementById('modal-buttons');
            const progressEl = document.getElementById('modal-progress');
            const progressBarEl = document.getElementById('modal-progress-bar');
            const containerEl = this.overlay.querySelector('.modal-container');

            iconEl.textContent = ModalIcon[type] || ModalIcon.confirm;
            iconEl.className = `modal-icon ${type}`;
            titleEl.textContent = title;
            messageEl.textContent = message;

            containerEl.classList.remove('modal-small', 'modal-large');
            if (size === 'small') containerEl.classList.add('modal-small');
            if (size === 'large') containerEl.classList.add('modal-large');

            if (autoClose && type !== ModalType.CONFIRM) {
                progressEl.style.display = 'block';
                progressBarEl.style.setProperty('--duration', `${duration}ms`);
                progressBarEl.style.animation = 'none';
                progressBarEl.offsetHeight;
                progressBarEl.style.animation = `progressShrink ${duration}ms linear forwards`;
                
                this.autoCloseTimeout = setTimeout(() => {
                    this.closeModal(true);
                }, duration);
            } else {
                progressEl.style.display = 'none';
            }

            if (type === ModalType.CONFIRM && showCancel) {
                buttonsEl.innerHTML = `
                    <button class="btn btn-ghost" id="modal-cancel">${cancelText}</button>
                    <button class="btn btn-primary" id="modal-confirm">${confirmText}</button>
                `;
                
                document.getElementById('modal-confirm')?.addEventListener('click', () => this.closeModal(true));
                document.getElementById('modal-cancel')?.addEventListener('click', () => this.closeModal(false));
            } else {
                buttonsEl.innerHTML = `
                    <button class="btn btn-primary" id="modal-ok">${confirmText}</button>
                `;
                
                document.getElementById('modal-ok')?.addEventListener('click', () => this.closeModal(true));
            }

            this.overlay.classList.add('active');
            
            setTimeout(() => {
                const firstBtn = buttonsEl.querySelector('button');
                firstBtn?.focus();
            }, 100);
        });
    }

    closeModal(result) {
        if (this.autoCloseTimeout) {
            clearTimeout(this.autoCloseTimeout);
            this.autoCloseTimeout = null;
        }

        this.overlay.classList.remove('active');
        
        if (this.currentResolve) {
            this.currentResolve(result);
            this.currentResolve = null;
        }
    }

    confirm(options) {
        return this.openModal({
            type: ModalType.CONFIRM,
            ...options
        });
    }

    alert(options) {
        return this.openModal({
            type: ModalType.ALERT,
            showCancel: false,
            ...options
        });
    }

    info(options) {
        return this.openModal({
            type: ModalType.INFO,
            showCancel: false,
            ...options
        });
    }

    success(options) {
        return this.openModal({
            type: ModalType.SUCCESS,
            showCancel: false,
            autoClose: true,
            duration: 3000,
            ...options
        });
    }

    warning(options) {
        return this.openModal({
            type: ModalType.WARNING,
            showCancel: false,
            ...options
        });
    }

    danger(options) {
        return this.openModal({
            type: ModalType.DANGER,
            showCancel: false,
            ...options
        });
    }
}

export const modal = new ModalManager();

export function showConfirm(options) {
    return modal.confirm(options);
}

export function showAlert(options) {
    return modal.alert(options);
}

export function showInfo(options) {
    return modal.info(options);
}

export function showSuccess(options) {
    return modal.success(options);
}

export function showWarning(options) {
    return modal.warning(options);
}

export function showDanger(options) {
    return modal.danger(options);
}

export { ModalType };
