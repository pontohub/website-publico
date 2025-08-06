// ===================================
// PONTOHUB - Cookie Management System
// ===================================

class CookieManager {
    constructor() {
        this.cookieConsent = this.getCookie('pontohub_cookie_consent');
        this.cookiePreferences = this.getCookie('pontohub_cookie_preferences') || {};
        this.init();
    }

    init() {
        // Debug - remover depois
        console.log('Cookie Manager initialized');
        console.log('Has consent:', this.cookieConsent);
        console.log('Preferences:', this.cookiePreferences);
        
        // Check if consent was already given
        if (!this.cookieConsent) {
            // Show cookie banner after a small delay
            console.log('No consent found, showing banner...');
            setTimeout(() => {
                this.showCookieBanner();
            }, 1000);
        } else {
            // Apply saved preferences
            console.log('Consent found, applying preferences...');
            this.applyPreferences();
        }
    }

    // Show cookie banner
    showCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.style.display = 'block'; // Primeiro torna visível
            setTimeout(() => {
                banner.classList.add('show'); // Depois anima
            }, 100);
        }
    }

    // Hide cookie banner
    hideCookieBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(() => {
                banner.style.display = 'none';
                banner.classList.remove('hide');
            }, 400);
        }
    }

    // Accept all cookies
    acceptCookies() {
        const preferences = {
            essential: true,
            analytics: true,
            marketing: true,
            functional: true
        };
        
        this.savePreferences(preferences);
        this.hideCookieBanner();
        this.showNotification('✅ Cookies aceitos', 'Todas as categorias de cookies foram ativadas.');
    }

    // Reject non-essential cookies
    rejectCookies() {
        const preferences = {
            essential: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        
        this.savePreferences(preferences);
        this.hideCookieBanner();
        this.showNotification('🚫 Cookies rejeitados', 'Apenas cookies essenciais foram mantidos.');
    }

    // Open cookie settings modal
    openCookieSettings() {
        const modal = document.getElementById('cookieSettings');
        if (modal) {
            modal.classList.add('show');
            // Load current preferences
            this.loadCurrentPreferences();
        }
    }

    // Close cookie settings modal
    closeCookieSettings() {
        const modal = document.getElementById('cookieSettings');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Load current preferences in modal
    loadCurrentPreferences() {
        const preferences = this.cookiePreferences;
        
        // Set checkbox states
        document.getElementById('analyticsCookies').checked = preferences.analytics || false;
        document.getElementById('marketingCookies').checked = preferences.marketing || false;
        document.getElementById('functionalCookies').checked = preferences.functional || false;
    }

    // Save cookie settings from modal
    saveCookieSettings() {
        const preferences = {
            essential: true,
            analytics: document.getElementById('analyticsCookies').checked,
            marketing: document.getElementById('marketingCookies').checked,
            functional: document.getElementById('functionalCookies').checked
        };
        
        this.savePreferences(preferences);
        this.closeCookieSettings();
        this.hideCookieBanner();
        this.showNotification('💾 Preferências guardadas', 'As suas preferências de cookies foram atualizadas.');
    }

    // Accept all from settings
    acceptAllFromSettings() {
        document.getElementById('analyticsCookies').checked = true;
        document.getElementById('marketingCookies').checked = true;
        document.getElementById('functionalCookies').checked = true;
        this.saveCookieSettings();
    }

    // Reject all from settings
    rejectAllFromSettings() {
        document.getElementById('analyticsCookies').checked = false;
        document.getElementById('marketingCookies').checked = false;
        document.getElementById('functionalCookies').checked = false;
        this.saveCookieSettings();
    }

    // Save preferences to cookie
    savePreferences(preferences) {
        // Salva por 365 dias e funciona em todo o site
        this.setCookie('pontohub_cookie_consent', 'true', 365);
        this.setCookie('pontohub_cookie_preferences', JSON.stringify(preferences), 365);
        this.cookieConsent = 'true'; // Atualiza a variável local
        this.cookiePreferences = preferences;
        this.applyPreferences();
        
        console.log('Preferences saved:', preferences);
        console.log('Cookie will expire in 365 days');
    }

    // Apply cookie preferences
    applyPreferences() {
        const preferences = this.cookiePreferences;
        
        // Analytics cookies (Google Analytics, etc.)
        if (preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Marketing cookies
        if (preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        // Functional cookies
        if (preferences.functional) {
            this.enableFunctional();
        } else {
            this.disableFunctional();
        }
    }

    // Enable Analytics
    enableAnalytics() {
        // Enable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        console.log('Analytics cookies enabled');
    }

    // Disable Analytics
    disableAnalytics() {
        // Disable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        // Remove GA cookies
        this.deleteCookie('_ga');
        this.deleteCookie('_gid');
        this.deleteCookie('_gat');
        console.log('Analytics cookies disabled');
    }

    // Enable Marketing
    enableMarketing() {
        // Enable marketing/advertising cookies
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
        console.log('Marketing cookies enabled');
    }

    // Disable Marketing
    disableMarketing() {
        // Disable marketing/advertising cookies
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
        console.log('Marketing cookies disabled');
    }

    // Enable Functional
    enableFunctional() {
        // Enable functional cookies (language preferences, etc.)
        console.log('Functional cookies enabled');
    }

    // Disable Functional
    disableFunctional() {
        // Disable functional cookies except essential ones
        console.log('Functional cookies disabled');
    }

    // Utility: Set cookie
    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }

    // Utility: Get cookie
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                const value = c.substring(nameEQ.length, c.length);
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            }
        }
        return null;
    }

    // Utility: Delete cookie
    deleteCookie(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
    }

    // Show notification
    showNotification(title, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cookie manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cookieManager = new CookieManager();
});

// Global functions for onclick handlers
function acceptCookies() {
    window.cookieManager.acceptCookies();
}

function rejectCookies() {
    window.cookieManager.rejectCookies();
}

function openCookieSettings() {
    window.cookieManager.openCookieSettings();
}

function closeCookieSettings() {
    window.cookieManager.closeCookieSettings();
}

function saveCookieSettings() {
    window.cookieManager.saveCookieSettings();
}

function acceptAllFromSettings() {
    window.cookieManager.acceptAllFromSettings();
}

function rejectAllFromSettings() {
    window.cookieManager.rejectAllFromSettings();
}

function openCookiePolicy() {
    // Detect current language from URL
    const path = window.location.pathname;
    let cookiePolicyUrl = '/politica-cookies.html';
    
    if (path.includes('/en-gb/')) {
        cookiePolicyUrl = '/en-gb/cookie-policy.html';
    } else if (path.includes('/pt-pt/')) {
        cookiePolicyUrl = '/pt-pt/politica-cookies.html';
    } else if (path.includes('/pt-br/')) {
        cookiePolicyUrl = '/pt-br/politica-cookies.html';
    }
    
    window.open(cookiePolicyUrl, '_blank');
}

// Função para resetar cookies (útil para testes)
function resetCookieConsent() {
    document.cookie = 'pontohub_cookie_consent=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
    document.cookie = 'pontohub_cookie_preferences=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
    console.log('Cookie consent reset! Refreshing page...');
    setTimeout(() => {
        location.reload();
    }, 500);
}

// Função para verificar status dos cookies
function checkCookieStatus() {
    const consent = document.cookie.includes('pontohub_cookie_consent');
    const preferences = document.cookie.match(/pontohub_cookie_preferences=([^;]*)/);
    
    console.log('=== Cookie Status ===');
    console.log('Has consent:', consent);
    if (preferences) {
        try {
            const prefs = JSON.parse(decodeURIComponent(preferences[1]));
            console.log('Saved preferences:', prefs);
        } catch(e) {
            console.log('Preferences:', preferences[1]);
        }
    }
    console.log('All cookies:', document.cookie);
    console.log('===================');
    
    return consent;
}

// Add notification styles
const notificationStyles = `
<style>
.cookie-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 16px 20px;
    z-index: 10001;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 320px;
}

.cookie-notification.show {
    transform: translateX(0);
}

.cookie-notification h4 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--dark-blue);
}

.cookie-notification p {
    margin: 0;
    font-size: 0.9rem;
    color: var(--gray-600);
}
</style>
`;

// Add styles to head
document.head.insertAdjacentHTML('beforeend', notificationStyles);