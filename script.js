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

  // Speisekarte aus menu.json laden
  fetch('menu.json')
    .then(function(r) { return r.json(); })
    .then(function(categories) {
      var container = document.getElementById('menuSections');
      if (!container) return;

      var activeIdx = 0;
      var animating = false;
      var tocOpen = false;

      // Kategorie-HTML erzeugen
      function buildCategoryHTML(cat) {
        var itemsHtml = cat.items.map(function(item) {
          var allergenHtml = (item.allergens && item.allergens.length)
            ? '<sup class="menu-allergen">' + item.allergens.join(' ') + '</sup>'
            : '';
          var descHtml = (item.description && item.description !== 'N/A')
            ? '<p class="book-item-desc">' + item.description + '</p>'
            : '';
          return '<div class="book-menu-item">'
            + '<div class="book-item-row">'
            + '<span class="book-item-name">' + item.title + allergenHtml + '</span>'
            + '<span class="book-item-price">' + item.price + '</span>'
            + '</div>'
            + descHtml
            + '</div>';
        }).join('');
        return '<div class="page-ornament">&#10022;</div>'
          + '<h3 class="page-category">' + cat.category + '</h3>'
          + '<div class="page-divider"></div>'
          + '<div class="menu-items-grid">' + itemsHtml + '</div>';
      }

      // Inhaltsverzeichnis aufbauen
      var toc = document.createElement('div');
      toc.className = 'menu-toc';

      var tocToggle = document.createElement('button');
      tocToggle.className = 'menu-toc-toggle';
      tocToggle.innerHTML = '<span class="menu-toc-toggle-label">'
        + categories[0].category + '</span>'
        + '<span class="menu-toc-arrow">&#9663;</span>';

      var tocList = document.createElement('div');
      tocList.className = 'menu-toc-list';

      categories.forEach(function(cat, index) {
        var btn = document.createElement('button');
        btn.className = 'menu-toc-btn' + (index === 0 ? ' active' : '');
        btn.textContent = cat.category;
        btn.dataset.index = index;
        tocList.appendChild(btn);
      });

      toc.appendChild(tocToggle);
      toc.appendChild(tocList);

      // Anzeige-Bereich (wirkt wie Buchseite)
      var display = document.createElement('div');
      display.className = 'menu-display';
      display.innerHTML = buildCategoryHTML(categories[0]);

      container.appendChild(toc);
      container.appendChild(display);

      // TOC auf-/zuklappen
      tocToggle.addEventListener('click', function() {
        tocOpen = !tocOpen;
        tocList.classList.toggle('open', tocOpen);
        tocToggle.classList.toggle('open', tocOpen);
      });

      // Kategorie wechseln mit Umblätter-Animation
      function selectCategory(newIdx) {
        if (newIdx === activeIdx || animating) return;
        animating = true;

        var direction = newIdx > activeIdx ? 'forward' : 'backward';
        var outClass = 'flip-out-' + direction;
        var inClass  = 'flip-in-'  + direction;

        display.classList.add(outClass);

        setTimeout(function() {
          display.classList.remove(outClass);
          activeIdx = newIdx;
          display.innerHTML = buildCategoryHTML(categories[activeIdx]);
          display.classList.add(inClass);

          // TOC-Buttons aktualisieren
          tocList.querySelectorAll('.menu-toc-btn').forEach(function(b) {
            b.classList.toggle('active', parseInt(b.dataset.index) === activeIdx);
          });
          tocToggle.querySelector('.menu-toc-toggle-label').textContent =
            categories[activeIdx].category;

          // TOC zuklappen
          tocOpen = false;
          tocList.classList.remove('open');
          tocToggle.classList.remove('open');

          setTimeout(function() {
            display.classList.remove(inClass);
            animating = false;
          }, 400);
        }, 320);
      }

      tocList.addEventListener('click', function(e) {
        var btn = e.target.closest('.menu-toc-btn');
        if (!btn) return;
        selectCategory(parseInt(btn.dataset.index));
      });

      container.classList.add('menu-loaded');
    })
    .catch(function(err) {
      console.error('Speisekarte konnte nicht geladen werden:', err);
    });

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