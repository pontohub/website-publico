// ===================================
// PONTOHUB - JavaScript Serviços
// Funcionalidades específicas para a página de serviços
// ===================================

// Form Submission Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value
        };
        
        // Validate required fields
        if (formData.name && formData.email && formData.service && formData.message) {
            // Simulate form submission
            const button = contactForm.querySelector('.form-submit');
            const originalText = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Enviando...</span>';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                button.innerHTML = '<span><i class="fas fa-check"></i> Mensagem Enviada!</span>';
                button.style.background = 'var(--cyan)';
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                    
                    // Show success notification
                    showNotification('Obrigado pelo contato! Responderemos em breve.');
                }, 2000);
            }, 1500);
        }
    });
}

// Notification function
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Service card click to form
const serviceLinks = document.querySelectorAll('.service-link');
serviceLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get service name from parent card
        const serviceCard = link.closest('.service-card');
        const serviceTitle = serviceCard.querySelector('.service-title').textContent;
        
        // Scroll to form
        const form = document.getElementById('contact-form');
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Pre-select service in dropdown
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            const serviceMap = {
                'Ponto Dev': 'dev',
                'Ponto Data': 'data',
                'IA Hub': 'ai',
                'Hub Integration': 'integration',
                'Cloud Solutions': 'cloud',
                'Cybersecurity': 'security'
            };
            
            if (serviceMap[serviceTitle]) {
                serviceSelect.value = serviceMap[serviceTitle];
                serviceSelect.classList.add('selected');
                
                // Highlight the field
                serviceSelect.style.borderColor = 'var(--primary)';
                setTimeout(() => {
                    serviceSelect.style.borderColor = '';
                }, 2000);
            }
        }, 800);
    });
});

// Animate timeline on scroll
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, {
    threshold: 0.2
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Service cards hover effect
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add floating animation to icon
        const icon = this.querySelector('.service-icon');
        icon.style.animation = 'float 2s ease-in-out infinite';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.service-icon');
        icon.style.animation = '';
    });
});

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);