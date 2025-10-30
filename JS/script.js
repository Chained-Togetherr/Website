// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const header = document.getElementById('header');
            const currentScroll = window.pageYOffset;
            const targetOffset = target.getBoundingClientRect().top + currentScroll;

            if (targetOffset > currentScroll) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(12, 13, 49, 0.95)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(12, 13, 49, 0.9)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Auto-hide header on scroll
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && !document.body.classList.contains('menu-open')) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

    // Subtle haptic feedback on scroll
    if (navigator.vibrate && Math.abs(scrollTop - lastScrollTop) > 50) {
        navigator.vibrate(20);
    }
});

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Product card hover effects
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// CTA button pulse effect
setInterval(() => {
    const ctaButton = document.getElementById('ctaButton');
    if (ctaButton) {
        ctaButton.style.transform = 'scale(1.05)';
        setTimeout(() => {
            ctaButton.style.transform = 'scale(1)';
        }, 100);
    }
}, 5000);

let currentSlide = 0;
let slideInterval;
let currentProduct = '';

// Open product modal
function openProductModal(productType) {
    currentProduct = productType;
    const modal = document.getElementById('productModal');
    const slidesContainer = document.querySelector('.slides');
    const dotsContainer = document.querySelector('.slider-dots');
    
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    const images = productImages[productType];
    images.forEach((imgSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${imgSrc}" alt="Product Image ${index + 1}">`;
        slidesContainer.appendChild(slide);
        
        const dot = document.createElement('span');
        dot.className = 'dot';
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    currentSlide = 0;
    updateSlide();
    startAutoSlide();
}

// Close modal
function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    stopAutoSlide();
}

// Update slide position
function updateSlide() {
    const slidesContainer = document.querySelector('.slides');
    const dots = document.querySelectorAll('.dot');
    
    if (slidesContainer) {
        slidesContainer.style.transform = `translateX(-${currentSlide * 20}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
}

// Next slide
function nextSlide() {
    const images = productImages[currentProduct];
    currentSlide = (currentSlide + 1) % images.length;
    updateSlide();
}

// Previous slide
function prevSlide() {
    const images = productImages[currentProduct];
    currentSlide = (currentSlide - 1 + images.length) % images.length;
    updateSlide();
}

// Go to specific slide
function goToSlide(index) {
    currentSlide = index;
    updateSlide();
    stopAutoSlide();
    startAutoSlide();
}

// Start auto slide
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 3000);
}

// Stop auto slide
function stopAutoSlide() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Touch/swipe handling for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.image-slider')) {
        touchStartX = e.changedTouches[0].screenX;
    }
});

document.addEventListener('touchend', function(e) {
    if (e.target.closest('.image-slider')) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
        stopAutoSlide();
        startAutoSlide();
    }
}

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        const isOpen = document.body.classList.contains('menu-open');
        
        if (!isOpen) {
            document.body.classList.add('menu-open');
            hamburger.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                hamburger.style.transform = 'scale(1)';
            }, 100);
            
            header.style.background = 'rgba(12, 13, 49, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.classList.remove('hidden');
            
        } else {
            hamburger.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                document.body.classList.remove('menu-open');
                hamburger.style.transform = 'scale(1)';
                
                window.dispatchEvent(new Event('scroll'));
            }, 150);
        }
    });
    
    // Close menu when clicking nav links
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            const menuItems = navLinks.querySelectorAll('li');
            
            setTimeout(() => {
                document.body.classList.remove('menu-open');
                
                menuItems.forEach(item => {
                    item.style.transform = '';
                    item.style.opacity = '';
                });
            }, 300);
        }
    });
    
    // Close menu when clicking outside
    let touchStartTarget = null;
    
    document.addEventListener('touchstart', function(e) {
        touchStartTarget = e.target;
    });
    
    document.addEventListener('touchend', function(e) {
        if (touchStartTarget === e.target && 
            !header.contains(e.target) && 
            document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && 
            document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const wasOpen = document.body.classList.contains('menu-open');
        
        if (window.innerWidth > 768) {
            document.body.classList.remove('menu-open');
            navLinks.style.transform = '';
            navLinks.style.opacity = '';
            navLinks.style.visibility = '';
            
            hamburger.style.transform = 'scale(1)';
        } else if (wasOpen) {
            setTimeout(() => {
                document.body.classList.add('menu-open');
            }, 50);
        }
    });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            if (document.body.classList.contains('menu-open')) {
                document.body.classList.remove('menu-open');
                setTimeout(() => {
                    document.body.classList.add('menu-open');
                }, 100);
            }
        }, 100);
    });
    
    // Prevent body scroll when menu is open
    const originalBodyStyle = window.getComputedStyle(document.body).overflow;
    
    const menuObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('menu-open')) {
                    document.body.style.overflow = 'hidden';
                    header.classList.remove('hidden');
                } else {
                    document.body.style.overflow = originalBodyStyle;
                }
            }
        });
    });
    
    menuObserver.observe(document.body, { attributes: true });
});

// Modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside or on close button
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
            closeModal();
        }
    });

    // Keyboard navigation for modal
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('productModal');
        if (modal.classList.contains('show')) {
            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    prevSlide();
                    stopAutoSlide();
                    startAutoSlide();
                    break;
                case 'ArrowRight':
                    nextSlide();
                    stopAutoSlide();
                    startAutoSlide();
                    break;
            }
        }
    });
    
    // Slider button controls
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('prev-btn')) {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        }
        if (e.target.classList.contains('next-btn')) {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        }
    });
    
    // Pause auto slide on hover
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.image-slider')) {
            stopAutoSlide();
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.image-slider')) {
            startAutoSlide();
        }
    });
});