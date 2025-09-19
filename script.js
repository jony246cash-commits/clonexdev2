// Menu Mobile Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#000';
        header.style.backdropFilter = 'none';
    }
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = new FormData(this);
        const nome = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const telefone = this.querySelector('input[type="tel"]').value;
        const servico = this.querySelector('select').value;
        const mensagem = this.querySelector('textarea').value;
        
        // Criar mensagem para WhatsApp
        const whatsappMessage = `Olá! Gostaria de solicitar um orçamento:\n\n` +
            `Nome: ${nome}\n` +
            `E-mail: ${email}\n` +
            `Telefone: ${telefone}\n` +
            `Serviço: ${servico}\n` +
            `Descrição: ${mensagem}`;
        
        // Redirecionar para WhatsApp
        const whatsappUrl = `https://wa.me/5569992565019?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        // Mostrar mensagem de sucesso
        showSuccessMessage();
        
        // Limpar formulário
        this.reset();
    });
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Redirecionando para WhatsApp...
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remover mensagem após 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Animação de entrada para elementos quando entram na viewport
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.service-card, .gallery-item, .about-text, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Contador animado para estatísticas (se houver)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Lazy loading para imagens
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Adicionar classe active ao link do menu baseado na seção atual
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Gallery Modal System
class GalleryModal {
    constructor() {
        this.modal = document.getElementById('galleryModal');
        this.modalContent = this.modal?.querySelector('.modal-content');
        this.mediaContainer = this.modal?.querySelector('.modal-media-container');
        this.modalInfo = this.modal?.querySelector('.modal-info');
        this.closeBtn = this.modal?.querySelector('.modal-close');
        this.prevBtn = this.modal?.querySelector('.modal-prev');
        this.nextBtn = this.modal?.querySelector('.modal-next');
        this.counter = this.modal?.querySelector('.modal-counter');
        
        this.galleryItems = [];
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchEndX = 0;
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Collect all gallery items
        this.collectGalleryItems();
        
        // Event listeners
        this.closeBtn?.addEventListener('click', () => this.close());
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });
        
        // Touch events for mobile swipe
        this.modalContent?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        this.modalContent?.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Click outside to close
        this.modal?.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }
    
    collectGalleryItems() {
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach((btn, index) => {
            const galleryItem = btn.closest('.gallery-item');
            const img = galleryItem?.querySelector('img');
            const video = galleryItem?.querySelector('video');
            const title = galleryItem?.querySelector('h4')?.textContent || `Item ${index + 1}`;
            const description = galleryItem?.querySelector('p')?.textContent || '';
            
            if (img || video) {
                this.galleryItems.push({
                    type: video ? 'video' : 'image',
                    src: video ? video.src : img.src,
                    alt: img?.alt || title,
                    title: title,
                    description: description
                });
                
                btn.addEventListener('click', () => {
                    this.open(index);
                });
            }
        });
    }
    
    open(index) {
        this.currentIndex = index;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.updateContent();
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
        this.updateContent();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.galleryItems.length;
        this.updateContent();
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next(); // Swipe left - next image
            } else {
                this.prev(); // Swipe right - previous image
            }
        }
    }
    
    updateContent() {
        const item = this.galleryItems[this.currentIndex];
        if (!item) return;
        
        // Clear previous content
        this.mediaContainer.innerHTML = '';
        
        // Create media element
        let mediaElement;
        if (item.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.src = item.src;
            mediaElement.controls = true;
            mediaElement.autoplay = false;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.src = item.src;
            mediaElement.alt = item.alt;
        }
        
        this.mediaContainer.appendChild(mediaElement);
        
        // Update info
        const titleElement = this.modalInfo?.querySelector('h3');
        const descElement = this.modalInfo?.querySelector('p');
        
        if (titleElement) titleElement.textContent = item.title;
        if (descElement) descElement.textContent = item.description;
        if (this.counter) {
            this.counter.textContent = `${this.currentIndex + 1} / ${this.galleryItems.length}`;
        }
        
        // Update navigation buttons visibility
        if (this.galleryItems.length <= 1) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        }
    }
}

// Initialize gallery modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryModal();
});

// Botão de voltar ao topo
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
`;

document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

// Adicionar hover effect nos botões
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Validação de formulário em tempo real
const inputs = document.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remover classes de erro anteriores
    field.classList.remove('error');
    const errorMsg = field.parentNode.querySelector('.error-message');
    if (errorMsg) {
        errorMsg.remove();
    }
    
    // Validações específicas
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showFieldError(field, 'Este campo é obrigatório');
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        showFieldError(field, 'Digite um e-mail válido');
    } else if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        showFieldError(field, 'Digite um telefone válido');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem;';
    field.parentNode.appendChild(errorDiv);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\(]?[0-9]{2}[\)]?\s?[0-9]{4,5}[-\s]?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Adicionar CSS para campos com erro
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .nav-menu a.active {
        color: #2563eb !important;
    }
`;
document.head.appendChild(style);
