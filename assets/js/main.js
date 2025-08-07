// ===================================
// PONTOHUB - JavaScript Principal
// Funcionalidades compartilhadas entre todas as páginas
// ===================================

// Performance: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Cursor customizado (apenas desktop)
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower && window.innerWidth > 968) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
} else if (cursor && cursorFollower) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}

// Navigation Scroll Effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

const handleScroll = debounce(() => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// MOBILE MENU TOGGLE - CORRIGIDO
// ============================================
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle && navMenu) {
    // Click handler principal
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevenir scroll quando menu está aberto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    });
    
    // Suporte melhorado para toque
    mobileToggle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.click();
    }, { passive: false });
    
    // Adicionar feedback visual no toque
    mobileToggle.addEventListener('touchstart', function() {
        this.style.opacity = '0.7';
    });
    
    mobileToggle.addEventListener('touchend', function() {
        setTimeout(() => {
            this.style.opacity = '1';
        }, 100);
    });
}

// Close mobile menu on link click
const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileToggle && navMenu) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    if (mobileToggle && navMenu) {
        if (!mobileToggle.contains(e.target) && 
            !navMenu.contains(e.target) && 
            navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }
    }
});

// Smooth Scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER - MELHORADO PARA MOBILE
// ============================================
const observerOptions = {
    threshold: window.innerWidth <= 768 ? 0.05 : 0.1,
    rootMargin: window.innerWidth <= 768 ? '0px 0px -50px 0px' : '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate numbers com delay para mobile
            if (entry.target.classList.contains('stat-number')) {
                if (window.innerWidth <= 768) {
                    setTimeout(() => animateNumber(entry.target), 100);
                } else {
                    animateNumber(entry.target);
                }
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-in').forEach(el => {
    observer.observe(el);
});

// Observe stat numbers
document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
});

// ============================================
// ANIMATE NUMBERS - CORRIGIDO PARA MOBILE
// ============================================
function animateNumber(element) {
    // Prevenir animação duplicada
    if (element.dataset.animated === 'true') return;
    element.dataset.animated = 'true';
    
    const target = parseInt(element.getAttribute('data-target'));
    const duration = window.innerWidth <= 768 ? 1500 : 2000; // Mais rápido no mobile
    const step = target / (duration / 16);
    let current = 0;
    
    const updateNumber = () => {
        current += step;
        if (current < target) {
            if (target === 98) {
                element.innerText = Math.floor(current) + '%';
            } else {
                element.innerText = Math.floor(current) + '+';
            }
            requestAnimationFrame(updateNumber);
        } else {
            if (target === 98) {
                element.innerText = target + '%';
            } else {
                element.innerText = target + '+';
            }
        }
    };
    
    updateNumber();
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector('.newsletter-input');
        const email = input.value;
        
        if (email) {
            input.value = '';
            input.placeholder = 'Inscrito com sucesso!';
            setTimeout(() => {
                input.placeholder = 'Seu email';
            }, 3000);
        }
    });
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

if (scrollTopBtn) {
    const handleScrollTop = debounce(() => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100);

    window.addEventListener('scroll', handleScrollTop, { passive: true });
    
    // Adicionar suporte para toque no botão scroll to top
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active Navigation Link Based on Current Page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// Add ripple effect to buttons
const buttons = document.querySelectorAll('.btn, .cta-btn, .form-submit');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Handle form field animations
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Optimize animations on scroll
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update animations here
    ticking = false;
}

window.addEventListener('scroll', requestTick, { passive: true });

// ============================================
// CORREÇÕES ESPECÍFICAS PARA MOBILE
// ============================================

// Detectar dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile || window.innerWidth <= 768) {
    // Melhorar performance no mobile
    document.addEventListener('DOMContentLoaded', function() {
        // Desabilitar animações complexas no mobile
        const complexAnimations = document.querySelectorAll('.parallax, .float-element');
        complexAnimations.forEach(el => {
            el.style.animation = 'none';
            el.style.transform = 'none';
        });
        
        // Garantir que todos os elementos estejam visíveis
        const sections = document.querySelectorAll('.featured-services, .values-section, .stats-section, .testimonials, .cta');
        sections.forEach(section => {
            if (section) {
                section.style.display = 'block';
                section.style.visibility = 'visible';
                section.style.opacity = '1';
            }
        });
        
        // Adicionar classe para estilos mobile específicos
        document.body.classList.add('is-mobile');
    });
    
    // Prevenir zoom em inputs no iOS
    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
    
    // Melhorar resposta ao toque
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// ============================================
// GARANTIR VISIBILIDADE DOS ELEMENTOS NO MOBILE
// ============================================
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        // Forçar visibilidade de seções importantes
        const importantSections = [
            '.featured-services',
            '.values-section', 
            '.stats-section',
            '.testimonials',
            '.cta',
            '.services',
            '.portfolio',
            '.timeline-section',
            '.mvv-section',
            '.milestones',
            '.team',
            '.tech-section',
            '.certifications',
            '.contact'
        ];
        
        importantSections.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.style.display = 'block';
                    el.style.visibility = 'visible';
                    el.style.opacity = '1';
                }
            });
        });
    }
});

// ============================================
// FIX PARA O CONTADOR NO BANNER MOBILE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 768) {
        // Reinicializar contadores se necessário
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            // Resetar flag de animação
            delete number.dataset.animated;
            
            // Criar novo observer específico para mobile
            const mobileObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        animateNumber(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            mobileObserver.observe(number);
        });
    }
});