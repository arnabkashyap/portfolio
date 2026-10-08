document.addEventListener('DOMContentLoaded', () => {

    // ── Custom Cursor ────────────────────────────────────────
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    let cursorInitialized = false;

    if (cursor && follower && !window.matchMedia('(pointer: coarse)').matches) {
        document.addEventListener('mousemove', (e) => {
            if (!cursorInitialized) {
                cursor.style.opacity = '1';
                follower.style.opacity = '1';
                cursorInitialized = true;
            }
            cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            follower.style.transform = `translate3d(${e.clientX - 17}px, ${e.clientY - 17}px, 0)`;
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform += ' scale(0.8)';
            follower.style.transform += ' scale(1.3)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
            follower.style.transform = follower.style.transform.replace(' scale(1.3)', '');
        });

        const hoverElements = document.querySelectorAll('a, button, .project-card, .team-project-card, .achievement-card, .skill-category-card, .photo-card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('cursor-hover'));
        });
    }

    // ── Sticky Navbar & Scroll Indicator Effect ───────────────
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');

    const updateNavbarScroll = () => {
        if (navbar) {
            if (window.scrollY > 25) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (scrollIndicator) {
            if (window.scrollY > 40) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.pointerEvents = 'none';
            } else {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.pointerEvents = 'auto';
            }
        }
    };
    window.addEventListener('scroll', updateNavbarScroll, { passive: true });
    updateNavbarScroll();

    // ── Responsive Mobile Menu Drawer ────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMenu() {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (!menuToggle || !mobileNav) return;
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav && mobileNav.classList.contains('open') ? closeMenu() : openMenu();
        });
    }

    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', closeMenu);
    }

    if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
            closeMenu();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ── Scroll Reveal Animation ──────────────────────────────
    const animateFade = () => {
        const elements = document.querySelectorAll('.animate-up');
        elements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 50) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', animateFade, { passive: true });
    animateFade();

    // ── Active Section Highlighting ──────────────────────────
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links .mobile-link');

    const updateActiveNav = () => {
        const scrollPosition = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;

        let current = '';

        // Prioritize bottom-most contact section when user reaches end of page
        if (scrollPosition + windowHeight >= docHeight - 80) {
            current = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const navHeight = navbar ? navbar.offsetHeight : 70;
                if (scrollPosition >= sectionTop - navHeight - 60) {
                    current = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobileNavLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ── Email Copy to Clipboard ──────────────────────────────
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = 'arnabkumarkashyap2006@gmail.com';
            let copied = false;
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                    copied = true;
                }
            } catch (e) {
                // Clipboard API failed or restricted, proceed to fallback
            }

            if (!copied) {
                try {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = email;
                    tempInput.setAttribute('readonly', '');
                    tempInput.style.position = 'fixed';
                    tempInput.style.opacity = '0';
                    document.body.appendChild(tempInput);
                    tempInput.focus();
                    tempInput.select();
                    copied = document.execCommand('copy');
                    document.body.removeChild(tempInput);
                } catch (err) {
                    console.error('Fallback copy failed:', err);
                }
            }

            if (copied) {
                copyEmailBtn.classList.add('copied');
                copyEmailBtn.innerHTML = '<i class="fas fa-check"></i> <span class="copy-btn-text">Copied!</span>';

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    copyEmailBtn.innerHTML = '<i class="fas fa-copy"></i> <span class="copy-btn-text">Copy</span>';
                }, 2000);
            }
        });
    }

    // ── Smooth Scroll for Anchor Links with Header Offset ────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                closeMenu();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Typewriter Effect ────────────────────────────────────
    const typedText = document.getElementById('typedText');
    const roles = [
        'Software Developer',
        'Hackathon Builder',
        'Problem Solver',
        'AI Enthusiast'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    const type = () => {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typedText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 110;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end before deleting
            typeSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    };

    if (typedText) {
        // Small delay so page loads first
        setTimeout(type, 900);
    }

    // ── Scroll to Top Button ─────────────────────────────────
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
