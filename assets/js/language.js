// ===================================
// PONTOHUB - Sistema de Idiomas
// Gerenciamento de traduções e mudança de idioma
// ===================================

class LanguageManager {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = window.translations || {};
        this.init();
    }

    // Detecta o idioma baseado na URL ou navegador
    detectLanguage() {
        // Verifica se há idioma na URL
        const urlLang = this.getLanguageFromURL();
        if (urlLang) return urlLang;

        // Verifica localStorage
        const savedLang = localStorage.getItem('pontohub_language');
        if (savedLang) return savedLang;

        // Detecta idioma do navegador
        const browserLang = navigator.language || navigator.userLanguage;
        
        // Mapeia idiomas do navegador para nossos códigos
        if (browserLang.startsWith('pt-BR')) return 'pt-br';
        if (browserLang.startsWith('pt')) return 'pt-pt';
        if (browserLang.startsWith('en')) return 'en-gb';
        
        // Default
        return 'pt-br';
    }

    // Extrai idioma da URL
    getLanguageFromURL() {
        const path = window.location.pathname;
        const match = path.match(/^\/(pt-br|pt-pt|en-gb)\//i);
        return match ? match[1].toLowerCase() : null;
    }

    // Inicializa o sistema
    init() {
        this.createLanguageSelector();
        this.translatePage();
        this.updateMetaTags();
        this.setupEventListeners();
    }

    // Cria o seletor de idiomas
    createLanguageSelector() {
        // Remove seletor existente se houver
        const existingSelector = document.querySelector('.language-selector');
        if (existingSelector) {
            existingSelector.parentElement.remove();
        }

        const selector = `
            <div class="language-selector">
                <button class="lang-current" aria-label="Selecionar idioma">
                    <img src="../assets/images/flags/${this.getFlagCode()}.svg" alt="${this.currentLang}" width="20" height="15">
                    <span>${this.getLanguageShortName()}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="lang-dropdown">
                    <a href="#" data-lang="pt-br" class="${this.currentLang === 'pt-br' ? 'active' : ''}">
                        <img src="../assets/images/flags/br.svg" alt="Brasil" width="20" height="15">
                        Português (BR)
                    </a>
                    <a href="#" data-lang="pt-pt" class="${this.currentLang === 'pt-pt' ? 'active' : ''}">
                        <img src="../assets/images/flags/pt.svg" alt="Portugal" width="20" height="15">
                        Português (PT)
                    </a>
                    <a href="#" data-lang="en-gb" class="${this.currentLang === 'en-gb' ? 'active' : ''}">
                        <img src="../assets/images/flags/gb.svg" alt="UK" width="20" height="15">
                        English (UK)
                    </a>
                </div>
            </div>
        `;

        // Adiciona o seletor ao menu de navegação
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const li = document.createElement('li');
            li.innerHTML = selector;
            navMenu.insertBefore(li, navMenu.lastElementChild);
        }
    }

    // Retorna o código da bandeira
    getFlagCode() {
        const flags = {
            'pt-br': 'br',
            'pt-pt': 'pt',
            'en-gb': 'gb'
        };
        return flags[this.currentLang] || 'br';
    }

    // Retorna o nome curto do idioma
    getLanguageShortName() {
        const names = {
            'pt-br': 'PT-BR',
            'pt-pt': 'PT-PT',
            'en-gb': 'EN'
        };
        return names[this.currentLang] || 'PT-BR';
    }

    // Traduz a página
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Traduz atributos específicos
        this.translateAttributes();
    }

    // Traduz atributos como alt, title, etc
    translateAttributes() {
        // Alt text das imagens
        const images = document.querySelectorAll('img[data-i18n-alt]');
        images.forEach(img => {
            const key = img.getAttribute('data-i18n-alt');
            const translation = this.getTranslation(key);
            if (translation && translation !== key) img.alt = translation;
        });

        // Title attributes
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.getTranslation(key);
            if (translation && translation !== key) el.title = translation;
        });
    }

    // Obtém uma tradução
    getTranslation(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLang];
        
        if (!translation) return key;
        
        for (const k of keys) {
            translation = translation[k];
            if (!translation) return key;
        }
        
        return translation;
    }

    // Atualiza meta tags do idioma
    updateMetaTags() {
        // Atualiza o atributo lang do HTML
        document.documentElement.lang = this.currentLang;
        
        // Atualiza meta tag de idioma
        const metaLang = document.querySelector('meta[http-equiv="content-language"]');
        if (metaLang) {
            metaLang.content = this.currentLang;
        }
        
        // Atualiza OG locale
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            const localeMap = {
                'pt-br': 'pt_BR',
                'pt-pt': 'pt_PT',
                'en-gb': 'en_GB'
            };
            ogLocale.content = localeMap[this.currentLang] || 'pt_BR';
        }
    }

    // Obtém o nome da página atual
    getCurrentPageName() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop() || 'index.html';
        return pageName;
    }

    // Configura event listeners
    setupEventListeners() {
        // Toggle dropdown
        const langButton = document.querySelector('.lang-current');
        const dropdown = document.querySelector('.lang-dropdown');
        
        if (langButton && dropdown) {
            langButton.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });

            // Fecha dropdown ao clicar fora
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.language-selector')) {
                    dropdown.classList.remove('active');
                }
            });
        }

        // Mudança de idioma
        const langLinks = document.querySelectorAll('.lang-dropdown a');
        langLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const newLang = link.getAttribute('data-lang');
                this.changeLanguage(newLang);
            });
        });
    }

    // Muda o idioma
    changeLanguage(newLang) {
        if (newLang === this.currentLang) return;

        // Salva preferência
        localStorage.setItem('pontohub_language', newLang);

        // Obtém o caminho atual
        const currentPath = window.location.pathname;
        
        // Remove o idioma atual do caminho e barras extras
        let pagePath = currentPath.replace(/^\/(pt-br|pt-pt|en-gb)\//, '');
        
        // Remove barras duplicadas no início
        pagePath = pagePath.replace(/^\/+/, '');
        
        // Se estiver vazio ou apenas '/', é a home
        if (!pagePath || pagePath === '/') {
            pagePath = 'index.html';
        }
        
        // Garante que não há .html duplicado
        if (!pagePath.endsWith('.html') && !pagePath.includes('.')) {
            pagePath = pagePath + '.html';
        }
        
        // Mapeia os nomes das páginas conforme o idioma
        if (newLang === 'en-gb') {
            const pageMap = {
                'servicos.html': 'services.html',
                'sobre.html': 'about.html',
                'parceiros.html': 'partners.html',
                'portfolio.html': 'portfolio.html',
                'contato.html': 'contact.html',
                'contacto.html': 'contact.html' // Para PT-PT
            };
            
            // Substitui se encontrar correspondência
            if (pageMap[pagePath]) {
                pagePath = pageMap[pagePath];
            }
        } else if (this.currentLang === 'en-gb') {
            // Se estiver saindo do inglês, reverte os nomes
            const pageMap = {
                'services.html': 'servicos.html',
                'about.html': 'sobre.html',
                'partners.html': 'parceiros.html',
                'portfolio.html': 'portfolio.html',
                'contact.html': newLang === 'pt-pt' ? 'contacto.html' : 'contato.html'
            };
            
            // Substitui se encontrar correspondência
            if (pageMap[pagePath]) {
                pagePath = pageMap[pagePath];
            }
        }
        
        // Ajusta contacto/contato entre PT-BR e PT-PT
        if (newLang === 'pt-pt' && pagePath === 'contato.html') {
            pagePath = 'contacto.html';
        } else if (newLang === 'pt-br' && pagePath === 'contacto.html') {
            pagePath = 'contato.html';
        }
        
        // Constrói nova URL sem barra dupla
        const newURL = `/${newLang.toLowerCase()}/${pagePath}`;
        
        // Redireciona
        window.location.href = newURL;
    }
}

// CSS para o seletor de idiomas
const languageStyles = `
    <style>
    .language-selector {
        position: relative;
    }

    .lang-current {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: transparent;
        border: 1px solid var(--gray-300);
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition-base);
        font-size: 0.9rem;
        color: var(--dark-blue);
    }

    .lang-current:hover {
        border-color: var(--primary);
    }

    .lang-current i {
        font-size: 0.75rem;
        transition: transform 0.3s ease;
    }

    .lang-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: var(--white);
        border: 1px solid var(--gray-200);
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: var(--transition-base);
        min-width: 180px;
        z-index: 1000;
    }

    .lang-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .lang-dropdown.active ~ .lang-current i {
        transform: rotate(180deg);
    }

    .lang-dropdown a {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        color: var(--dark-blue);
        text-decoration: none;
        transition: var(--transition-base);
        font-size: 0.9rem;
    }

    .lang-dropdown a:hover {
        background: var(--gray-50);
        color: var(--primary);
    }

    .lang-dropdown a.active {
        background: var(--light-gray);
        color: var(--primary);
        font-weight: 600;
    }

    .lang-dropdown a:first-child {
        border-radius: 8px 8px 0 0;
    }

    .lang-dropdown a:last-child {
        border-radius: 0 0 8px 8px;
    }

    @media (max-width: 968px) {
        .language-selector {
            width: 100%;
            margin-top: 1rem;
        }

        .lang-current {
            width: 100%;
            justify-content: center;
        }

        .lang-dropdown {
            position: static;
            margin-top: 1rem;
            width: 100%;
        }
    }
    </style>
`;

// Adiciona os estilos ao documento
document.head.insertAdjacentHTML('beforeend', languageStyles);

// Inicializa o sistema de idiomas quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se já existe uma instância para evitar duplicação
    if (!window.languageManager) {
        window.languageManager = new LanguageManager();
    }
});