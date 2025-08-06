// ===================================
// PONTOHUB - JavaScript Contato
// Funcionalidades específicas para a página de contato
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
            country: document.getElementById('country').value,
            service: document.getElementById('service').value,
            budget: document.getElementById('budget').value,
            timeline: document.getElementById('timeline').value,
            message: document.getElementById('message').value
        };
        
        // Validate required fields
        if (formData.name && formData.email && formData.company && formData.phone && 
            formData.country && formData.service && formData.message) {
            
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
                
                // Show success notification
                showNotification('Obrigado pelo contato! Responderemos em até 24 horas.');
                
                // Reset form after delay
                setTimeout(() => {
                    contactForm.reset();
                    button.innerHTML = originalText;
                    button.style.background = '';
                    button.disabled = false;
                }, 2000);
            }, 1500);
        } else {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
    });
}

// Notification function
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary)' : '#e74c3c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 9999;
        max-width: 400px;
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

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Form field animations
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    // Add floating label effect
    if (input.value) {
        input.parentElement.classList.add('has-value');
    }
    
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
            this.parentElement.classList.remove('has-value');
        } else {
            this.parentElement.classList.add('has-value');
        }
    });
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Format based on length
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + ' ' + value.slice(3);
            } else if (value.length <= 9) {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6);
            } else {
                value = value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9) + ' ' + value.slice(9, 13);
            }
        }
        
        e.target.value = value;
    });
}

// Quick contact button animations
const quickBtns = document.querySelectorAll('.quick-btn');
quickBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        icon.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    btn.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        icon.style.transform = 'scale(1) rotate(0)';
    });
});

// Contact cards hover effect
const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'rotate(-5deg) scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contact-icon');
        icon.style.transform = 'rotate(0) scale(1)';
    });
});

// Add map interaction placeholder
const mapPlaceholder = document.querySelector('.map-placeholder');
if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', () => {
        showNotification('Integração com Google Maps disponível na versão final.', 'info');
    });
}