// ===================================
// PONTOHUB - JavaScript Principal
// Funcionalidades compartilhadas entre todas as páginas
// VERSÃO OTIMIZADA - Sem Forced Reflow
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

// ============================================
// SISTEMA DE BATCH PARA DOM (Novo - Melhora Performance)
// ============================================
const domBatch = {
    reads: [],
    writes: [],
    scheduled: false,
    
    read(fn) {
        this.reads.push(fn);
        this.schedule();
    },
    
    write(fn) {
        this.writes.push(fn);
        this.schedule();
    },
    
    schedule() {
        if (this.scheduled) return;
        this.scheduled = true;
        
        requestAnimationFrame(() => {
            const reads = [...this.reads];
            const writes = [...this.writes];
            
            this.reads = [];
            this.writes = [];
            this.scheduled = false;
            
            // Executar leituras primeiro, depois escritas
            reads.forEach(fn => fn());
            writes.forEach(fn => fn());
        });
    }
};

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
    
    domBatch.write(() => {
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    lastScroll = currentScroll;
}, 10);

window.addEventListener('scroll', handleScroll, { passive: true });

// ============================================
// MOBILE MENU TOGGLE - OTIMIZADO
// ============================================
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

// Criar classe CSS para evitar modificação inline (melhora performance)
if (!document.querySelector('#menu-open-styles')) {
    const style = document.createElement('style');
    style.id = 'menu-open-styles';
    style.textContent = `
        body.menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

if (mobileToggle && navMenu) {
    // Click handler principal
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Usar batch para evitar forced reflow
        domBatch.write(() => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Usar classe ao invés de estilos inline
            if (navMenu.classList.contains('active')) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Suporte melhorado para toque
    mobileToggle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.click();
    }, { passive: false });
    
    // Adicionar feedback visual no toque
    mobileToggle.addEventListener('touchstart', function() {
        domBatch.write(() => {
            this.style.opacity = '0.7';
        });
    });
    
    mobileToggle.addEventListener('touchend', function() {
        setTimeout(() => {
            domBatch.write(() => {
                this.style.opacity = '1';
            });
        }, 100);
    });
}

// Close mobile menu on link click
const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileToggle && navMenu) {
            domBatch.write(() => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
    });
});

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    if (mobileToggle && navMenu) {
        if (!mobileToggle.contains(e.target) && 
            !navMenu.contains(e.target) && 
            navMenu.classList.contains('active')) {
            domBatch.write(() => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
    }
});

// Smooth Scrolling for anchor links - OTIMIZADO
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Ler primeiro, depois escrever
            domBatch.read(() => {
                const offsetTop = target.offsetTop - 80;
                
                domBatch.write(() => {
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                });
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
    domBatch.write(() => {
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
            domBatch.write(() => {
                if (target === 98) {
                    element.innerText = Math.floor(current) + '%';
                } else {
                    element.innerText = Math.floor(current) + '+';
                }
            });
            requestAnimationFrame(updateNumber);
        } else {
            domBatch.write(() => {
                if (target === 98) {
                    element.innerText = target + '%';
                } else {
                    element.innerText = target + '+';
                }
            });
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
            domBatch.write(() => {
                input.value = '';
                input.placeholder = 'Inscrito com sucesso!';
            });
            
            setTimeout(() => {
                domBatch.write(() => {
                    input.placeholder = 'Seu email';
                });
            }, 3000);
        }
    });
}

// Scroll to Top Button
const scrollTopBtn = document.querySelector('.scroll-top');

if (scrollTopBtn) {
    const handleScrollTop = debounce(() => {
        domBatch.write(() => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
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

// Add ripple effect to buttons - OTIMIZADO
const buttons = document.querySelectorAll('.btn, .cta-btn, .form-submit');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Batch read and write operations
        let rect, size, x, y;
        
        domBatch.read(() => {
            rect = this.getBoundingClientRect();
            size = Math.max(rect.width, rect.height);
            x = e.clientX - rect.left - size / 2;
            y = e.clientY - rect.top - size / 2;
        });
        
        domBatch.write(() => {
            const ripple = document.createElement('span');
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
});

// Handle form field animations
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        domBatch.write(() => {
            this.parentElement.classList.add('focused');
        });
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            domBatch.write(() => {
                this.parentElement.classList.remove('focused');
            });
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
        domBatch.write(() => {
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
    });
    
   
    // Melhorar resposta ao toque
    document.addEventListener('touchstart', function() {}, { passive: true });
}

// ============================================
// GARANTIR VISIBILIDADE DOS ELEMENTOS NO MOBILE
// ============================================
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        domBatch.write(() => {
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