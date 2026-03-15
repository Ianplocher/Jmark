/* ============================================
   JMARK ENTERPRISES — JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Animated number counters ---
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    // Observe stat numbers
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // --- Service card reveal on scroll ---
    const serviceCards = document.querySelectorAll('.service-card');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    serviceCards.forEach(card => cardObserver.observe(card));

    // --- Notify form ---
    const form = document.getElementById('notify-form');
    const successMsg = document.getElementById('form-success');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            if (email) {
                form.querySelector('.form-group').style.display = 'none';
                form.querySelector('.form-note').style.display = 'none';
                successMsg.classList.add('show');
            }
        });
    }

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Duplicate marquee content for seamless loop ---
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
        const clone = marqueeContent.cloneNode(true);
        marqueeContent.parentElement.appendChild(clone);
    }

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxCaption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    const galleryData = [];
    galleryItems.forEach((item, i) => {
        const img = item.querySelector('img');
        const label = item.querySelector('.gallery-label');
        galleryData.push({
            src: img.src,
            alt: img.alt,
            caption: label ? label.textContent : ''
        });

        item.addEventListener('click', () => {
            currentIndex = i;
            openLightbox(i);
        });
    });

    function openLightbox(index) {
        if (!lightbox) return;
        lightboxImg.src = galleryData[index].src;
        lightboxImg.alt = galleryData[index].alt;
        lightboxCaption.textContent = galleryData[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        currentIndex = (currentIndex + direction + galleryData.length) % galleryData.length;
        lightboxImg.src = galleryData[currentIndex].src;
        lightboxImg.alt = galleryData[currentIndex].alt;
        lightboxCaption.textContent = galleryData[currentIndex].caption;
    }

    if (lightbox) {
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
            if (e.key === 'ArrowRight') navigateLightbox(1);
        });
    }
});
