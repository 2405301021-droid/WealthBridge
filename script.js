/* ===== WEALTHBRIDGE — Main JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Header Scroll Effect ----- */
  const header = document.getElementById('header');
  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ----- Mobile Menu ----- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close nav on link click
  nav.querySelectorAll('.header__link, .header__cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ----- Intersection Observer — Reveal on Scroll ----- */
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const idx = siblings.indexOf(entry.target);
        const delay = idx >= 0 ? idx * 120 : 0;
        setTimeout(() => {
          entry.target.classList.add('active');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ----- Animated Counters ----- */
  const counters = document.querySelectorAll('[data-count]');
  let countersAnimated = new Set();

  const animateCounter = (el) => {
    if (countersAnimated.has(el)) return;
    countersAnimated.add(el);

    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (isDecimal) {
        el.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = prefix + target.toFixed(1) + suffix;
        } else {
          el.textContent = prefix + Math.floor(target).toLocaleString() + suffix;
        }
      }
    };
    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ----- Testimonials Carousel ----- */
  const track = document.getElementById('carouselTrack');
  const dots = document.querySelectorAll('.testimonials__dot');
  let currentSlide = 0;
  const totalSlides = dots.length;
  let autoPlayInterval;

  const goToSlide = (index) => {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetAutoPlay();
    });
  });

  const autoPlay = () => {
    autoPlayInterval = setInterval(() => {
      goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlay();
  };

  autoPlay();

  /* ----- Smooth Scroll for Anchor Links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Parallax subtle effect on hero grid ----- */
  const heroGrid = document.querySelector('.hero__grid');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroGrid.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    }, { passive: true });
  }

});
