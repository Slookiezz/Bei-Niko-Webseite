function openLegal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLegal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.legal-overlay.active').forEach(function(el) {
        closeLegal(el.id);
      });
    }
  });
  document.querySelectorAll('.legal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) closeLegal(this.id);
    });
  });

  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 80);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Book / Speisekarte navigation
  (function() {
    const spreads = Array.from(document.querySelectorAll('.book-spread'));
    const prevBtn = document.getElementById('bookPrev');
    const nextBtn = document.getElementById('bookNext');
    if (!spreads.length || !prevBtn || !nextBtn) return;

    let current = 0;
    let animating = false;

    function goTo(newIndex, direction) {
      if (animating || newIndex === current) return;
      animating = true;

      const outClass = direction === 'forward' ? 'flip-out-forward' : 'flip-out-backward';
      const inClass  = direction === 'forward' ? 'flip-in-forward'  : 'flip-in-backward';

      const outEl = spreads[current];
      const inEl  = spreads[newIndex];

      outEl.classList.remove('active');
      outEl.classList.add(outClass);
      inEl.classList.add(inClass);

      setTimeout(function() {
        outEl.classList.remove(outClass);
        inEl.classList.remove(inClass);
        inEl.classList.add('active');
        current = newIndex;
        animating = false;
        updateButtons();
      }, 450);
    }

    function updateButtons() {
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === spreads.length - 1;
    }

    prevBtn.addEventListener('click', function() {
      if (current > 0) goTo(current - 1, 'backward');
    });
    nextBtn.addEventListener('click', function() {
      if (current < spreads.length - 1) goTo(current + 1, 'forward');
    });

    updateButtons();
  })();