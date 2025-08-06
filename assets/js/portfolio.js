// ===================================
// PONTOHUB - JavaScript Portfolio
// Funcionalidades específicas para a página de portfolio
// ===================================

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Testimonial Slider
const testimonialDots = document.querySelectorAll('.nav-dot');
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;
let autoSlideInterval;

function showTestimonial(index) {
    // Remove active from all cards and dots
    testimonialCards.forEach(card => {
        card.classList.remove('active', 'animate-in', 'visible');
    });
    
    testimonialDots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Activate the correct card and dot
    testimonialCards[index].classList.add('active');
    setTimeout(() => {
        testimonialCards[index].classList.add('animate-in', 'visible');
    }, 50);
    testimonialDots[index].classList.add('active');
    
    currentTestimonial = index;
}

// Initialize with first testimonial
showTestimonial(0);

// Event listeners for dots
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(autoSlideInterval);
        showTestimonial(index);
        startAutoSlide();
    });
});

// Auto-slide function
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Start auto-slide
startAutoSlide();

// Pause auto-slide on hover
const testimonialSlider = document.querySelector('.testimonial-slider');
testimonialSlider.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

testimonialSlider.addEventListener('mouseleave', () => {
    startAutoSlide();
});

// Portfolio Item Click Effect
portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
});

// Animate portfolio items on scroll
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Initial state for portfolio items
portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    portfolioObserver.observe(item);
});

// Add hover effect to portfolio items
portfolioItems.forEach(item => {
    const hoverContent = item.querySelector('.portfolio-hover');
    
    item.addEventListener('mouseenter', function() {
        // Add slight rotation to tech tags
        const techTags = this.querySelectorAll('.tech-tag');
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'scale(1.1)';
            }, index * 50);
        });
    });
    
    item.addEventListener('mouseleave', function() {
        const techTags = this.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.style.transform = 'scale(1)';
        });
    });
});