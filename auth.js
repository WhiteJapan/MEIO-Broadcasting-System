/**
 * Authentication Logic for Meio Broadcasting System
 * 
 * To disable login, set AUTH_REQUIRED to false.
 */
const AUTH_REQUIRED = true;

const AUTH_CONFIG = {
    expectedUser: 'Admin',
    // Hash of 'meiobeta123' (SHA-256)
    expectedHash: 'dd60670db2ef136108aaa45499fbdff781584b947997b2038312219b3d7fec23'
};

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function initAuth() {
    if (!AUTH_REQUIRED) {
        completeAuth();
        return;
    }

    if (sessionStorage.getItem('meio_auth_success') === 'true') {
        completeAuth();
    } else {
        showLogin();
    }
}

/**
 * Finish authentication process: hide login UI and show the next priority UI (Warning Modal)
 */
function completeAuth() {
    hideLogin();
    // script.jsの読み込み完了を待つために少し遅延させるか、既に定義されているか確認
    if (typeof window.showStartupWarning === 'function') {
        window.showStartupWarning();
    } else {
        // まだscript.jsが読み込まれていない場合は、読み込み完了後まで待機
        window.addEventListener('DOMContentLoaded', () => {
            if (typeof window.showStartupWarning === 'function') window.showStartupWarning();
        }, { once: true });
    }
}

function showLogin() {
    const modal = document.getElementById('loginOverlay');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function hideLogin() {
    const modal = document.getElementById('loginOverlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Remove from DOM after transition to be clean, or just keep it hidden
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modal.style.display = 'none';
            }
        }, 500);
    }
}

async function handleLogin(e) {
    if (e) e.preventDefault();

    const userInput = document.getElementById('loginID').value;
    const passInput = document.getElementById('loginPass').value;
    const errorEl = document.getElementById('loginError');

    errorEl.textContent = '';
    errorEl.classList.remove('shake');

    const passHash = await sha256(passInput);

    if (userInput === AUTH_CONFIG.expectedUser && passHash === AUTH_CONFIG.expectedHash) {
        sessionStorage.setItem('meio_auth_success', 'true');
        completeAuth();
    } else {
        errorEl.textContent = 'IDまたはパスワードが正しくありません。';
        errorEl.classList.add('shake');

        // Optional: clear password field
        document.getElementById('loginPass').value = '';
    }
}

// Initial check
document.addEventListener('DOMContentLoaded', () => {
    // Add event listener for form
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }

    initAuth();
});
