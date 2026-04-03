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

// Google Maps Consent
var MAPS_IFRAME = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.399439768524!2d9.910495100000002!3d52.3631768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47b00906debb214d%3A0x2f6444c96cf40568!2sBei%20Niko!5e0!3m2!1sde!2sde!4v1774947200820!5m2!1sde!2sde" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe><button class="btn-maps-revoke" onclick="revokeGoogleMaps()" title="Einwilligung widerrufen">&#x21BA; Widerrufen</button>';
var MAPS_OVERLAY = '<div class="maps-consent-overlay" id="mapsOverlay"><p>Für die Anzeige der Karte wird Google Maps geladen. Dabei werden Daten an Google übertragen.</p><div class="maps-consent-buttons"><button onclick="loadGoogleMaps()" class="btn-maps-consent">Karte laden</button><button onclick="denyGoogleMaps()" class="btn-maps-deny">Ablehnen</button></div><a href="https://policies.google.com/privacy" target="_blank" rel="noopener" class="maps-privacy-link">Datenschutz von Google</a></div>';
var MAPS_DENIED = '<div class="maps-consent-overlay" id="mapsOverlay"><p style="color:rgba(245,240,232,0.45);font-size:0.85rem;">Karte wurde abgelehnt. <button onclick="resetGoogleMaps()" class="btn-maps-reset">Erneut entscheiden</button></p></div>';

function loadGoogleMaps() {
  localStorage.setItem('maps_consent', 'accepted');
  document.getElementById('mapsWrapper').innerHTML = MAPS_IFRAME;
}

function denyGoogleMaps() {
  localStorage.setItem('maps_consent', 'denied');
  document.getElementById('mapsWrapper').innerHTML = MAPS_DENIED;
}

function revokeGoogleMaps() {
  localStorage.removeItem('maps_consent');
  document.getElementById('mapsWrapper').innerHTML = MAPS_OVERLAY;
}

function resetGoogleMaps() {
  localStorage.removeItem('maps_consent');
  document.getElementById('mapsWrapper').innerHTML = MAPS_OVERLAY;
}

(function() {
  var consent = localStorage.getItem('maps_consent');
  if (consent === 'accepted') {
    document.getElementById('mapsWrapper').innerHTML = MAPS_IFRAME;
  } else if (consent === 'denied') {
    document.getElementById('mapsWrapper').innerHTML = MAPS_DENIED;
  }
})();