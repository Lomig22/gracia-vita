/* =====================================================
   GRACIA VITA – Électricien | script.js
   ===================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------
       1. HEADER – effet au scroll
    -------------------------------------------------- */
    var header = document.getElementById('header');

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });


    /* --------------------------------------------------
       2. MENU HAMBURGER MOBILE
    -------------------------------------------------- */
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');
    var mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    function openMenu() {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('open');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            if (mobileMenu.classList.contains('open')) closeMenu();
            else openMenu();
        });

        mobileLinks.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }


    /* --------------------------------------------------
       3. FADE-IN AU SCROLL (Intersection Observer)
    -------------------------------------------------- */
    var fadeEls = document.querySelectorAll('.fade-in');

    var fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
    });

    fadeEls.forEach(function (el) { fadeObserver.observe(el); });


    /* --------------------------------------------------
       4. STAGGER SUR LES GRILLES
    -------------------------------------------------- */
    [
        '.services-grid .service-card',
        '.clients-grid .client-card',
        '.trust-grid .trust-item',
        '.stats-grid .stat-item'
    ].forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (card, i) {
            card.style.transitionDelay = (i * 0.08) + 's';
        });
    });


    /* --------------------------------------------------
       5. COMPTEURS ANIMÉS (count-up)
    -------------------------------------------------- */
    var counters = document.querySelectorAll('.stat-number[data-target]');

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(el) {
        var target   = parseInt(el.getAttribute('data-target'), 10);
        var duration = 1600;
        var start    = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var elapsed  = timestamp - start;
            var progress = Math.min(elapsed / duration, 1);
            el.textContent = Math.floor(easeOut(progress) * target);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }

        requestAnimationFrame(step);
    }

    if (counters.length) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObserver.observe(c); });
    }


    /* --------------------------------------------------
       6. SCROLL FLUIDE – liens ancre
    -------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id     = anchor.getAttribute('href');
            if (id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var offset = 78;
            var top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });


    /* --------------------------------------------------
       7. BOUTON FLOTTANT – apparaît après le hero
    -------------------------------------------------- */
    var floatPhone  = document.getElementById('floatPhone');
    var heroSection = document.getElementById('hero');

    if (floatPhone && heroSection) {
        var heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                floatPhone.classList.toggle('show', !entry.isIntersecting);
            });
        }, { threshold: 0.2 });

        heroObserver.observe(heroSection);
    }


    /* --------------------------------------------------
       8. FORMULAIRE DE CONTACT
         (simulation — à connecter à Formspree / EmailJS)
    -------------------------------------------------- */
    var form        = document.getElementById('contactForm');
    var submitBtn   = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');

    if (form && submitBtn && formSuccess) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name    = form.querySelector('#name').value.trim();
            var phone   = form.querySelector('#phone').value.trim();
            var message = form.querySelector('#message').value.trim();

            if (!name || !phone || !message) {
                shakeForm();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';

            /* ---- Connecter à Formspree :
               fetch('https://formspree.io/f/VOTRE_ID', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                   body: JSON.stringify({ name: name, phone: phone, message: message })
               })
               .then(function(r) { if (r.ok) showSuccess(); else resetBtn('Erreur, réessayez'); })
               .catch(function() { resetBtn('Erreur réseau'); });
            ---- */

            setTimeout(showSuccess, 1200);
        });
    }

    function showSuccess() {
        form.reset();
        submitBtn.style.display = 'none';
        formSuccess.classList.add('visible');
        setTimeout(function () {
            formSuccess.classList.remove('visible');
            submitBtn.style.display  = '';
            submitBtn.disabled       = false;
            submitBtn.innerHTML      = '<i class="fas fa-paper-plane"></i> Envoyer ma demande';
        }, 6000);
    }

    function resetBtn(label) {
        submitBtn.disabled  = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ' + label;
    }

    function shakeForm() {
        form.style.animation = 'none';
        void form.offsetHeight;
        form.style.animation = 'shake 0.4s ease';
    }

    if (!document.getElementById('shakeStyle')) {
        var style  = document.createElement('style');
        style.id   = 'shakeStyle';
        style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}';
        document.head.appendChild(style);
    }


    /* --------------------------------------------------
       9. SCROLL SPY – lien nav actif
    -------------------------------------------------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length && navLinks.length) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        var active = link.getAttribute('href') === '#' + entry.target.id;
                        link.style.color = active ? 'var(--clr-white)' : '';
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(function (s) { spyObserver.observe(s); });
    }

})();
