// ===================================
// PONTOHUB - JavaScript Sobre
// Funcionalidades específicas para a página sobre
// ===================================

// Animate milestone items on scroll
const milestoneItems = document.querySelectorAll('.milestone-item');
const milestoneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                // Animate the year badge
                const yearBadge = entry.target.querySelector('.milestone-year');
                yearBadge.style.transform = 'translateY(0) scale(1)';
                yearBadge.style.opacity = '1';
            }, index * 200);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

milestoneItems.forEach(item => {
    // Set initial state
    const yearBadge = item.querySelector('.milestone-year');
    yearBadge.style.transform = 'translateY(20px) scale(0.8)';
    yearBadge.style.opacity = '0';
    yearBadge.style.transition = 'all 0.6s ease';
    
    milestoneObserver.observe(item);
});

// Team member cards hover effect
const memberCards = document.querySelectorAll('.member-card');
memberCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Animate avatar
        const avatar = this.querySelector('.avatar-shape');
        avatar.style.animation = 'pulse 1s ease-in-out infinite';
    });
    
    card.addEventListener('mouseleave', function() {
        const avatar = this.querySelector('.avatar-shape');
        avatar.style.animation = '';
    });
});

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Social links hover effect
const socialLinks = document.querySelectorAll('.social-link');
socialLinks.forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(360deg)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// MVV cards stagger animation
const mvvCards = document.querySelectorAll('.mvv-card');
const mvvObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 150);
        }
    });
}, {
    threshold: 0.1
});

mvvCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = 'all 0.6s ease';
    mvvObserver.observe(card);
});

// Stats counter animation with enhanced effect
const statValues = document.querySelectorAll('.stat-value');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.innerText);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = Math.floor(current) + (target === 98 ? '%' : '+');
                    requestAnimationFrame(updateNumber);
                } else {
                    entry.target.innerText = target + (target === 98 ? '%' : '+');
                    // Add a bounce effect when complete
                    entry.target.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        entry.target.style.transform = 'scale(1)';
                    }, 200);
                }
            };
            
            updateNumber();
        }
    });
}, {
    threshold: 0.5
});

statValues.forEach(stat => {
    stat.style.transition = 'transform 0.3s ease';
    statsObserver.observe(stat);
});