// ===================================
// PONTOHUB - JavaScript Parceiros
// Funcionalidades específicas para a página de parceiros
// ===================================

// Tech items hover effect with wave animation
const techItems = document.querySelectorAll('.tech-item');
techItems.forEach((item, index) => {
    item.addEventListener('mouseenter', function() {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.className = 'tech-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(11, 67, 135, 0.3);
            transform: translate(-50%, -50%);
            animation: techRipple 0.6s ease-out;
            pointer-events: none;
        `;
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes techRipple {
        to {
            width: 200%;
            height: 200%;
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
    
    @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(11, 67, 135, 0.5); }
        50% { box-shadow: 0 0 20px rgba(11, 67, 135, 0.8); }
    }
`;
document.head.appendChild(style);

// Partner logos hover effect
const logoPlaceholders = document.querySelectorAll('.logo-placeholder');
logoPlaceholders.forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        icon.style.animation = 'float 1s ease-in-out infinite';
        this.style.animation = 'glow 1s ease-in-out infinite';
    });
    
    logo.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        icon.style.animation = '';
        this.style.animation = '';
    });
});

// Tech categories stagger animation
const techCategories = document.querySelectorAll('.tech-category');
const categoryObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate items inside
                const items = entry.target.querySelectorAll('.tech-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, i * 50);
                });
            }, index * 200);
        }
    });
}, {
    threshold: 0.1
});

techCategories.forEach(category => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(30px)';
    category.style.transition = 'all 0.6s ease';
    
    // Set initial state for items
    const items = category.querySelectorAll('.tech-item');
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        item.style.transition = 'all 0.3s ease';
    });
    
    categoryObserver.observe(category);
});

// Certification cards animation
const certCards = document.querySelectorAll('.certification-card');
const certObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) rotate(0)';
            }, index * 150);
        }
    });
}, {
    threshold: 0.2
});

certCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) rotate(-5deg)';
    card.style.transition = 'all 0.6s ease';
    certObserver.observe(card);
});

// Partner logos carousel effect (optional)
const techLogosGrids = document.querySelectorAll('.tech-logos-grid');
techLogosGrids.forEach(grid => {
    const logos = grid.querySelectorAll('.tech-logo-item');
    
    // Add sequential hover effect
    logos.forEach((logo, index) => {
        logo.addEventListener('mouseenter', function() {
            // Scale neighboring logos
            if (logos[index - 1]) {
                logos[index - 1].style.transform = 'scale(0.95)';
            }
            if (logos[index + 1]) {
                logos[index + 1].style.transform = 'scale(0.95)';
            }
        });
        
        logo.addEventListener('mouseleave', function() {
            logos.forEach(l => {
                l.style.transform = 'scale(1)';
            });
        });
    });
});

// Filter functionality for tech stack (if needed in future)
function filterTechStack(category) {
    const allItems = document.querySelectorAll('.tech-item');
    allItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.page-hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});