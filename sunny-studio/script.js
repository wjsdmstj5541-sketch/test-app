/* ============================================
   SUNNY STUDIO - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== AOS Initialization ==========
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1200,
            easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
            once: true,
            offset: 100
        });
    }

    // ========== Preloader (Logo Fade + Scale) ==========
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        const logo = preloader.querySelector('.preloader-logo');
        const hero = document.getElementById('hero');

        // Logo is already fading in via CSS animation (0.2s delay + 0.8s duration = visible at 1s)
        // After 1.2s total, start zoom-out and fade (overlapping for smooth transition)
        setTimeout(() => {
            logo.classList.add('zoom-out');

            // Start fade-out early so it overlaps with the zoom-out
            setTimeout(() => {
                preloader.classList.add('fade-out');
                if (hero) hero.classList.add('reveal');

                // Remove preloader from DOM after fade completes
                setTimeout(() => preloader.remove(), 1000);
            }, 200);
        }, 1200);
    });

    // ========== Hero Logic ==========
    // Hero elements are now handled by CSS and AOS.

    // ========== Navbar Scroll ==========
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function handleNavScroll() {
        const scrollY = window.scrollY;

        // Toggle scrolled class
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Mobile CTA bar - show after scrolling past hero
        const mobileCTA = document.getElementById('mobileCTA');
        if (mobileCTA) {
            if (scrollY > 400) {
                mobileCTA.classList.add('visible');
            } else {
                mobileCTA.classList.remove('visible');
            }
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // ========== Mobile Nav Toggle ==========
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    // Create overlay element
    const navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function toggleMobileNav() {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('open');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('open') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileNav);
    navOverlay.addEventListener('click', toggleMobileNav);

    // Close nav on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('open')) {
                toggleMobileNav();
            }
        });
    });

    // ========== Back to Top ==========
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });



    // ========== Intersection Observer for Animations ==========
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));



                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Intersection Observer is now handled by AOS for most elements
    // document.querySelectorAll('.portfolio-item, .branch-card').forEach(el => {
    //     observer.observe(el);
    // });








    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    }

    // ========== Smooth Scroll for Anchor Links ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Input Focus Label Animation ==========
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });

    // ========== Lightbox Functionality ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = ''; // Clear src after transition
        }, 400);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // escape key logic from earlier script...

    // ========== Full Price List Toggle ==========
    const viewPriceBtn = document.getElementById('viewPriceBtn');
    const closePriceBtn = document.getElementById('closePriceBtn');
    const fullPriceList = document.getElementById('fullPriceList');

    if (viewPriceBtn && fullPriceList) {
        viewPriceBtn.addEventListener('click', () => {
            fullPriceList.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeFullList = () => {
            fullPriceList.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closePriceBtn) closePriceBtn.addEventListener('click', closeFullList);

        // Close on clicking outside content could be added if needed
        // but close button is clear.
    }

    // ========== Set minimum date to today ==========
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // ========== Pricing Carousel (Swipe + Touch) ==========
    document.querySelectorAll('.pricing-carousel').forEach(carousel => {
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dots = carousel.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        let startX = 0;
        let isDragging = false;

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            dots[currentIndex].classList.remove('active');
            currentIndex = (index + slides.length) % slides.length;
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Dot click
        dots.forEach((dot, i) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                goToSlide(i);
            });
        });

        // Touch events
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }, { passive: true });

        // Mouse drag events
        carousel.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            e.preventDefault();
        });

        carousel.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.clientX;

            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        carousel.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
            }
        });
    });

});
