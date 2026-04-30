/* =====================================================
   GRACIA VITA – Électricien | script.js
   Animations · Header · Formulaire · Floating button
   ===================================================== */

(function () {
    'use strict';

    /* --------------------------------------------------
       1. HEADER – effet au scroll
    -------------------------------------------------- */
    const header = document.getElementById('header');

    window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });


    /* --------------------------------------------------
       2. FADE-IN AU SCROLL (Intersection Observer)
    -------------------------------------------------- */
    const fadeEls = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    fadeEls.forEach(function (el) {
        fadeObserver.observe(el);
    });


    /* --------------------------------------------------
       3. STAGGER (délai progressif) sur les grilles
    -------------------------------------------------- */
    var grids = [
        '.services-grid .service-card',
        '.clients-grid .client-card',
        '.trust-grid .trust-item'
    ];

    grids.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (card, i) {
            card.style.transitionDelay = (i * 0.07) + 's';
        });
    });


    /* --------------------------------------------------
       4. SCROLL FLUIDE – liens ancre
    -------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var id     = anchor.getAttribute('href');
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var offset = 78; // hauteur header
            var top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    });


    /* --------------------------------------------------
       5. BOUTON FLOTTANT – apparaît après le hero
    -------------------------------------------------- */
    var floatPhone = document.getElementById('floatPhone');
    var heroSection = document.getElementById('hero');

    if (floatPhone && heroSection) {
        var heroObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                floatPhone.classList.toggle('show', !entry.isIntersecting);
            });
        }, { threshold: 0.25 });

        heroObserver.observe(heroSection);
    }


    /* --------------------------------------------------
       6. FORMULAIRE DE CONTACT
         (simulation envoi — à connecter à un backend
          ou service type Formspree / EmailJS)
    -------------------------------------------------- */
    var form       = document.getElementById('contactForm');
    var submitBtn  = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');

    if (form && submitBtn && formSuccess) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            /* Validation simple */
            var name    = form.querySelector('#name').value.trim();
            var phone   = form.querySelector('#phone').value.trim();
            var message = form.querySelector('#message').value.trim();

            if (!name || !phone || !message) {
                shakeForm();
                return;
            }

            /* État de chargement */
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours…';

            /* ---- Pour connecter à Formspree :
               Remplacer le setTimeout ci-dessous par :

               fetch('https://formspree.io/f/VOTRE_ID', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                   body: JSON.stringify({ name, phone, message })
               }).then(function(r) {
                   if (r.ok) showSuccess();
                   else resetBtn('Erreur, réessayez');
               }).catch(function() { resetBtn('Erreur réseau'); });
            ---- */

            setTimeout(function () {
                showSuccess();
            }, 1200);
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
        submitBtn.disabled   = false;
        submitBtn.innerHTML  = '<i class="fas fa-paper-plane"></i> ' + label;
    }

    function shakeForm() {
        form.style.animation = 'none';
        form.offsetHeight; /* reflow */
        form.style.animation = 'shake 0.4s ease';
    }

    /* Keyframe shake injectée dynamiquement */
    if (!document.getElementById('shakeStyle')) {
        var style  = document.createElement('style');
        style.id   = 'shakeStyle';
        style.textContent = '@keyframes shake {' +
            '0%,100%{transform:translateX(0)}' +
            '25%{transform:translateX(-6px)}' +
            '75%{transform:translateX(6px)}' +
        '}';
        document.head.appendChild(style);
    }


    /* --------------------------------------------------
       7. HIGHLIGHT DU LIEN NAV ACTIF (scroll spy)
    -------------------------------------------------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length && navLinks.length) {
        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (link) {
                        var isActive = link.getAttribute('href') === '#' + entry.target.id;
                        link.style.color = isActive ? 'var(--clr-white)' : '';
                    });
                }
            });
        }, {
            threshold: 0.4
        });

        sections.forEach(function (s) { spyObserver.observe(s); });
    }

})();
