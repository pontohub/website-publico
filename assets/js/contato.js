// ===================================
// PONTOHUB - JavaScript Contato
// Funcionalidades específicas para a página de contato
// VERSÃO COM DISCORD INTEGRATION
// ===================================

// Form Submission Handler - ATUALIZADO PARA DISCORD
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            phone: document.getElementById('phone').value,
            country: document.getElementById('country').value,
            service: document.getElementById('service').value,
            budget: document.getElementById('budget').value || 'Não especificado',
            timeline: document.getElementById('timeline').value || 'A definir',
            message: document.getElementById('message').value
        };
        
        // Validate required fields
        if (formData.name && formData.email && formData.company && formData.phone && 
            formData.country && formData.service && formData.message) {
            
            const button = contactForm.querySelector('.form-submit');
            const originalText = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<span><i class="fas fa-spinner fa-spin"></i> Enviando...</span>';
            button.disabled = true;
            
            try {
                // ENVIAR PARA O CLOUDFLARE WORKER (QUE ENVIA PARA DISCORD)
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (result.success) {
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
                } else {
                    throw new Error('Erro no envio');
                }
                
            } catch (error) {
                console.error('Erro:', error);
                
                // Restore button
                button.innerHTML = originalText;
                button.disabled = false;
                
                // Show error notification
                showNotification('Erro ao enviar. Tente novamente ou use o WhatsApp.', 'error');
                
                // Offer WhatsApp alternative
                setTimeout(() => {
                    if (confirm('Deseja enviar via WhatsApp?')) {
                        const whatsappMessage = encodeURIComponent(
                            `Olá! Gostaria de solicitar um orçamento.\n\n` +
                            `Nome: ${formData.name}\n` +
                            `Empresa: ${formData.company}\n` +
                            `Email: ${formData.email}\n` +
                            `Telefone: ${formData.phone}\n` +
                            `Serviço: ${formData.service}\n` +
                            `Mensagem: ${formData.message}`
                        );
                        window.open(`https://wa.me/351963487687?text=${whatsappMessage}`, '_blank');
                    }
                }, 1000);
            }
        } else {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        }
    });
}

// Notification function (mantém igual)
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

// FAQ Accordion (mantém igual)
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
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
    }
});

// Form field animations - RENOMEADO PARA EVITAR CONFLITO
const formInputElements = document.querySelectorAll('.form-input');
formInputElements.forEach(input => {
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

// Phone number formatting (mantém igual mas melhorado)
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Detectar se é Brasil ou Portugal
        if (value.startsWith('55')) {
            // Formato Brasil: +55 (11) 98765-4321
            if (value.length > 13) value = value.slice(0, 13);
            value = value.replace(/^(\d{2})(\d{2})(\d{5})(\d{4}).*/, '+$1 ($2) $3-$4');
        } else if (value.startsWith('351')) {
            // Formato Portugal: +351 912 345 678
            if (value.length > 12) value = value.slice(0, 12);
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{3}).*/, '+$1 $2 $3 $4');
        } else {
            // Formato genérico
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
        }
        
        e.target.value = value;
    });
}

// Quick contact button animations (mantém igual)
const quickBtns = document.querySelectorAll('.quick-btn');
quickBtns.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        }
    });
    
    btn.addEventListener('mouseleave', function() {
        const icon = this.querySelector('i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0)';
        }
    });
});

// Contact cards hover effect (mantém igual)
const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.contact-icon');
        if (icon) {
            icon.style.transform = 'rotate(-5deg) scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.contact-icon');
        if (icon) {
            icon.style.transform = 'rotate(0) scale(1)';
        }
    });
});

// Add map interaction placeholder (mantém igual)
const mapPlaceholder = document.querySelector('.map-placeholder');
if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', () => {
        showNotification('Integração com Google Maps disponível na versão final.', 'info');
    });
}