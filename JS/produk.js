// Smooth scrolling untuk navigation
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
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(12, 13, 49, 0.95)';
        header.style.backdropFilter = 'blur(15px)';
    } else {
        header.style.background = 'rgba(12, 13, 49, 0.9)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Auto-hide header on scroll (IMPROVED & CONFLICT-FREE)
let lastScrollTop = 0;
const header = document.getElementById('header');
const delta = 5;
const navbarHeight = header.offsetHeight;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

    if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
        // Scroll DOWN
        header.classList.add('hidden');
        if (document.body.classList.contains('menu-open')) {
            document.body.classList.remove('menu-open');
        }
    } else {
        // Scroll UP
        if (scrollTop + window.innerHeight < document.documentElement.scrollHeight) {
            header.classList.remove('hidden');
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });

// Parallax effect untuk floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// CTA button pulse effect
setInterval(() => {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.style.transform = 'translateY(-3px) scale(1.05)';
        setTimeout(() => {
            ctaButton.style.transform = 'translateY(-3px) scale(1)';
        }, 200);
    }
}, 4000);

// Modal functionality
const productData = {
    premium: {
        title: "Premium Classic",
        price: "Rp 45.000",
        description: "Keychain klasik dengan desain timeless yang cocok untuk semua kalangan. Dibuat dengan material logam berkualitas tinggi dan finishing chrome yang memberikan kesan mewah namun tetap elegan.",
        images: [
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
        ]
    },
    luxury: {
        title: "Luxury Crystal",
        price: "Rp 89.000",
        description: "Keychain mewah dengan hiasan kristal Swarovski asli yang berkilau memukau. Setiap kristal dipilih dengan cermat dan dipasang dengan teknik presisi tinggi untuk menghasilkan pancaran cahaya yang spektakuler.",
        images: [
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
        ]
    },
    custom: {
        title: "Custom Design",
        price: "Rp 125.000",
        description: "Keychain mewah dengan hiasan kristal Swarovski asli yang berkilau memukau. Setiap kristal dipilih dengan cermat dan dipasang dengan teknik presisi tinggi untuk menghasilkan pancaran cahaya yang spektakuler.",
        images: [
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
        ]
    },
    adamantium: {
        title: "Wolverine Claw",
        price: "Rp 200.000",
        description: "Keychain mewah dengan hiasan kristal Swarovski asli yang berkilau memukau. Setiap kristal dipilih dengan cermat dan dipasang dengan teknik presisi tinggi untuk menghasilkan pancaran cahaya yang spektakuler.",
        images: [
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
            "IMG/logo2.png",
            "IMG/SeconLogo.png",
        ]
    },
};

// Variabel global untuk track slider state per modal
let currentSlide = {};

// Fungsi untuk render slider di modal
function renderSlider(productType, container) {
    const product = productData[productType];
    const images = product.images;
    currentSlide[productType] = 0; // Reset slide index

    if (images.length === 0) return; // Fallback jika no images

    let sliderHTML = `
        <div class="product-slider">
            <div class="slider-container">
                <div class="slider-wrapper">
                    ${images.map((imgSrc, index) => `
                        <div class="slide ${index === 0 ? 'active' : ''}">
                            <img src="${imgSrc}" alt="${product.title} - Slide ${index + 1}" loading="lazy">
                        </div>
                    `).join('')}
                </div>
                <button class="slider-arrow prev" onclick="changeSlide('${productType}', -1)">◀</button>
                <button class="slider-arrow next" onclick="changeSlide('${productType}', 1)">▶</button>
            </div>
            ${images.length > 1 ? `
                <div class="slider-dots">
                    ${images.map((_, index) => `
                        <span class="dot ${index === 0 ? 'active' : ''}" onclick="currentSlide['${productType}'] = ${index}; updateSlider('${productType}');"></span>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    container.insertAdjacentHTML('beforeend', sliderHTML);
}

// Fungsi navigasi slide
window.changeSlide = function(productType, direction) {
    const product = productData[productType];
    const totalSlides = product.images.length;
    if (totalSlides <= 1) return;       

    currentSlide[productType] += direction;
    if (currentSlide[productType] >= totalSlides) currentSlide[productType] = 0;
    if (currentSlide[productType] < 0) currentSlide[productType] = totalSlides - 1;

    updateSlider(productType);
};

// Fungsi update tampilan slider
function updateSlider(productType) {
    const slides = document.querySelectorAll(`#productModal .slide`);
    const dots = document.querySelectorAll(`#productModal .dot`);
    const product = productData[productType];
    const currentIndex = currentSlide[productType];

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentIndex);
    });

    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

// Update fungsi openModal (ganti yang lama dengan ini)
function openModal(productType) {
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const product = productData[productType];

    // Clear content sebelum render baru
    modalContent.innerHTML = `
        <span class="close-modal" onclick="closeModal()">&times;</span>
        <h2>${product.title}</h2>
        <div id="sliderContainer"></div> <!-- Container untuk slider -->
        <div class="modal-price">${product.price}</div>
        <p>${product.description}</p>
        <div style="margin-top: 30px;">
            <a href="https://wa.me/628999223168?text=Halo,%20saya%20mau%20pesan%20keychained%20${product.title}" 
            target="_blank" 
            class="contact-button" 
            style="display: inline-block; margin: 0 10px;">
            Pesan Sekarang
            </a>
            <a href="https://www.instagram.com/_chained.together" 
            target="_blank" 
            class="contact-button" 
            style="display: inline-block; margin: 10px 10px; background: linear-gradient(45deg, #833ab4, #fd1d1d);">
            Lihat di Instagram
            </a>
        </div>
    `;

    // Render slider setelah HTML dimuat
    const sliderContainer = document.getElementById('sliderContainer');
    renderSlider(productType, sliderContainer);

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close modal ketika klik di luar area modal
window.addEventListener('click', function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal dengan tombol ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// ============================================
// FIXED: Animasi card saat scroll
// Gunakan CLASS invece inline style untuk menghindari konflik
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Gunakan class bukan inline style
            entry.target.classList.add('card-visible');
        }
    });
}, observerOptions);

// Apply animation observer to cards
document.querySelectorAll('.product-card, .detail-card, .contact-card').forEach(card => {
    // Tambahkan class untuk animasi awal
    card.classList.add('card-hidden');
    observer.observe(card);
});

// Loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Hamburger menu functionality (sekarang sama dengan script.js)
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks'); // Gunakan id="navLinks"
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