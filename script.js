document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Sticky Navigation ---
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on initial load

    // --- Active Navigation State ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const checkActiveSection = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', checkActiveSection, { passive: true });

    // --- Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger distance from bottom

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Trigger on load

    // --- Hero Scroll Animation (Image Sequence) ---
    const canvas = document.getElementById('hero-canvas');
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');

    if (canvas && heroContent && heroSection) {
        const context = canvas.getContext('2d');
        const frameCount = 300;
        const currentFrame = index => `jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        
        const images = [];
        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }
        
        const renderFirstFrame = () => {
            if (images[0].naturalWidth) {
                canvas.width = images[0].naturalWidth;
                canvas.height = images[0].naturalHeight;
                context.drawImage(images[0], 0, 0);
            }
        };

        if (images[0].complete && images[0].naturalHeight !== 0) {
            renderFirstFrame();
        } else {
            images[0].onload = renderFirstFrame;
        }

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollableHeight = document.body.scrollHeight - window.innerHeight;
            
            // Text parallax logic for hero content
            const heroHeight = heroSection.offsetHeight;
            if (scrollY <= heroHeight) {
                const heroScrollProgress = scrollY / heroHeight;
                const opacity = 1 - (heroScrollProgress * 1.5);
                const textTranslateY = heroScrollProgress * -50;
                
                heroContent.style.opacity = Math.max(0, opacity);
                heroContent.style.transform = `translateY(${textTranslateY}px)`;
            }

            // Global scroll progress for animation
            if (scrollableHeight > 0) {
                const scrollProgress = Math.min(1, Math.max(0, scrollY / scrollableHeight));
                
                // Image Sequence logic
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(scrollProgress * frameCount)
                );
                
                requestAnimationFrame(() => {
                    if (images[frameIndex].complete && images[frameIndex].naturalHeight !== 0) {
                        context.drawImage(images[frameIndex], 0, 0);
                    }
                });
            }
        }, { passive: true });
    }

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const instrument = document.getElementById('instrument')?.value || 'Guitar';
            const level = document.getElementById('level')?.value || 'Beginner';
            const format = document.getElementById('format')?.value || 'Online';
            const message = document.getElementById('message')?.value.trim() || '';

            if (!name || !phone) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill in both your Name and Phone / WhatsApp number.';
                formStatus.style.display = 'block';
                return;
            }

            // Create formatted WhatsApp message
            let waText = `Hi Suntanu! I would like to enquire about music lessons.\n\n`;
            waText += `*Name:* ${name}\n`;
            waText += `*Phone:* ${phone}\n`;
            if (email) waText += `*Email:* ${email}\n`;
            waText += `*Instrument:* ${instrument}\n`;
            waText += `*Level:* ${level}\n`;
            waText += `*Format:* ${format}\n`;
            if (message) waText += `*Goals / Message:* ${message}\n`;

            const waUrl = `https://wa.me/919836402923?text=${encodeURIComponent(waText)}`;

            formStatus.className = 'form-status success';
            formStatus.innerHTML = `✓ Thank you, <strong>${name}</strong>! Redirecting you to WhatsApp to send your enquiry...`;
            formStatus.style.display = 'block';

            setTimeout(() => {
                window.open(waUrl, '_blank', 'noopener,noreferrer');
            }, 800);
        });
    }
});
