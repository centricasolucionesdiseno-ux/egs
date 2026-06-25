/* ===================================================
   EGS SOLUCIONES INTEGRALES - SCRIPT GLOBAL
=================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
     1. HEADER: scroll / hamburguesa
  -------------------------------------------------- */
  const header      = document.getElementById('header');
  const menuToggle  = document.querySelector('.menu-toggle');
  const navMenu     = document.querySelector('.nav-menu');

  // Scroll → cambiar fondo del header
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // ejecutar al cargar

  // Hamburguesa
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  }

  // Cerrar menú al hacer clic en un enlace (móvil)
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle && menuToggle.classList.remove('open');
    });
  });

  /* --------------------------------------------------
     2. MARCAR ENLACE ACTIVO
  -------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --------------------------------------------------
     3. ANIMACIONES ON-SCROLL (Reveal)
  -------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  /* --------------------------------------------------
     4. CONTADORES ANIMADOS (sección stats)
  -------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    let current    = 0;
    const inc      = target / steps;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('es-CO') + suffix;
    }, step);
  }

  /* --------------------------------------------------
     5. FORMULARIO DE CONTACTO (validación + feedback)
  -------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Limpiar errores previos
      contactForm.querySelectorAll('.field-error').forEach(el => el.remove());
      contactForm.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');

      // Validar campos requeridos
      ['nombre', 'email', 'mensaje'].forEach(id => {
        const field = contactForm.querySelector(`#${id}`);
        if (!field) return;
        if (!field.value.trim()) {
          showFieldError(field, 'Este campo es obligatorio.');
          valid = false;
        }
      });

      // Validar email
      const emailField = contactForm.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          showFieldError(emailField, 'Ingresa un correo electrónico válido.');
          valid = false;
        }
      }

      if (valid) {
        showFormSuccess(contactForm);
      }
    });
  }

  function showFieldError(field, msg) {
    field.style.borderColor = '#e53e3e';
    const errSpan = document.createElement('span');
    errSpan.className = 'field-error';
    errSpan.style.cssText = 'color:#e53e3e;font-size:0.8rem;margin-top:4px;display:block;';
    errSpan.textContent = msg;
    field.parentNode.appendChild(errSpan);
  }

  function showFormSuccess(form) {
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
      <div style="text-align:center;padding:32px 20px;">
        <i class="fas fa-check-circle" style="font-size:3rem;color:#00A8CC;margin-bottom:16px;"></i>
        <h3 style="color:#0D2B5E;margin-bottom:8px;">¡Mensaje enviado!</h3>
        <p style="color:#3D4B60;">Nos pondremos en contacto contigo a la brevedad.</p>
      </div>`;
    form.replaceWith(successMsg);
  }

  /* --------------------------------------------------
     6. ACORDEÓN / TABS (servicios, FAQ)
  -------------------------------------------------- */
  document.querySelectorAll('[data-accordion]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = document.getElementById(trigger.dataset.accordion);
      if (!target) return;
      const isOpen = target.style.maxHeight && target.style.maxHeight !== '0px';
      // Cerrar todos del mismo grupo
      const group = trigger.closest('[data-accordion-group]');
      if (group) {
        group.querySelectorAll('.accordion-content').forEach(c => {
          c.style.maxHeight = '0px';
          c.style.paddingBottom = '0';
        });
        group.querySelectorAll('.accordion-icon').forEach(i => i.style.transform = '');
      }
      if (!isOpen) {
        target.style.maxHeight = target.scrollHeight + 'px';
        target.style.paddingBottom = '20px';
        const icon = trigger.querySelector('.accordion-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  /* --------------------------------------------------
     7. GALERÍA LIGHTBOX (proyectos)
  -------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    // Crear lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `
      display:none;position:fixed;inset:0;z-index:9999;
      background:rgba(13,43,94,0.92);
      align-items:center;justify-content:center;flex-direction:column;
    `;
    lb.innerHTML = `
      <button id="lb-close" style="position:absolute;top:20px;right:24px;background:none;border:none;color:#fff;font-size:2rem;cursor:pointer;">&times;</button>
      <img id="lb-img" src="" alt="" style="max-width:88vw;max-height:80vh;border-radius:8px;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
      <p id="lb-caption" style="color:rgba(255,255,255,0.75);margin-top:14px;font-family:Inter,sans-serif;font-size:0.9rem;"></p>
    `;
    document.body.appendChild(lb);

    galleryItems.forEach(item => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => {
        const imgSrc  = item.querySelector('img')?.src || item.dataset.src;
        const caption = item.dataset.caption || '';
        document.getElementById('lb-img').src = imgSrc;
        document.getElementById('lb-caption').textContent = caption;
        lb.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

    function closeLightbox() {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

});
