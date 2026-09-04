document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    if (hamburger && mobileMenu) {
        const toggleMenu = () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Sticky Navigation ---
    const navbar = document.getElementById('navbar');
    
    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // --- Active Navigation Spy ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const checkActiveSection = () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
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

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
            // Check immediately if element is already within viewport
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                el.classList.add('visible');
            }
        });
    } else {
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            const revealPoint = 60;

            revealElements.forEach(el => {
                const revealTop = el.getBoundingClientRect().top;
                if (revealTop < windowHeight - revealPoint) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll, { passive: true });
        window.addEventListener('resize', revealOnScroll, { passive: true });
        revealOnScroll();
    }

    // Safety fallback: ensure elements reveal on scroll even if IntersectionObserver is delayed
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            if (!el.classList.contains('visible')) {
                const rect = el.getBoundingClientRect();
                if (rect.top < windowHeight + 50) {
                    el.classList.add('visible');
                }
            }
        });
    }, { passive: true });

    // --- Interactive FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (questionBtn && answer) {
            questionBtn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close any other open FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                    }
                });

                // Toggle current FAQ item
                if (isOpen) {
                    item.classList.remove('active');
                    questionBtn.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
                }
            });
        }
    });

    // --- Hero Scroll Animation (Optimized Image Sequence) ---
    const canvas = document.getElementById('hero-canvas');
    const heroContent = document.querySelector('.hero-content');
    const heroSection = document.querySelector('.hero');

    if (canvas) {
        const context = canvas.getContext('2d');
        const frameCount = 300;
        const currentFrame = index => `jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;
        
        const images = new Array(frameCount);

        // Preload the first 25 frames immediately for instant rendering
        const preloadInitialFrames = 25;
        for (let i = 0; i < preloadInitialFrames; i++) {
            const img = new Image();
            img.src = currentFrame(i + 1);
            images[i] = img;
        }

        const renderFirstFrame = () => {
            if (images[0] && images[0].naturalWidth) {
                canvas.width = images[0].naturalWidth;
                canvas.height = images[0].naturalHeight;
                context.drawImage(images[0], 0, 0);
            }
        };

        if (images[0]) {
            if (images[0].complete && images[0].naturalHeight !== 0) {
                renderFirstFrame();
            } else {
                images[0].onload = renderFirstFrame;
            }
        }

        // Lazily load remaining frames in idle time
        const loadRemainingFrames = () => {
            for (let i = preloadInitialFrames; i < frameCount; i++) {
                const img = new Image();
                img.src = currentFrame(i + 1);
                images[i] = img;
            }
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadRemainingFrames);
        } else {
            setTimeout(loadRemainingFrames, 1200);
        }

        // Scroll listener for hero parallax & frame scrubbing
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrollableHeight = document.body.scrollHeight - window.innerHeight;
            
            // Text parallax logic for hero content if present
            if (heroContent && heroSection) {
                const heroHeight = heroSection.offsetHeight;
                if (scrollY <= heroHeight) {
                    const heroScrollProgress = scrollY / heroHeight;
                    const opacity = 1 - (heroScrollProgress * 1.4);
                    const textTranslateY = heroScrollProgress * -40;
                    
                    heroContent.style.opacity = Math.max(0, opacity);
                    heroContent.style.transform = `translateY(${textTranslateY}px)`;
                }
            }

            // Global scroll progress for animation
            if (scrollableHeight > 0) {
                const scrollProgress = Math.min(1, Math.max(0, scrollY / scrollableHeight));
                
                const frameIndex = Math.min(
                    frameCount - 1,
                    Math.floor(scrollProgress * frameCount)
                );
                
                requestAnimationFrame(() => {
                    const targetImg = images[frameIndex];
                    if (targetImg && targetImg.complete && targetImg.naturalHeight !== 0) {
                        context.drawImage(targetImg, 0, 0);
                    }
                });
            }
        }, { passive: true });
    }

    // --- Contact Form Submission Handler ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-enquiry-btn');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
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

            // WhatsApp link for instant follow-up
            let waText = `Hi Suntanu! I just submitted an enquiry for music lessons from your website.\n\n`;
            waText += `*Name:* ${name}\n`;
            waText += `*Phone:* ${phone}\n`;
            if (email) waText += `*Email:* ${email}\n`;
            waText += `*Instrument:* ${instrument}\n`;
            waText += `*Level:* ${level}\n`;
            waText += `*Format:* ${format}\n`;
            if (message) waText += `*Message:* ${message}\n`;
            const waUrl = `https://wa.me/919836402923?text=${encodeURIComponent(waText)}`;

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'SENDING ENQUIRY...';
            }

            formStatus.className = 'form-status';
            formStatus.style.display = 'block';
            formStatus.innerHTML = 'Sending your enquiry to Suntanu Das...';

            const payload = {
                name: name,
                phone: phone,
                email: email || 'Not provided',
                instrument: instrument,
                level: level,
                format: format,
                message: message || 'No specific message provided',
                _subject: `New Music Lesson Enquiry: ${name} (${instrument})`,
                _template: 'table',
                _captcha: 'false'
            };

            try {
                const response = await fetch('https://formsubmit.co/ajax/das.shantanu99@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok || data.success === 'true' || data.success === true) {
                    formStatus.className = 'form-status success';
                    formStatus.innerHTML = `✓ <strong>Thank you, ${name}!</strong> Your enquiry has been sent to Suntanu Das.<br><br><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: #25D366; text-decoration: underline; font-weight: 600;">Want a quick reply? Chat directly on WhatsApp &rarr;</a>`;
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Submission error');
                }
            } catch (err) {
                console.error('Submission error:', err);
                formStatus.className = 'form-status error';
                formStatus.innerHTML = `Could not send automatically at this moment.<br><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: underline; font-weight: 600;">Click here to send your enquiry directly via WhatsApp &rarr;</a>`;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'SEND ENQUIRY';
                }
            }
        });
    }
});
