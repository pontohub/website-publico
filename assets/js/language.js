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
        
        if (!translation) {
            return key;
        }
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback para pt-br se não encontrar a tradução
                translation = this.translations['pt-br'];
                if (!translation) return key;
                
                for (const k2 of keys) {
                    if (translation && translation[k2]) {
                        translation = translation[k2];
                    } else {
                        return key; // Retorna a chave se não encontrar tradução
                    }
                }
                return translation;
            }
        }
        
        return translation;
    }

    // Atualiza meta tags para SEO
    updateMetaTags() {
        // Atualiza lang attribute
        document.documentElement.lang = this.currentLang;

        // Atualiza meta tags
        this.updateMetaTag('description', this.getPageDescription());
        this.updateMetaTag('keywords', this.getPageKeywords());

        // Atualiza Open Graph
        this.updateMetaProperty('og:locale', this.getOGLocale());
        this.updateMetaProperty('og:description', this.getPageDescription());

        // Adiciona links alternativos para outros idiomas
        this.updateAlternateLinks();
    }

    // Atualiza uma meta tag
    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    // Atualiza uma meta property
    updateMetaProperty(property, content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    // Obtém a descrição da página no idioma atual
    getPageDescription() {
        const descriptions = {
            'pt-br': 'PontoHub - Conectando ideias, transformando negócios. Líderes em transformação digital com soluções de software, IA, Cloud Computing e integração de sistemas.',
            'pt-pt': 'PontoHub - A conectar ideias, a transformar negócios. Líderes em transformação digital com soluções de software, IA, Cloud Computing e integração de sistemas.',
            'en-gb': 'PontoHub - Connecting ideas, transforming businesses. Digital transformation leaders with software solutions, AI, Cloud Computing and systems integration.'
        };
        return descriptions[this.currentLang] || descriptions['pt-br'];
    }

    // Obtém as palavras-chave no idioma atual
    getPageKeywords() {
        const keywords = {
            'pt-br': 'desenvolvimento software, integração sistemas, transformação digital, inteligência artificial, cloud computing, portugal, brasil',
            'pt-pt': 'desenvolvimento software, integração sistemas, transformação digital, inteligência artificial, cloud computing, portugal, brasil',
            'en-gb': 'software development, systems integration, digital transformation, artificial intelligence, cloud computing, portugal, brazil'
        };
        return keywords[this.currentLang] || keywords['pt-br'];
    }

    // Obtém o locale para Open Graph
    getOGLocale() {
        const locales = {
            'pt-br': 'pt_BR',
            'pt-pt': 'pt_PT',
            'en-gb': 'en_GB'
        };
        return locales[this.currentLang] || 'pt_BR';
    }

    // Atualiza links alternativos
    updateAlternateLinks() {
        // Remove links existentes
        const existingLinks = document.querySelectorAll('link[rel="alternate"]');
        existingLinks.forEach(link => link.remove());

        // Adiciona novos links
        const languages = ['pt-br', 'pt-pt', 'en-gb'];
        const currentPage = this.getCurrentPageName();

        languages.forEach(lang => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = lang.toLowerCase();
            link.href = `/${lang.toLowerCase()}/${currentPage}`;
            document.head.appendChild(link);
        });

        // Adiciona x-default
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = `/${currentPage}`;
        document.head.appendChild(defaultLink);
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
        
        // Remove o idioma atual do caminho
        let pagePath = currentPath.replace(/^\/(pt-br|pt-pt|en-gb)\//, '/');
        
        // Se estiver na raiz do idioma, adiciona index.html
        if (pagePath === '/' || pagePath === '') {
            pagePath = 'index.html';
        }
        
        // Remove .html se existir (para URLs limpas)
        pagePath = pagePath.replace('.html', '');
        
        // Ajusta nome da página para inglês se necessário
        if (newLang === 'en-gb') {
            const pageMap = {
                'servicos': 'services',
                'sobre': 'about',
                'parceiros': 'partners',
                'contato': 'contact'
            };
            
            Object.keys(pageMap).forEach(ptPage => {
                if (pagePath.includes(ptPage)) {
                    pagePath = pagePath.replace(ptPage, pageMap[ptPage]);
                }
            });
        } else if (this.currentLang === 'en-gb') {
            // Se estiver saindo do inglês, reverte os nomes
            const pageMap = {
                'services': 'servicos',
                'about': 'sobre',
                'partners': 'parceiros',
                'contact': 'contato'
            };
            
            Object.keys(pageMap).forEach(enPage => {
                if (pagePath.includes(enPage)) {
                    pagePath = pagePath.replace(enPage, pageMap[enPage]);
                }
            });
        }
        
        // Ajusta contacto/contato para PT-PT
        if (newLang === 'pt-pt' && pagePath.includes('contato')) {
            pagePath = pagePath.replace('contato', 'contacto');
        } else if (this.currentLang === 'pt-pt' && pagePath.includes('contacto')) {
            pagePath = pagePath.replace('contacto', 'contato');
        }
        
        // Constrói nova URL
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