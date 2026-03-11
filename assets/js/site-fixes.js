(function () {
  let styleInjected = false;
  let injectTimer = null;
  let hadClutchReviewContent = false;

    function ensureWebflowIxClassFallback() {
    const root = document.documentElement;
    if (!root || !root.classList) return;
    if (!root.classList.contains('w-mod-js')) return;

    // If Webflow ix runtime fails to set this class, desktop pre-hide styles can leave pages blank.
    const applyFallback = function () {
      if (!root.classList.contains('w-mod-ix')) {
        root.classList.add('w-mod-ix');
      }
    };

    setTimeout(applyFallback, 600);
    window.addEventListener('load', applyFallback, { once: true });
  }
  function scheduleInject(delay) {
    if (injectTimer) clearTimeout(injectTimer);
    injectTimer = setTimeout(function () {
      injectTimer = null;
      injectSections();
    }, typeof delay === 'number' ? delay : 0);
  }

  function clearTabsHash() {
    if (window.location.hash && window.location.hash.indexOf('#w-tabs-') === 0) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  function removeLenisPreventAttributes() {
    const blocked = document.querySelectorAll('[data-lenis-prevent]');
    blocked.forEach(function (el) {
      if (el.classList && el.classList.contains('w-editor-bem-EditorApp_Main')) return;
      el.removeAttribute('data-lenis-prevent');
    });
  }

  function installLenisUnblockFix() {
    removeLenisPreventAttributes();
    setTimeout(removeLenisPreventAttributes, 50);
    setTimeout(removeLenisPreventAttributes, 300);
    setTimeout(removeLenisPreventAttributes, 1200);
  }

  function installTabsScrollFixes() {
    document.addEventListener('click', function (e) {
      const tabLink = e.target && e.target.closest ? e.target.closest('a.w-tab-link') : null;
      if (!tabLink) return;
      setTimeout(function () {
        clearTabsHash();
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }, 0);
    }, true);

    document.addEventListener('touchend', function (e) {
      const tabLink = e.target && e.target.closest ? e.target.closest('a.w-tab-link') : null;
      if (!tabLink) return;
      setTimeout(function () {
        clearTabsHash();
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }, 0);
    }, { passive: true, capture: true });

    window.addEventListener('hashchange', function () {
      clearTabsHash();
    });

    document.addEventListener('keydown', function (e) {
      const focused = document.activeElement;
      if (!focused || !focused.closest) return;
      if (!focused.closest('.w-tab-menu')) return;
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'PageDown' && e.key !== 'PageUp') return;
      focused.blur();
      clearTabsHash();
    }, true);
  }

  function ensureStyle() {
    if (styleInjected || document.getElementById('site-fixes-services-style')) return;
    const style = document.createElement('style');
    style.id = 'site-fixes-services-style';
    style.textContent = [
      'html,body{max-width:100%;overflow-x:hidden;}',
      'img{max-width:100%;height:auto;}',
      '.elite-custom-reviews{max-width:1200px;margin:56px auto;padding:0 20px;}',
      '.elite-custom-reviews__title{margin:0 0 20px;font-size:clamp(26px,3vw,42px);line-height:1.15;color:#fff;font-weight:700;}',
      '.elite-custom-reviews__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;}',
      '.elite-custom-reviews__card{background:#121217;border:1px solid #24243a;border-radius:16px;padding:20px;color:#e8e8f0;}',
      '.elite-custom-reviews__quote{margin:0 0 14px;font-size:16px;line-height:1.6;color:#f4f4fa;}',
      '.elite-custom-reviews__author{margin:0;font-size:14px;line-height:1.4;color:#9ea4bc;font-weight:600;}',
      '.elite-pricing-breakdown{width:100%;border:1px solid #2a2f44;border-radius:18px;background:rgba(14,18,30,.72);overflow:hidden;}',
      '.elite-pricing-breakdown table{width:100%;border-collapse:collapse;}',
      '.elite-pricing-breakdown th,.elite-pricing-breakdown td{padding:16px 18px;border-bottom:1px solid #2a2f44;color:#f2f5ff;font-size:20px;line-height:1.3;}',
      '.elite-pricing-breakdown th{font-weight:700;text-align:left;}',
      '.elite-pricing-breakdown td{text-align:center;font-size:18px;}',
      '.elite-pricing-breakdown td:first-child{text-align:left;font-size:18px;color:#dce3ff;}',
      '.elite-pricing-breakdown tr:last-child td{border-bottom:0;}',
      '.elite-pricing-breakdown .yes{color:#b7ff2e;font-weight:800;}',
      '.elite-pricing-breakdown .no{color:#7f8cab;font-weight:800;}',
      '@media (max-width:991px){.elite-pricing-breakdown{border-radius:14px;}.elite-pricing-breakdown th,.elite-pricing-breakdown td{font-size:14px;padding:12px 10px;}.elite-pricing-breakdown td:first-child{font-size:14px;}}',
      '.elite-results-grid{display:grid;grid-template-columns:1.25fr .95fr .95fr;gap:18px;width:100%;align-items:stretch;}',
      '.elite-results-card{position:relative;overflow:hidden;border-radius:26px;padding:28px;min-height:270px;background:linear-gradient(160deg,#070e23,#0d1636 45%,#111a3f);border:1px solid rgba(121,151,255,.35);box-shadow:0 18px 50px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.06);}',
      '.elite-results-card::before{content:\"\";position:absolute;inset:-20% auto auto -20%;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(118,145,255,.35),rgba(118,145,255,0) 70%);}',
      '.elite-results-card::after{content:\"\";position:absolute;right:-70px;bottom:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(63,220,188,.28),rgba(63,220,188,0) 68%);}',
      '.elite-results-card.is-growth{background:linear-gradient(160deg,#130a2a,#221245 48%,#3f1c62);border-color:rgba(198,132,255,.42);}',
      '.elite-results-card.is-growth::after{background:radial-gradient(circle,rgba(214,126,255,.38),rgba(214,126,255,0) 68%);}',
      '.elite-results-card.is-risk{background:linear-gradient(160deg,#071a2f,#0b2947 52%,#0b385f);border-color:rgba(125,201,255,.45);}',
      '.elite-results-card.is-risk::after{background:radial-gradient(circle,rgba(98,193,255,.34),rgba(98,193,255,0) 68%);}',
      '.elite-results-kicker{position:relative;z-index:2;display:inline-flex;align-items:center;padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.08);backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,.25);color:#dbe6ff;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;}',
      '.elite-results-value{position:relative;z-index:2;margin:16px 0 10px;font-size:clamp(64px,8vw,124px);line-height:.9;font-weight:900;color:#f7fbff;letter-spacing:-.045em;text-shadow:0 4px 24px rgba(0,0,0,.35);}',
      '.elite-results-label{position:relative;z-index:2;margin:0 0 8px;color:#fff;font-size:clamp(30px,2.4vw,44px);font-weight:760;line-height:1.05;}',
      '.elite-results-desc{position:relative;z-index:2;margin:0;max-width:30ch;color:#c2cff0;font-size:clamp(19px,1.4vw,24px);line-height:1.35;}',
      '.elite-results-trend{position:absolute;z-index:2;top:20px;right:20px;font-size:12px;padding:7px 12px;border-radius:999px;background:rgba(29,227,166,.16);color:#86ffd7;border:1px solid rgba(29,227,166,.46);font-weight:750;}',
      '.elite-results-card.is-growth .elite-results-trend{background:rgba(224,137,255,.18);color:#f2b8ff;border-color:rgba(224,137,255,.45);}',
      '.elite-results-card.is-risk .elite-results-trend{background:rgba(97,182,255,.18);color:#aee0ff;border-color:rgba(97,182,255,.45);}',
      '.elite-results-mini{position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px;}',
      '.elite-results-mini div{font-size:12px;color:#d9e1ff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.16);border-radius:10px;padding:8px 10px;}',
      '@media (max-width:1279px){.elite-results-grid{grid-template-columns:1fr;}.elite-results-card{min-height:0;padding:22px;border-radius:20px;}.elite-results-value{font-size:clamp(52px,15vw,88px);}.elite-results-label{font-size:clamp(28px,7vw,38px);}.elite-results-desc{font-size:clamp(17px,4.2vw,22px);}.elite-results-mini{grid-template-columns:1fr;}}',
      '@media (max-width:991px){.elite-custom-reviews{margin:40px auto;}.elite-custom-reviews__grid{grid-template-columns:1fr;}}',
      '@media (min-width:992px){',
      '.navbar_dropmenu-desktop,.navbar_dropmenu-desktop-section-wrapper.is-services,.navbar_dropmenu.is-deskotp.w-dropdown-list{overflow:visible !important;}',
      '.navbar_dropmenu.is-deskotp{left:0 !important;right:0 !important;transform:none !important;}',
      '.navbar_dropmenu.is-deskotp .container.is-desktop-dropmenu{width:min(1600px,calc(100vw - 64px)) !important;max-width:min(1600px,calc(100vw - 64px)) !important;margin-left:auto !important;margin-right:auto !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services{width:100% !important;max-width:none !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{display:grid !important;grid-template-columns:repeat(4,minmax(220px,1fr)) !important;column-gap:28px !important;row-gap:16px !important;min-width:0 !important;width:100% !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-section{width:auto !important;max-width:none !important;min-width:0 !important;flex:0 0 auto !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-link{width:100% !important;max-width:none !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropwmenu-link-text{min-width:0 !important;overflow-wrap:break-word;word-break:normal;}',
      '}',
      '@media (min-width:992px) and (max-width:1439px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(3,minmax(220px,1fr)) !important;}}',
      '@media (max-width:1279px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(2,minmax(220px,1fr)) !important;}}',
      '.section_services-awards,.services-page-awards_cards,.services-page_awards-wrapper,.services-page_show-more,.home-ready-to-scale__logos,.works-match_awards,.works-match_awards-card{display:none !important;}',
      '.elite-service-page .hero_title-tag{border:1px solid rgba(130,164,255,.45);background:rgba(16,28,66,.42);backdrop-filter:blur(4px);}',
      '.elite-service-page .services-hero_heading-wrapper .is-italic{color:#8ec5ff;}',
      '.elite-service-page-cyber .services-hero_heading-wrapper .is-italic{color:#73ffe0;}',
      '.elite-service-page-civil .services-hero_heading-wrapper .is-italic{color:#9fcbff;}',
      '.elite-service-page .services-benefits_card-list-item{font-weight:600;}',
      '.elite-service-page .faq_item-question{font-weight:700;}'
    ].join('');
    document.head.appendChild(style);
    styleInjected = true;
  }

  const cyberLinks = [
    { href: '/services/penetration-testing', title: 'Penetration Testing', desc: 'Identify and fix vulnerabilities' },
    { href: '/services/network-security', title: 'Network Security', desc: 'Protect your infrastructure' },
    { href: '/services/cybersecurity-consulting', title: 'Cybersecurity Consulting', desc: 'Expert security strategy' },
    { href: '/services/cloud-security', title: 'Cloud Security', desc: 'Secure your cloud environment' },
    { href: '/services/security-audits', title: 'Security Audits', desc: 'Comprehensive risk assessment' }
  ];

  const civilLinks = [
    { href: '/services/structural-design', title: 'Structural Design', desc: 'Safe, efficient structures' },
    { href: '/services/construction-management', title: 'Construction Management', desc: 'On-time project delivery' },
    { href: '/services/infrastructure-planning', title: 'Infrastructure Planning', desc: 'Smart infrastructure solutions' },
    { href: '/services/cad-bim-services', title: 'CAD and BIM Services', desc: 'Precision digital modelling' },
    { href: '/services/environmental-engineering', title: 'Environmental Engineering', desc: 'Sustainable engineering' }
  ];

  const designLinks = [
    { href: '/services/ui-ux-design', title: 'UI/UX Design', desc: 'Web & mobile app design' },
    { href: '/services/web-design', title: 'Web Design', desc: 'Custom websites & landings' },
    { href: '/services/mobile-design', title: 'Mobile App Design', desc: 'Apps your users love' },
    { href: '/services/website-redesign', title: 'Website Redesign', desc: 'Modern look, higher impact' },
    { href: '/services/ux-audit', title: 'UX/UI Audit', desc: 'Insights that drive results' }
  ];

  const developmentLinks = [
    { href: '/services/web-development', title: 'Web Development', desc: 'Front-End & Back-End Development' },
    { href: '/services/mvp-development', title: 'MVP Development', desc: 'MVPs that attract funding' },
    { href: '/services/webflow', title: 'WebFlow Development', desc: 'No-code development with scale' },
    { href: '/services/landing-page-design', title: 'Landing Page', desc: 'High-converting website' },
    { href: '/services/mobile-development', title: 'Mobile Development', desc: 'Native and hybrid apps' }
  ];

  function createSection(label, links, blackTitle) {
    const section = document.createElement('div');
    section.className = 'navbar_dropmenu-section';

    const labelNode = document.createElement('div');
    labelNode.className = 'navbar_dropmenu-label';
    labelNode.textContent = label;
    section.appendChild(labelNode);

    links.forEach(function (item) {
      const link = document.createElement('a');
      link.href = item.href;
      link.className = 'navbar_dropmenu-link w-inline-block';

      const icon = document.createElement('img');
      icon.loading = 'eager';
      icon.alt = '';
      icon.className = 'navbar_dropmenu-icon';
      icon.src = label === 'Cybersecurity'
        ? 'https://cdn.prod.website-files.com/65647bbe0d57c8abad78e939/65e85f7fa2e6e18165a11187_i13.webp'
        : 'https://cdn.prod.website-files.com/65647bbe0d57c8abad78e939/65e85f7a5308a8058027a415_i2.webp';

      const textWrap = document.createElement('div');
      textWrap.className = 'navbar_dropwmenu-link-text';

      const title = document.createElement('div');
      title.className = blackTitle ? 'navbar_link-title is-black' : 'navbar_link-title';
      title.textContent = item.title;

      const desc = document.createElement('div');
      desc.className = 'navbar_dropmenu-link-text';
      desc.textContent = item.desc;

      textWrap.appendChild(title);
      textWrap.appendChild(desc);
      link.appendChild(icon);
      link.appendChild(textWrap);
      section.appendChild(link);
    });

    return section;
  }

  function hasSection(container, name) {
    const labels = container.querySelectorAll('.navbar_dropmenu-label');
    return Array.from(labels).some(function (n) {
      return n.textContent.trim().toLowerCase() === name.toLowerCase();
    });
  }

  function removeSection(container, name) {
    const labels = container.querySelectorAll('.navbar_dropmenu-label');
    labels.forEach(function (n) {
      if (n.textContent.trim().toLowerCase() === name.toLowerCase()) {
        const section = n.closest('.navbar_dropmenu-section');
        if (section) section.remove();
      }
    });
  }

  function injectSections() {
    ensureStyle();
    // Rebuild every desktop services dropdown container directly.
    const desktopContainers = document.querySelectorAll(
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col'
    );
    desktopContainers.forEach(function (desktopContainer) {
      desktopContainer.innerHTML = '';
      desktopContainer.appendChild(createSection('Design', designLinks, true));
      desktopContainer.appendChild(createSection('Development', developmentLinks, true));
      desktopContainer.appendChild(createSection('Cybersecurity', cyberLinks, true));
      desktopContainer.appendChild(createSection('Civil Engineering', civilLinks, true));
    });

    // Rebuild every mobile services list by detecting known old services content.
    const mobileLists = document.querySelectorAll('.navbar_dropmenu.w-dropdown-list:not(.is-deskotp)');
    mobileLists.forEach(function (mobileContainer) {
      // Never treat desktop mega-menu wrappers as mobile lists.
      if (mobileContainer.querySelector('.navbar_dropmenu-desktop')) return;

      const lower = (mobileContainer.textContent || '').toLowerCase();
      const looksLikeServicesMenu =
        lower.indexOf('pitch deck') !== -1 ||
        lower.indexOf('brand identity') !== -1 ||
        lower.indexOf('ui/ux design') !== -1 ||
        lower.indexOf('web development') !== -1;
      if (!looksLikeServicesMenu) return;

      mobileContainer.innerHTML = '';
      mobileContainer.appendChild(createSection('Design', designLinks, false));
      mobileContainer.appendChild(createSection('Development', developmentLinks, false));
      mobileContainer.appendChild(createSection('Cybersecurity', cyberLinks, false));
      mobileContainer.appendChild(createSection('Civil Engineering', civilLinks, false));
    });
  }

  function buildLocationCard(name, code, flagSrc, flagAlt, description) {
    const card = document.createElement('div');
    card.className = 'footer-location-card';

    const top = document.createElement('div');
    top.className = 'footer-location-card__top';

    const nameNode = document.createElement('p');
    nameNode.className = 'footer-location-card__name';
    nameNode.textContent = name;

    const info = document.createElement('div');
    info.className = 'footer-location-card__info';

    const codeNode = document.createElement('p');
    codeNode.className = 'paragraph-15';
    codeNode.textContent = code;

    const tag = document.createElement('div');
    tag.className = 'footer-location-card-tag';

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = flagSrc;
    img.alt = flagAlt;

    tag.appendChild(img);
    info.appendChild(codeNode);
    info.appendChild(tag);
    top.appendChild(nameNode);
    top.appendChild(info);

    const desc = document.createElement('p');
    desc.className = 'footer-location-card__description';
    desc.textContent = description;

    card.appendChild(top);
    card.appendChild(desc);
    return card;
  }

  function replaceFooterLocations() {
    const wrappers = document.querySelectorAll('.footer-locations-content');
    if (!wrappers.length) return;

    wrappers.forEach(function (wrapper) {
      wrapper.innerHTML = '';
      wrapper.appendChild(
        buildLocationCard(
          'Dar es Salaam',
          'TZ',
          'https://flagcdn.com/w40/tz.png',
          'Tanzania flag',
          'Posta, Kivukoni, Dar es Salaam, Tanzania'
        )
      );
      wrapper.appendChild(
        buildLocationCard(
          'Kibaha, Pwani',
          'TZ',
          'https://flagcdn.com/w40/tz.png',
          'Tanzania flag',
          'Mailimoja Area, Kibaha, Pwani, Tanzania'
        )
      );
    });
  }

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function removeSelectedAwardBadges() {
    const targets = [
      'reviews on clutch',
      'top 50 trending team on dribbble',
      'global 100 b2b ui/ux company',
      'professional partner by webflow',
      'top user experience team by goodfirms',
      'projects are featured on behance platform'
    ];

    const awardTexts = document.querySelectorAll('.services-page-awards_item-text');
    awardTexts.forEach(function (node) {
      const text = normalizeText(node.textContent);
      const shouldRemove = targets.some(function (t) {
        return text.indexOf(t) !== -1;
      });
      if (!shouldRemove) return;

      const cardWrap = node.closest('.services-page-awards_card-wrap');
      const card = node.closest('.services-page-awards_card');
      if (cardWrap) {
        cardWrap.remove();
        return;
      }
      if (card) {
        card.remove();
      }
    });
  }

  function removeFooterAwardsStrip() {
    const strips = document.querySelectorAll('.footer_awards');
    strips.forEach(function (strip) {
      strip.remove();
    });
  }

  function removeAwardsSections() {
    const sections = document.querySelectorAll('.section_services-awards');
    sections.forEach(function (section) {
      section.remove();
    });

    // Fallback for pages where the same awards block is embedded outside the main section class.
    const mains = document.querySelectorAll('.services-page-awards_main');
    mains.forEach(function (main) {
      const hostSection = main.closest('section');
      if (hostSection) {
        hostSection.remove();
      } else {
        main.remove();
      }
    });
  }

  function removeReadyToScaleLogos() {
    const rows = document.querySelectorAll('.home-ready-to-scale__logos');
    rows.forEach(function (row) {
      row.remove();
    });
  }

  function removeResidualAwardsRows() {
    const selectors = [
      '.section_services-awards',
      '.services-page-awards_cards',
      '.services-page_awards-wrapper',
      '.services-page_show-more',
      '.home-ready-to-scale__logos',
      '.works-match_awards',
      '.works-match_awards-card'
    ];

    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (node) {
        node.remove();
      });
    });
  }

  function removeClutchReviewSources() {
    // Remove external Clutch/Pinterest review links.
    const externalLinks = document.querySelectorAll('a[href*="clutch"], a[href*="pinterest.com/eliahhango"]');
    externalLinks.forEach(function (a) {
      const section = a.closest('section');
      if (section) {
        const text = normalizeText(section.textContent);
        if (text.indexOf('review') !== -1 || text.indexOf('clutch') !== -1) {
          hadClutchReviewContent = true;
          section.remove();
          return;
        }
      }
      hadClutchReviewContent = true;
      a.removeAttribute('href');
    });

    // Remove any section that is explicitly a Clutch-based reviews block.
    const sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
      const text = normalizeText(section.textContent);
      if (text.indexOf('clutch') === -1) return;
      if (text.indexOf('review') === -1 && text.indexOf('rated') === -1) return;
      hadClutchReviewContent = true;
      section.remove();
    });

    // Remove leftover clutch logos/icons.
    const clutchAssets = document.querySelectorAll('img[src*="clutch"], img[alt*="Clutch"], img[alt*="clutch"]');
    clutchAssets.forEach(function (img) {
      const wrap = img.closest('.works-page-review_platform-label, .services-page-awards_card, .services-page-awards_card-wrap');
      if (wrap) {
        hadClutchReviewContent = true;
        wrap.remove();
        return;
      }
      hadClutchReviewContent = true;
      img.remove();
    });
  }

  function injectCustomReviews() {
    if (!hadClutchReviewContent) return;
    if (document.querySelector('.elite-custom-reviews')) return;
    const main = document.querySelector('main') || document.querySelector('.page-wrapper') || document.body;
    if (!main) return;

    const section = document.createElement('section');
    section.className = 'elite-custom-reviews';
    section.innerHTML = [
      '<h2 class="elite-custom-reviews__title">Client Reviews</h2>',
      '<div class="elite-custom-reviews__grid">',
      '<article class="elite-custom-reviews__card"><p class="elite-custom-reviews__quote">"EliTechWiz redesigned our platform and improved user flow in less than six weeks. Our onboarding completion rate increased immediately."</p><p class="elite-custom-reviews__author">Amani K. - Product Lead, Dar es Salaam</p></article>',
      '<article class="elite-custom-reviews__card"><p class="elite-custom-reviews__quote">"Communication was clear, weekly delivery was consistent, and the final UI feels modern and fast across desktop and mobile."</p><p class="elite-custom-reviews__author">Neema P. - Operations Manager, Kibaha</p></article>',
      '<article class="elite-custom-reviews__card"><p class="elite-custom-reviews__quote">"From strategy to launch, the team handled design and development professionally. We now have a site that converts better."</p><p class="elite-custom-reviews__author">Joseph M. - Founder, Dar es Salaam</p></article>',
      '</div>'
    ].join('');

    const footer = document.querySelector('footer');
    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
      return;
    }
    main.appendChild(section);
  }

  function replacePartnerLogosAndTestimonials() {
    const logoMap = [
      { match: 'mojo-logo-alt', src: '/assets/images/testimonial-logo-nexora.svg', alt: 'NexoraCX logo' },
      { match: 'tixbase', src: '/assets/images/testimonial-logo-fluxbase.svg', alt: 'Fluxbase logo' },
      { match: 'myso-logo-white', src: '/assets/images/testimonial-logo-aster.svg', alt: 'Aster Finance logo' },
      { match: 'enzyme.svg', src: '/assets/images/testimonial-logo-zenbyte.svg', alt: 'Zenbyte logo' }
    ];

    document.querySelectorAll('img').forEach(function (img) {
      const src = (img.getAttribute('src') || '').toLowerCase();
      const found = logoMap.find(function (item) {
        return src.indexOf(item.match) !== -1;
      });
      if (found) {
        img.setAttribute('src', found.src);
        img.setAttribute('alt', found.alt);
      }
    });

    // Replace external review badges with local neutral badge.
    document.querySelectorAll('.home-testimonials_tab-rating img, img[src*="clutch"]').forEach(function (img) {
      img.setAttribute('src', '/assets/images/verified-review-badge.svg');
      img.setAttribute('alt', 'Verified client review');
    });

    const data = [
      {
        quote: '“They translated our product idea into a clean experience fast. The team was responsive and delivery stayed on schedule.”',
        name: 'Aisha Msuya',
        role: 'Product Manager, NexoraCX'
      },
      {
        quote: '“Clear milestones, practical feedback, and strong execution. We launched with confidence and saw better engagement in the first month.”',
        name: 'Daniel Mwita',
        role: 'CTO, Fluxbase'
      },
      {
        quote: '“Their UX decisions were backed by research and measurable goals. The final product feels faster and easier for our users.”',
        name: 'Faraja Nyerere',
        role: 'Founder, Aster Finance'
      },
      {
        quote: '“Great communication and real ownership from kickoff to handoff. The redesign improved clarity across every page we shipped.”',
        name: 'Irene Mhando',
        role: 'Operations Lead, Zenbyte'
      }
    ];

    const blocks = document.querySelectorAll('.works-reviews_cards');
    blocks.forEach(function (block) {
      const paneQuotes = block.querySelectorAll('.home-testimonials_tabs-content .home-testimonials_tab-content_text');
      paneQuotes.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.quote;
      });

      const paneNames = block.querySelectorAll('.home-testimonials_tabs-content .home-testimonials_tab-user_name');
      paneNames.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.name;
      });

      const paneRoles = block.querySelectorAll('.home-testimonials_tabs-content .home-testimonials_tab-user_position');
      paneRoles.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.role;
      });

      const slideQuotes = block.querySelectorAll('.home-testimonials-swiper .home-testimonials_tab-content_text');
      slideQuotes.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.quote;
      });

      const slideNames = block.querySelectorAll('.home-testimonials-swiper .home-testimonials_tab-user_name');
      slideNames.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.name;
      });

      const slideRoles = block.querySelectorAll('.home-testimonials-swiper .home-testimonials_tab-user_position');
      slideRoles.forEach(function (node, idx) {
        const item = data[idx % data.length];
        node.textContent = item.role;
      });
    });
  }

  function replacePricingComparison() {
    if (!window.location || window.location.pathname.indexOf('/pricing') !== 0) return;
    if (document.querySelector('.elite-pricing-breakdown')) return;

    const wrapper = document.querySelector('.pricing-breakdown_image-wrapper');
    if (!wrapper) return;

    const table = document.createElement('div');
    table.className = 'elite-pricing-breakdown';
    table.innerHTML = [
      '<table>',
      '<thead><tr><th>Feature</th><th>EliTechWiz</th><th>Freelancers</th><th>Outsourcing Vendor</th></tr></thead>',
      '<tbody>',
      '<tr><td>Senior-level expertise</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>',
      '<tr><td>Specialized market knowledge</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>',
      '<tr><td>Clear scope, timeline and cost before start</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>',
      '<tr><td>Fast project start (3-5 days)</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td></tr>',
      '<tr><td>3-day free trial</td><td class="yes">Yes</td><td class="no">No</td><td class="no">No</td></tr>',
      '<tr><td>Direct and fast communication</td><td class="yes">Yes</td><td class="yes">Yes</td><td class="no">No</td></tr>',
      '<tr><td>Dedicated project manager</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>',
      '<tr><td>Easy to scale team capacity</td><td class="yes">Yes</td><td class="no">No</td><td class="yes">Yes</td></tr>',
      '</tbody>',
      '</table>'
    ].join('');

    wrapper.innerHTML = '';
    wrapper.appendChild(table);

    const swiper = document.querySelector('.pricing-breakdown-swiper');
    if (swiper) swiper.style.display = 'none';
  }

  function buildAboutLocationCard(title, code, address) {
    const card = document.createElement('div');
    card.className = 'location_card location_trigger';

    const top = document.createElement('div');
    top.className = 'location_card-top';

    const name = document.createElement('p');
    name.className = 'location_card-name';
    name.textContent = title;

    const info = document.createElement('div');
    info.className = 'location_card-info';

    const abbr = document.createElement('p');
    abbr.className = 'location_card-country-abbr';
    abbr.textContent = code;

    const flagWrap = document.createElement('div');
    flagWrap.className = 'location_card-flag-wrapper';

    const flag = document.createElement('img');
    flag.className = 'location_card-flag';
    flag.loading = 'lazy';
    flag.alt = 'tanzania flag';
    flag.src = 'https://flagcdn.com/w40/tz.png';

    flagWrap.appendChild(flag);
    info.appendChild(abbr);
    info.appendChild(flagWrap);
    top.appendChild(name);
    top.appendChild(info);

    const desc = document.createElement('p');
    desc.className = 'location_card-address';
    desc.textContent = address;

    card.appendChild(top);
    card.appendChild(desc);
    return card;
  }

  function enforceAboutTanzaniaOnlyLocations() {
    if (!window.location || window.location.pathname.indexOf('/about') !== 0) return;

    const tags = document.querySelector('.location_tags');
    if (tags) {
      tags.remove();
    }

    const grid = document.querySelector('.cp-location_locations-grid');
    if (!grid) return;

    grid.innerHTML = '';
    grid.appendChild(
      buildAboutLocationCard(
        'Tanzania - Dar es Salaam',
        'TZ',
        'Posta, Kivukoni, Dar es Salaam, Tanzania'
      )
    );
    grid.appendChild(
      buildAboutLocationCard(
        'Tanzania - Kibaha, Pwani',
        'TZ',
        'Mailimoja Area, Kibaha, Pwani, Tanzania'
      )
    );
  }

  function redesignHomeResultsSection() {
    if (!window.location) return;
    const path = window.location.pathname || '/';
    if (path !== '/' && path !== '/index.html') return;

    const container = document.querySelector('.home-results-section .home-results-bottom');
    if (!container || container.getAttribute('data-elite-redesigned') === '1') return;

    container.innerHTML = [
      '<div class="elite-results-grid">',
      '<article class="elite-results-card">',
      '<span class="elite-results-kicker">Engagement Signal</span>',
      '<span class="elite-results-trend">Activation +42%</span>',
      '<p class="elite-results-value">+170%</p>',
      '<h3 class="elite-results-label">User Engagement</h3>',
      '<p class="elite-results-desc">Sharper onboarding and cleaner journeys convert more visitors into active users.</p>',
      '<div class="elite-results-mini"><div>Faster first-value time</div><div>Lower drop-off on key flows</div></div>',
      '</article>',
      '<article class="elite-results-card is-growth">',
      '<span class="elite-results-kicker">Revenue Lift</span>',
      '<span class="elite-results-trend">Sustained momentum</span>',
      '<p class="elite-results-value">4.6x</p>',
      '<h3 class="elite-results-label">Growth Output</h3>',
      '<p class="elite-results-desc">Focused design and delivery increased conversion quality and sales velocity.</p>',
      '<div class="elite-results-mini"><div>Higher qualified pipeline</div><div>Stronger conversion intent</div></div>',
      '</article>',
      '<article class="elite-results-card is-risk">',
      '<span class="elite-results-kicker">Retention Control</span>',
      '<span class="elite-results-trend">Churn risk down</span>',
      '<p class="elite-results-value">-37%</p>',
      '<h3 class="elite-results-label">Churn Reduction</h3>',
      '<p class="elite-results-desc">Simplified UX and product clarity improved confidence, reducing cancellation pressure.</p>',
      '<div class="elite-results-mini"><div>Better onboarding completion</div><div>More repeat product sessions</div></div>',
      '</article>',
      '</div>'
    ].join('');

    container.setAttribute('data-elite-redesigned', '1');
  }

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  }

  function setAllText(selector, values) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(function (n, i) {
      if (values[i] !== undefined) n.textContent = values[i];
    });
  }

  function rewriteHomePageCopy() {
    if (!window.location) return;
    const path = window.location.pathname || '/';
    if (path !== '/' && path !== '/index.html') return;

    if (document.body && document.body.getAttribute('data-elite-home-copy') === '1') return;

    // Hero
    setText('.home-hero-subtitle', 'Digital Product Design & Development Agency');
    setText(
      '.home-hero-title',
      'We design and build digital products that help ambitious teams launch faster, convert better, and scale with confidence.'
    );
    setAllText('.home-hero-quote_text', [
      'Trusted by startups, SMEs, and growth-stage teams across multiple markets.',
      'Since 2016, we have delivered practical product outcomes with measurable business value.'
    ]);

    // Results top
    setText('.home-results-title', 'Why teams choose EliTechWiz for high-impact delivery');
    setAllText('.home-results-right-list-item-text', [
      'Fast project onboarding with clear ownership',
      'Reliable delivery timelines you can plan around',
      'Flexible collaboration models with transparent pricing'
    ]);

    // Services intro
    setText('.home-services-title', 'Product design and development services built for real business goals');

    // Cases / reviews heading
    setText('.home-title-our-cases', 'Case studies');
    setAllText('.home-reviews-left-title', [
      'A fintech platform increased product adoption after a full UX redesign and streamlined onboarding.',
      'A growing SaaS business improved conversion with focused IA, UX writing, and design consistency.',
      'A B2B product team accelerated launch with a scalable design and development workflow.'
    ]);
    setAllText('.home-reviews-left-description', [
      'The team delivered structured updates, clear communication, and practical execution from start to launch.',
      'We received thoughtful product guidance, fast iterations, and a final result that improved decision-making.',
      'From planning to release, EliTechWiz stayed proactive and helped us move with confidence.'
    ]);
    setAllText('.home-review-user-name', [
      'Aisha Msuya',
      'Daniel Mwita',
      'Irene Mhando'
    ]);
    setAllText('.home-review-user-position', [
      'Product Manager, Dar es Salaam',
      'CTO, Kibaha',
      'Operations Lead, Dar es Salaam'
    ]);

    // About
    setText('.home-about-subtitle', 'A focused digital team that turns product ideas into scalable experiences');
    setAllText('.home-about-quote_text1, .home-about-quote_text2', [
      'Strategy, UX, UI, and development aligned around business outcomes.',
      'Cross-functional collaboration that keeps quality high and delivery predictable.'
    ]);

    // Testimonials section
    setText('.home-testimonials-top .home-title-upcase', 'Client feedback');
    setText(
      '.home-testimonials-subtitle .home-title',
      'Teams partner with EliTechWiz for clarity, speed, and product execution that delivers measurable results.'
    );

    // Experience section
    setText('.home-experience-description', 'We apply proven product methods tailored to your users, market, and growth objectives.');

    // Blog section
    setText('.home-blog-section .home-title', 'Insights, playbooks, and practical lessons for building better digital products.');

    // CTA section
    setText('.home-ready-to-scale__card-title', 'Ready to move your product forward?');
    setText(
      '.home-ready-to-scale__card-text',
      'Book a free strategy session to get actionable direction for design, development, and growth.'
    );

    if (document.body) document.body.setAttribute('data-elite-home-copy', '1');
  }

  const servicePageData = {
    '/services/penetration-testing': {
      theme: 'cyber',
      title: 'Penetration Testing Services | EliTechWiz',
      description: 'Penetration testing services to identify exploitable vulnerabilities, reduce risk, and harden critical systems.',
      heroTitle: '<em class="is-italic">Penetration Testing</em> that exposes risk before attackers do',
      heroText: 'We simulate real-world attacks across web apps, APIs, cloud, and internal networks, then provide prioritized fixes your team can implement fast.',
      tags: ['Web Apps', 'APIs', 'Cloud', 'Internal Network'],
      processTitle: 'Our penetration testing workflow built for measurable risk reduction',
      processSubtitle: 'Scoping, threat modeling, exploitation, and retesting delivered in a clear engineering workflow.',
      benefitsTitle: 'What you gain from our penetration testing engagement',
      benefitsSubtitle: 'Actionable findings, technical depth, and a remediation roadmap that helps teams close vulnerabilities faster.',
      expertiseTitle: 'Technical capabilities for offensive security validation',
      expertiseSubtitle: 'We test authentication, authorization, business logic, API abuse paths, and infrastructure weaknesses.',
      toolsTitle: 'Security stack we use for deep coverage',
      toolsSubtitle: 'Industry-standard and custom testing workflows to validate real exploit paths.',
      tools: ['Burp Suite', 'Nmap', 'OWASP ZAP', 'Metasploit', 'Kali Linux', 'Wireshark', 'Nessus', 'Custom Scripts'],
      faqs: [
        ['How often should penetration testing be done?', 'For most teams, run a full test at least annually and after major releases, architecture changes, or integrations.'],
        ['Do you provide proof-of-concept exploits?', 'Yes. We include evidence for validated findings, with business impact and technical reproduction steps.'],
        ['Can you test staging and production?', 'Yes. We recommend staged testing first, then controlled production validation for critical paths.'],
        ['Will you help with remediation?', 'Yes. We provide fix guidance, developer sessions, and optional retesting to verify closure.'],
        ['Do you sign NDA and handle sensitive data securely?', 'Yes. Every engagement is protected by NDA and strict data handling procedures.']
      ],
      ctaTitle: 'Secure your platform before incidents happen',
      ctaText: 'Book a security discovery call and receive a penetration testing scope tailored to your systems.'
    },
    '/services/network-security': {
      theme: 'cyber',
      title: 'Network Security Services | EliTechWiz',
      description: 'Network security services for visibility, segmentation, hardening, and resilient infrastructure operations.',
      heroTitle: '<em class="is-italic">Network Security</em> designed for uptime and resilience',
      heroText: 'We design and harden your network architecture to reduce attack surface, improve monitoring, and protect business continuity.',
      tags: ['Segmentation', 'Firewall', 'Zero Trust', 'Monitoring'],
      processTitle: 'Network security delivery with practical implementation steps',
      processSubtitle: 'Assessment, architecture design, hardening, monitoring integration, and validation.',
      benefitsTitle: 'How your team benefits from network hardening',
      benefitsSubtitle: 'Better control over lateral movement, stronger monitoring, and improved incident response readiness.',
      expertiseTitle: 'Our network defense capabilities',
      expertiseSubtitle: 'We cover perimeter, internal segmentation, VPN, identity-aware access, and logging strategy.',
      toolsTitle: 'Core technologies we work with',
      toolsSubtitle: 'Security tooling and infrastructure controls aligned with your operating environment.',
      tools: ['SIEM', 'IDS/IPS', 'Firewall Rules', 'VPN Controls', 'ZTNA', 'EDR', 'NetFlow', 'Alerting'],
      faqs: [
        ['What is included in network security assessment?', 'Topology review, exposed services mapping, policy checks, and high-risk configuration analysis.'],
        ['Can you secure hybrid cloud networks?', 'Yes. We secure on-prem, cloud, and hybrid environments with unified policy recommendations.'],
        ['Do you help with segmentation design?', 'Yes. We define trust zones and access paths to reduce blast radius during incidents.'],
        ['Will this disrupt daily operations?', 'We plan implementation windows to minimize impact and keep services available.'],
        ['Do you provide documentation?', 'Yes. You receive architecture notes, policy updates, and an actionable implementation plan.']
      ],
      ctaTitle: 'Build a stronger network defense baseline',
      ctaText: 'Talk to our team to get a practical roadmap for securing your internal and external network layers.'
    },
    '/services/cybersecurity-consulting': {
      theme: 'cyber',
      title: 'Cybersecurity Consulting Services | EliTechWiz',
      description: 'Cybersecurity consulting services to align security strategy, risk management, and operational execution.',
      heroTitle: '<em class="is-italic">Cybersecurity Consulting</em> aligned with business risk',
      heroText: 'We help leadership and engineering teams turn security goals into practical controls, processes, and measurable outcomes.',
      tags: ['Risk Strategy', 'Governance', 'Compliance', 'Execution'],
      processTitle: 'Consulting approach from strategy to implementation',
      processSubtitle: 'Current-state review, risk prioritization, control planning, and execution support.',
      benefitsTitle: 'What our cybersecurity consulting delivers',
      benefitsSubtitle: 'Clear governance, reduced risk exposure, and confident decision-making for technical and business teams.',
      expertiseTitle: 'Advisory areas we cover',
      expertiseSubtitle: 'Security architecture, policies, compliance readiness, incident preparedness, and vendor risk controls.',
      toolsTitle: 'Frameworks and operating models we leverage',
      toolsSubtitle: 'Best-practice models adapted to your team maturity and business stage.',
      tools: ['ISO 27001', 'NIST CSF', 'Risk Registers', 'Control Matrices', 'IR Playbooks', 'Policy Packs', 'Vendor Reviews', 'Awareness'],
      faqs: [
        ['Who is cybersecurity consulting best for?', 'Founders, CTOs, and operations leaders needing practical security direction and execution support.'],
        ['Do you support compliance readiness?', 'Yes. We help map controls, collect evidence, and prepare teams for audits.'],
        ['Can you work with existing IT teams?', 'Yes. We collaborate with internal teams and external vendors to avoid disruption.'],
        ['Do you offer recurring advisory?', 'Yes. Monthly advisory support is available for continuous security improvement.'],
        ['How fast can we start?', 'Discovery can start within days after scope alignment.']
      ],
      ctaTitle: 'Turn security goals into an executable plan',
      ctaText: 'Book a consulting session to prioritize the security actions that matter most for your business.'
    },
    '/services/cloud-security': {
      theme: 'cyber',
      title: 'Cloud Security Services | EliTechWiz',
      description: 'Cloud security services for identity controls, workload protection, and resilient cloud operations.',
      heroTitle: '<em class="is-italic">Cloud Security</em> for secure and scalable growth',
      heroText: 'We secure cloud environments with least-privilege access, hardened configurations, and continuous monitoring controls.',
      tags: ['AWS/Azure', 'IAM', 'Workloads', 'Compliance'],
      processTitle: 'Cloud security implementation with clear control ownership',
      processSubtitle: 'Assessment, IAM design, configuration hardening, monitoring setup, and policy rollout.',
      benefitsTitle: 'Business outcomes from cloud security hardening',
      benefitsSubtitle: 'Lower misconfiguration risk, stronger access control, and improved cloud incident readiness.',
      expertiseTitle: 'Cloud security capabilities',
      expertiseSubtitle: 'Identity governance, secrets management, logging, workload security, and policy enforcement.',
      toolsTitle: 'Cloud security controls we implement',
      toolsSubtitle: 'Native and integrated tooling to improve prevention, detection, and response.',
      tools: ['IAM Policies', 'CSPM', 'WAF', 'Key Management', 'Cloud Logs', 'Runtime Security', 'Backup Controls', 'Alerting'],
      faqs: [
        ['Can you audit existing cloud accounts?', 'Yes. We assess accounts, workloads, permissions, and exposure points.'],
        ['Do you support multi-cloud setups?', 'Yes. We support single-cloud and multi-cloud security governance models.'],
        ['Will you help with IAM redesign?', 'Yes. We implement least-privilege and role-based access controls.'],
        ['Do you configure monitoring and alerts?', 'Yes. We set practical detection and alerting thresholds tied to risk.'],
        ['Can cloud security be done without downtime?', 'Yes. We stage and sequence changes to avoid service interruption.']
      ],
      ctaTitle: 'Harden your cloud before scale increases risk',
      ctaText: 'Schedule a cloud security review and get a prioritized hardening roadmap.'
    },
    '/services/security-audits': {
      theme: 'cyber',
      title: 'Security Audit Services | EliTechWiz',
      description: 'Security audit services to assess controls, detect gaps, and strengthen your overall security posture.',
      heroTitle: '<em class="is-italic">Security Audits</em> that convert findings into action',
      heroText: 'Our audits evaluate technical and process controls, then translate findings into a prioritized remediation program.',
      tags: ['Control Review', 'Gap Analysis', 'Policy Audit', 'Remediation'],
      processTitle: 'Audit workflow focused on practical remediation',
      processSubtitle: 'Scope definition, evidence collection, risk scoring, and implementation roadmap.',
      benefitsTitle: 'What a strong security audit gives your team',
      benefitsSubtitle: 'Clear visibility of risk, decision-ready reporting, and a structured path to improvement.',
      expertiseTitle: 'Audit domains we cover',
      expertiseSubtitle: 'Infrastructure, identity, application controls, policies, and incident readiness.',
      toolsTitle: 'Audit methods and analysis stack',
      toolsSubtitle: 'Structured review processes supported by technical validation.',
      tools: ['Control Mapping', 'Config Review', 'Risk Scoring', 'Evidence Matrix', 'Policy Checks', 'Interview Notes', 'Report Packs', 'Retest'],
      faqs: [
        ['How is a security audit different from pentesting?', 'Audit reviews overall controls and governance; pentesting validates exploitability of technical weaknesses.'],
        ['Do you provide executive and technical reports?', 'Yes. We provide leadership summaries and detailed technical findings.'],
        ['Can you align audit results to compliance needs?', 'Yes. Findings can be mapped to your compliance objectives and standards.'],
        ['How long does a typical audit take?', 'Depending on scope, most audits complete in 2-6 weeks.'],
        ['Do you offer follow-up validation?', 'Yes. We can retest and validate fixes after remediation.']
      ],
      ctaTitle: 'Get a clear view of your security maturity',
      ctaText: 'Book a security audit scoping call and receive a tailored assessment plan.'
    },
    '/services/structural-design': {
      theme: 'civil',
      title: 'Structural Design Services | EliTechWiz',
      description: 'Structural design services for safe, code-compliant, and cost-efficient residential and commercial projects.',
      heroTitle: '<em class="is-italic">Structural Design</em> built for safety, efficiency, and longevity',
      heroText: 'We design reliable structural systems for buildings and infrastructure with strong engineering rigor and code compliance.',
      tags: ['Residential', 'Commercial', 'Industrial', 'Infrastructure'],
      processTitle: 'Engineering process from concept design to final structural package',
      processSubtitle: 'Load analysis, modeling, detailing, and coordination with architects and MEP teams.',
      benefitsTitle: 'What clients gain from our structural engineering service',
      benefitsSubtitle: 'Safer structures, optimized material usage, and build-ready documents for smooth execution.',
      expertiseTitle: 'Structural design capabilities',
      expertiseSubtitle: 'Concrete, steel, and mixed systems with seismic and environmental considerations.',
      toolsTitle: 'Engineering tools we apply',
      toolsSubtitle: 'Modern modeling and detailing software for accuracy and speed.',
      tools: ['ETABS', 'SAP2000', 'STAAD', 'Revit', 'AutoCAD', 'BIM Review', 'Code Checks', 'Detailing'],
      faqs: [
        ['Do you design both residential and commercial structures?', 'Yes. We provide structural design across residential, commercial, and mixed-use projects.'],
        ['Can you optimize designs for cost efficiency?', 'Yes. We optimize member sizing and material usage while preserving safety and compliance.'],
        ['Do you coordinate with architects and contractors?', 'Yes. We collaborate throughout design and construction phases for alignment.'],
        ['Are your designs code-compliant?', 'Yes. Designs are developed based on applicable standards and local code requirements.'],
        ['Can you support redesign of existing buildings?', 'Yes. We assess existing structures and provide retrofit or redesign recommendations.']
      ],
      ctaTitle: 'Need a structural system you can build with confidence?',
      ctaText: 'Talk to our engineering team for a practical structural design scope tailored to your project.'
    },
    '/services/construction-management': {
      theme: 'civil',
      title: 'Construction Management Services | EliTechWiz',
      description: 'Construction management services to improve execution control, quality assurance, and delivery timelines.',
      heroTitle: '<em class="is-italic">Construction Management</em> that keeps delivery on track',
      heroText: 'We coordinate schedules, vendors, quality, and reporting to reduce project delays and improve execution predictability.',
      tags: ['Planning', 'Site Control', 'Quality', 'Delivery'],
      processTitle: 'Construction management model focused on control and transparency',
      processSubtitle: 'Project planning, contractor coordination, risk tracking, quality checks, and reporting.',
      benefitsTitle: 'How your project benefits from managed execution',
      benefitsSubtitle: 'Fewer delays, clearer accountability, and stronger communication from kickoff to handover.',
      expertiseTitle: 'Execution areas we manage',
      expertiseSubtitle: 'Timeline planning, budget tracking, procurement coordination, and issue resolution.',
      toolsTitle: 'Project delivery stack we use',
      toolsSubtitle: 'Structured systems that improve site visibility and team coordination.',
      tools: ['Gantt Planning', 'Site Logs', 'RFI Tracking', 'QA Checklists', 'Risk Registers', 'Progress Dashboards', 'Budget Control', 'Handover Packs'],
      faqs: [
        ['Do you manage both small and large projects?', 'Yes. We support projects of different sizes with tailored control mechanisms.'],
        ['Can you coordinate subcontractors and suppliers?', 'Yes. We align communication, timelines, and deliverables across all parties.'],
        ['How do you handle delays?', 'We track early risk signals and run mitigation actions before delays escalate.'],
        ['Do you provide regular project reporting?', 'Yes. You receive structured updates on progress, budget, quality, and risks.'],
        ['Can you join mid-project?', 'Yes. We can step in, stabilize operations, and improve delivery control.']
      ],
      ctaTitle: 'Take control of your construction timeline',
      ctaText: 'Book a project review to identify delivery risks and define a stronger execution plan.'
    },
    '/services/infrastructure-planning': {
      theme: 'civil',
      title: 'Infrastructure Planning Services | EliTechWiz',
      description: 'Infrastructure planning services for scalable, resilient, and efficient civil engineering projects.',
      heroTitle: '<em class="is-italic">Infrastructure Planning</em> for resilient long-term growth',
      heroText: 'We plan infrastructure systems with feasibility, lifecycle value, and operational sustainability at the center.',
      tags: ['Feasibility', 'Utilities', 'Transport', 'Masterplanning'],
      processTitle: 'Planning workflow for reliable infrastructure outcomes',
      processSubtitle: 'Needs assessment, feasibility analysis, concept design, and implementation planning.',
      benefitsTitle: 'What strong infrastructure planning delivers',
      benefitsSubtitle: 'Better investment decisions, reduced rework risk, and scalable system architecture.',
      expertiseTitle: 'Planning scope we support',
      expertiseSubtitle: 'Urban infrastructure, utility networks, transport-support facilities, and expansion planning.',
      toolsTitle: 'Planning and analysis toolkit',
      toolsSubtitle: 'Data-driven planning methods and digital engineering documentation.',
      tools: ['Feasibility Models', 'GIS Inputs', 'Demand Forecasts', 'Concept Layouts', 'Risk Analysis', 'Cost Planning', 'Phasing Strategy', 'Stakeholder Maps'],
      faqs: [
        ['What is included in infrastructure planning?', 'Feasibility, scope definition, capacity planning, phasing, and implementation guidance.'],
        ['Can you plan for future expansion?', 'Yes. We design planning frameworks that accommodate future growth and upgrades.'],
        ['Do you support utility and transport planning?', 'Yes. We cover essential infrastructure layers relevant to project goals.'],
        ['How do you manage planning risks?', 'We run scenario-based analysis and define mitigation options early.'],
        ['Do you provide implementation-ready outputs?', 'Yes. Deliverables include practical planning documents and decision support materials.']
      ],
      ctaTitle: 'Plan infrastructure with clarity and confidence',
      ctaText: 'Schedule a planning session and define a scalable roadmap for your infrastructure project.'
    },
    '/services/cad-bim-services': {
      theme: 'civil',
      title: 'CAD and BIM Services | EliTechWiz',
      description: 'CAD and BIM services for coordinated engineering documentation, clash detection, and efficient construction delivery.',
      heroTitle: '<em class="is-italic">CAD and BIM Services</em> for precise digital execution',
      heroText: 'We produce coordinated CAD and BIM outputs that improve design quality, reduce clashes, and accelerate project delivery.',
      tags: ['BIM Modeling', 'Coordination', 'Clash Detection', 'Documentation'],
      processTitle: 'Digital engineering workflow for coordinated delivery',
      processSubtitle: 'Model setup, multidisciplinary coordination, clash resolution, and documentation handover.',
      benefitsTitle: 'Why teams choose our CAD and BIM services',
      benefitsSubtitle: 'Improved design consistency, fewer site conflicts, and better construction readiness.',
      expertiseTitle: 'CAD/BIM execution capabilities',
      expertiseSubtitle: '3D modeling, detail production, federated model coordination, and revision control.',
      toolsTitle: 'Design platforms we operate',
      toolsSubtitle: 'Professional CAD/BIM tools for reliable and auditable outputs.',
      tools: ['Revit', 'AutoCAD', 'Navisworks', 'BIM 360', 'Civil 3D', 'Model QA', 'Sheet Sets', 'Coordination Logs'],
      faqs: [
        ['Do you provide BIM models for all disciplines?', 'Yes. We support multidisciplinary model coordination based on project scope.'],
        ['Can you convert 2D drawings into BIM?', 'Yes. We can build structured BIM models from existing CAD documentation.'],
        ['Do you perform clash detection?', 'Yes. Clash detection and resolution tracking are core parts of our workflow.'],
        ['Can you support construction documentation?', 'Yes. We provide drawing sets and model outputs for execution teams.'],
        ['How do you manage revisions?', 'We maintain version control and structured change logs for traceability.']
      ],
      ctaTitle: 'Improve coordination with accurate digital models',
      ctaText: 'Book a CAD/BIM consultation and get a model delivery plan aligned with your construction workflow.'
    },
    '/services/environmental-engineering': {
      theme: 'civil',
      title: 'Environmental Engineering Services | EliTechWiz',
      description: 'Environmental engineering services for sustainable design, compliance support, and resilient project delivery.',
      heroTitle: '<em class="is-italic">Environmental Engineering</em> for sustainable project outcomes',
      heroText: 'We help teams design and execute projects with environmental responsibility, regulatory alignment, and long-term performance.',
      tags: ['Sustainability', 'Compliance', 'Impact', 'Resilience'],
      processTitle: 'Environmental engineering process for practical sustainability',
      processSubtitle: 'Baseline assessment, impact analysis, mitigation planning, and ongoing compliance support.',
      benefitsTitle: 'Value delivered through environmental engineering',
      benefitsSubtitle: 'Lower environmental risk, stronger compliance posture, and more resilient project planning.',
      expertiseTitle: 'Environmental services we provide',
      expertiseSubtitle: 'Impact mitigation planning, sustainability integration, and environmental performance support.',
      toolsTitle: 'Assessment and reporting methods',
      toolsSubtitle: 'Structured analysis and documentation for informed project decisions.',
      tools: ['Impact Review', 'Mitigation Plans', 'Compliance Check', 'Sustainability Metrics', 'Site Assessment', 'Reporting Packs', 'Monitoring Plans', 'Advisory Support'],
      faqs: [
        ['Do you help with environmental compliance planning?', 'Yes. We support planning and documentation aligned to project requirements.'],
        ['Can you support sustainable infrastructure initiatives?', 'Yes. We integrate sustainability criteria into design and execution recommendations.'],
        ['Do you provide environmental risk assessments?', 'Yes. We assess risk exposure and define mitigation actions.'],
        ['Can your team work with project engineers and contractors?', 'Yes. We collaborate across design and execution stakeholders.'],
        ['What industries do you support?', 'We support construction, infrastructure, and mixed civil development contexts.']
      ],
      ctaTitle: 'Build responsibly with engineering-backed sustainability',
      ctaText: 'Speak with our team to align your project with practical environmental goals and compliance needs.'
    }
  };

  function setNodeText(node, text, asHtml) {
    if (!node) return;
    if (asHtml) node.innerHTML = text;
    else node.textContent = text;
  }

  function setManyTexts(selector, values) {
    const nodes = document.querySelectorAll(selector);
    nodes.forEach(function (node, i) {
      if (values[i] !== undefined) node.textContent = values[i];
    });
  }

  function rewriteServicePages() {
    if (!window.location) return;
    const path = window.location.pathname || '';
    const data = servicePageData[path];
    if (!data) return;

    document.body.classList.add('elite-service-page');
    document.body.classList.add(data.theme === 'cyber' ? 'elite-service-page-cyber' : 'elite-service-page-civil');

    document.title = data.title;
    setMetaByName('description', data.description);
    setMetaByProperty('og:title', data.title);
    setMetaByProperty('twitter:title', data.title);
    setMetaByProperty('og:description', data.description);
    setMetaByProperty('twitter:description', data.description);

    setNodeText(document.querySelector('.services-hero_heading-wrapper .heading-style-h1'), data.heroTitle, true);
    setNodeText(document.querySelector('.services-hero_text'), data.heroText);
    setManyTexts('.hero_title-tags .hero_title-tag', data.tags || []);
    setManyTexts('.services-hero_stats-title', ['120+', '98%', '24/7']);
    setManyTexts('.services-hero_stats-text', [
      'Successful engagements <br/>delivered by our team',
      'Clients report improved <br/>operational confidence',
      'Support coverage and <br/>incident response mindset'
    ]);

    setNodeText(document.querySelector('.services-section_heading-wrapper.is-principles .heading-h2'), 'Specialized delivery model for <em class="is-italic">' + (data.theme === 'cyber' ? 'cybersecurity' : 'civil engineering') + '</em> projects', true);
    setManyTexts('.services-principles_card-heading', ['Technical Depth', 'Execution Discipline', 'Clear Communication']);
    setManyTexts('.services-principles_card-text', [
      'Domain-focused expertise for complex requirements.',
      'Structured workflow with accountable milestones.',
      'Transparent updates for confident decisions.'
    ]);

    setNodeText(document.querySelector('.section_services-process .heading-h2'), data.processTitle);
    setNodeText(document.querySelector('.section_services-process .section_subheading'), data.processSubtitle);

    setNodeText(document.querySelector('.services-section_heading-wrapper.is-benefits .heading-h2'), data.benefitsTitle, false);
    setNodeText(document.querySelector('.section_services-benefits .section_subheading'), data.benefitsSubtitle);
    setManyTexts('.services-benefits_card-heding', ['Delivery Confidence', 'Operational Strength']);
    setManyTexts('.services-benefits_card-text', [
      'A practical execution model that keeps scope, quality, and outcomes aligned.',
      'Decisions backed by technical evidence and implementation-ready recommendations.'
    ]);

    setNodeText(document.querySelector('.services-section_heading-wrapper.is-cases .heading-h2'), 'Project outcomes that prove <em class="is-italic">real delivery value</em>', true);
    setNodeText(document.querySelector('.section_services-cases .section_subheading'), 'We focus on practical outcomes, measurable improvements, and dependable delivery quality across engagements.');

    setNodeText(document.querySelector('.services-section_heading-wrapper.is-expertise .heading-style-h2, .services-section_heading-wrapper.is-expertise .heading-h2'), data.expertiseTitle);
    setNodeText(document.querySelector('.section_services-expertise .section_subheading'), data.expertiseSubtitle);

    setNodeText(document.querySelector('.services-section_heading-wrapper.is-tools .heading-h2'), data.toolsTitle, false);
    setNodeText(document.querySelector('.section_services-tools .section_subheading'), data.toolsSubtitle);
    setManyTexts('.services-page_tools-card-text', data.tools || []);

    if (Array.isArray(data.faqs)) {
      const qNodes = document.querySelectorAll('.faq_item-question');
      const aNodes = document.querySelectorAll('.faq_item-answer');
      data.faqs.forEach(function (pair, i) {
        if (qNodes[i]) qNodes[i].textContent = pair[0];
        if (aNodes[i]) aNodes[i].textContent = pair[1];
      });
    }

    setNodeText(document.querySelector('.services-cta_heading'), data.ctaTitle, false);
    setNodeText(document.querySelector('.services-cta_text'), data.ctaText);
  }

  const newBlogPosts = [
    {
      slug: '/blog/homepage-design',
      title: 'Homepage UX Blueprint for Tanzanian Service Brands in 2026',
      category: 'Growth Strategy',
      readTime: '8 min read',
      dateDisplay: '11.03.2026',
      image: '/assets/images/blog/homepage-ux-blueprint.svg',
      description: 'A practical homepage framework for service businesses that want more qualified leads and better user flow.',
      body: [
        '<p>Most service websites lose potential customers in the first ten seconds. The issue is rarely traffic. The issue is unclear structure, weak hierarchy, and messaging that does not answer real buyer questions.</p>',
        '<p>This guide explains how Tanzanian service brands can structure homepage content for stronger trust and faster conversion. The goal is practical: help visitors quickly understand what you do, why they should trust you, and how to contact you.</p>',
        '<h2>1. Start with one clear outcome statement</h2>',
        '<p>Your hero headline should state the business result you deliver. Keep it simple and specific. Avoid generic claims like &quot;world-class solutions&quot;.</p>',
        '<h2>2. Build proof close to the top</h2>',
        '<p>Use measurable results, short testimonials, and recognizable client contexts. Place trust signals before the first major scroll break.</p>',
        '<h2>3. Make the next step obvious</h2>',
        '<p>Use one primary CTA with clear wording such as &quot;Book a discovery call&quot; or &quot;Get project estimate&quot;. Competing CTAs reduce action rate.</p>',
        '<h2>4. Structure sections for scanning</h2>',
        '<p>Decision-makers scan quickly. Use short headings, concise paragraphs, and visual grouping so users can understand your offer without reading every line.</p>',
        '<h2>5. Optimize for mobile first</h2>',
        '<p>Most first visits happen on mobile. Keep layouts lightweight, spacing consistent, and touch targets clear. Fast mobile UX directly improves lead quality.</p>',
        '<h2>Conclusion</h2>',
        '<p>A strong homepage is a sales tool, not a decoration layer. When structure and message are aligned to buyer intent, conversion improves without increasing ad spend.</p>'
      ].join(''),
      topStoriesTitle: 'Homepage UX Blueprint for Tanzanian Service Brands in 2026'
    },
    {
      slug: '/blog/why-ai-generated-project-requests-break-down-in-real-delivery',
      title: 'How to Scope Web Projects Without Budget Surprises',
      category: 'Project Delivery',
      readTime: '7 min read',
      dateDisplay: '11.03.2026',
      image: '/assets/images/blog/project-scope-without-surprises.svg',
      description: 'A clear scoping method to reduce budget shocks, avoid rework, and keep project delivery predictable.',
      body: [
        '<p>Budget surprises usually happen before development starts. They come from unclear scope, missing assumptions, and features that were never prioritized against business value.</p>',
        '<p>This article outlines a practical scoping method used by product and service teams to control cost and keep delivery stable.</p>',
        '<h2>1. Define outcomes before features</h2>',
        '<p>List the business outcomes first: leads, onboarding completion, faster support response, or operational efficiency. Features should exist only if they support those outcomes.</p>',
        '<h2>2. Separate &quot;must-have&quot; from &quot;nice-to-have&quot;</h2>',
        '<p>Create a strict MVP boundary. If everything is marked critical, project risk rises and budget control disappears.</p>',
        '<h2>3. Write acceptance criteria for every major item</h2>',
        '<p>Acceptance criteria prevent interpretation gaps between design, development, and stakeholders. This is one of the highest-impact steps for avoiding rework.</p>',
        '<h2>4. Add dependency and risk notes</h2>',
        '<p>Document external APIs, legal approvals, and content readiness. Most timeline slips come from hidden dependencies, not coding speed.</p>',
        '<h2>5. Use phased delivery</h2>',
        '<p>Break work into discovery, design, build, and stabilization phases. Each phase should have clear outputs and decision gates.</p>',
        '<h2>Conclusion</h2>',
        '<p>Predictable projects are scoped with discipline. Clear priorities, defined acceptance criteria, and phased execution reduce budget volatility and improve delivery confidence.</p>'
      ].join(''),
      topStoriesTitle: 'How to Scope Web Projects Without Budget Surprises'
    },
    {
      slug: '/blog/branding-statistics',
      title: 'SEO + UX Checklist for Faster B2B Lead Generation',
      category: 'SEO & UX',
      readTime: '9 min read',
      dateDisplay: '11.03.2026',
      image: '/assets/images/blog/seo-ux-checklist-b2b.svg',
      description: 'A practical checklist combining SEO and UX improvements that help B2B teams attract and convert better leads.',
      body: [
        '<p>SEO drives visits, UX drives action. If these two areas are treated separately, performance stalls. The best results come from aligning search intent with page experience.</p>',
        '<p>Use this checklist to improve lead generation quality without rebuilding your full website.</p>',
        '<h2>1. Match intent to page structure</h2>',
        '<p>Each core page should target one main search intent and one clear conversion action. Mixed intent pages confuse both users and search engines.</p>',
        '<h2>2. Improve page speed and stability</h2>',
        '<p>Slow pages reduce both rankings and conversion. Compress assets, remove heavy scripts, and keep layout shift low on mobile.</p>',
        '<h2>3. Strengthen headline hierarchy</h2>',
        '<p>Your H1 should express value clearly. H2 sections should answer common buyer questions: process, pricing, results, and timeline.</p>',
        '<h2>4. Add proof near high-intent sections</h2>',
        '<p>Place trust elements near CTAs: short case outcomes, client testimonials, and project snapshots.</p>',
        '<h2>5. Audit internal links</h2>',
        '<p>Support user journeys with contextual links between services, case studies, and contact actions. Better link paths improve both crawl flow and conversion flow.</p>',
        '<h2>Conclusion</h2>',
        '<p>Lead growth improves when SEO and UX are built as one system. Start with intent mapping, speed, clarity, and trust placement, then iterate using real user behavior.</p>'
      ].join(''),
      topStoriesTitle: 'SEO + UX Checklist for Faster B2B Lead Generation'
    }
  ];

  function setMetaByName(name, content) {
    const node = document.querySelector('meta[name="' + name + '"]');
    if (node) node.setAttribute('content', content);
  }

  function setMetaByProperty(name, content) {
    const node = document.querySelector('meta[property="' + name + '"]');
    if (node) node.setAttribute('content', content);
  }

  function setCoverImageOnFeedItem(item, imageUrl) {
    if (!item) return;
    const img = item.querySelector('img.image-15, .home-blog-card__img');
    if (img) {
      img.setAttribute('src', imageUrl);
      img.setAttribute('alt', 'Blog cover');
    }
    const banner = item.querySelector('.blog-feed_block-feed-item-banner-wrapper.article-feed');
    if (banner) {
      banner.style.backgroundImage = 'url("' + imageUrl + '")';
    }
  }

  function refreshHomepageBlogCards() {
    const cards = document.querySelectorAll('.home-blog-cards .home-blog-collection-item');
    if (!cards.length) return;
    cards.forEach(function (item, index) {
      if (index >= newBlogPosts.length) {
        item.remove();
        return;
      }
      const post = newBlogPosts[index];
      setCoverImageOnFeedItem(item, post.image);
      const title = item.querySelector('.home-blog-card__title');
      if (title) title.textContent = post.title;
      const read = item.querySelector('.home-blog-card__reading-duration');
      if (read) read.textContent = post.readTime;
      const link = item.querySelector('.home-blog-link-overlay');
      if (link) link.setAttribute('href', post.slug);
      const tag = item.querySelector('.paragraph-16');
      if (tag) tag.textContent = post.category;
    });
  }

  function refreshBlogIndexCards() {
    if (!window.location || window.location.pathname.indexOf('/blog') !== 0) return;
    const path = window.location.pathname || '';
    if (path !== '/blog' && path !== '/blog/') return;
    const items = document.querySelectorAll('.blog-feed_block-feed-cms-list .blog-feed_block-feed-cms-item');
    if (!items.length) return;
    items.forEach(function (item, index) {
      if (index >= newBlogPosts.length) {
        item.remove();
        return;
      }
      const post = newBlogPosts[index];
      const link = item.querySelector('a.blog-feed_block-feed-item');
      if (link) link.setAttribute('href', post.slug);
      setCoverImageOnFeedItem(item, post.image);
      const tags = item.querySelectorAll('.blog-feed_block-feed-item-tag');
      if (tags[0]) tags[0].textContent = post.category;
      if (tags[1]) tags[1].textContent = post.dateDisplay;
      const read = item.querySelector('.blog-feed_block-feed-item-read-time');
      if (read) read.textContent = post.readTime;
      const title = item.querySelector('.blog-feed_block-feed-item-title');
      if (title) title.textContent = post.title;
      const author = item.querySelector('.blog-feed_block-fiid-item-author-name');
      if (author) author.textContent = 'Eliah Hango';
    });
  }

  function refreshBlogArticlePage() {
    if (!window.location) return;
    const path = window.location.pathname || '';
    const post = newBlogPosts.find(function (item) {
      return item.slug === path;
    });
    if (!post) return;

    document.title = post.title;
    setMetaByName('description', post.description);
    setMetaByProperty('og:title', post.title);
    setMetaByProperty('og:description', post.description);
    setMetaByProperty('og:image', post.image);
    setMetaByProperty('twitter:title', post.title);
    setMetaByProperty('twitter:description', post.description);
    setMetaByProperty('twitter:image', post.image);

    const heroBg = document.querySelector('.section_article-hero-bg');
    if (heroBg) {
      heroBg.setAttribute('src', post.image);
      heroBg.removeAttribute('srcset');
      heroBg.removeAttribute('sizes');
    }

    const articleTitle = document.querySelector('.article-title');
    if (articleTitle) articleTitle.textContent = post.title;
    const breadLast = document.querySelector('.breadcrumbs_link.is-current.is-third');
    if (breadLast) breadLast.textContent = post.title;
    const cat = document.querySelector('.article-hero_category-label');
    if (cat) cat.textContent = post.category;
    const read = document.querySelector('.article-hero_read-time');
    if (read) read.textContent = post.readTime;
    const readAside = document.querySelector('.article_table-content-read-time');
    if (readAside) readAside.textContent = post.readTime;

    const dateRows = document.querySelectorAll('.article-author_post-date-warpper');
    dateRows.forEach(function (row) {
      const cells = row.querySelectorAll('div');
      if (cells.length < 2) return;
      const label = normalizeText(cells[0].textContent);
      if (label.indexOf('posted') !== -1 || label.indexOf('updated') !== -1) {
        cells[1].textContent = post.dateDisplay;
      }
    });

    const richText = document.querySelector('.article-content_rich-text.w-richtext');
    if (richText) richText.innerHTML = post.body;

    const stories = document.querySelectorAll('.section_article-stories .blog-feed_block-feed-cms-item');
    stories.forEach(function (item, index) {
      if (index >= newBlogPosts.length) {
        item.remove();
        return;
      }
      const story = newBlogPosts[index];
      const link = item.querySelector('a.blog-feed_block-feed-item');
      if (link) link.setAttribute('href', story.slug);
      setCoverImageOnFeedItem(item, story.image);
      const tags = item.querySelectorAll('.blog-feed_block-feed-item-tag');
      if (tags[0]) tags[0].textContent = story.category;
      if (tags[1]) tags[1].textContent = story.dateDisplay;
      const readTime = item.querySelector('.blog-feed_block-feed-item-read-time');
      if (readTime) readTime.textContent = story.readTime;
      const title = item.querySelector('.blog-feed_block-feed-item-title');
      if (title) title.textContent = story.topStoriesTitle || story.title;
    });
  }

  function refreshBlogContent() {
    refreshHomepageBlogCards();
    refreshBlogIndexCards();
    refreshBlogArticlePage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ensureWebflowIxClassFallback();
      installLenisUnblockFix();
      installTabsScrollFixes();
      injectSections();
      replaceFooterLocations();
      removeSelectedAwardBadges();
      removeFooterAwardsStrip();
      removeAwardsSections();
      removeReadyToScaleLogos();
      removeResidualAwardsRows();
      removeClutchReviewSources();
      injectCustomReviews();
      replacePartnerLogosAndTestimonials();
      replacePricingComparison();
      enforceAboutTanzaniaOnlyLocations();
      redesignHomeResultsSection();
      rewriteHomePageCopy();
      refreshBlogContent();
      rewriteServicePages();
      scheduleInject(250);
      scheduleInject(1200);
      setTimeout(replaceFooterLocations, 250);
      setTimeout(removeSelectedAwardBadges, 250);
      setTimeout(removeFooterAwardsStrip, 250);
      setTimeout(removeAwardsSections, 250);
      setTimeout(removeReadyToScaleLogos, 250);
      setTimeout(removeResidualAwardsRows, 250);
      setTimeout(removeClutchReviewSources, 250);
      setTimeout(injectCustomReviews, 250);
      setTimeout(replacePartnerLogosAndTestimonials, 250);
      setTimeout(replacePricingComparison, 250);
      setTimeout(enforceAboutTanzaniaOnlyLocations, 250);
      setTimeout(redesignHomeResultsSection, 250);
      setTimeout(rewriteHomePageCopy, 250);
      setTimeout(refreshBlogContent, 250);
      setTimeout(rewriteServicePages, 250);
    });
  } else {
    ensureWebflowIxClassFallback();
    installLenisUnblockFix();
    installTabsScrollFixes();
    injectSections();
    replaceFooterLocations();
    removeSelectedAwardBadges();
    removeFooterAwardsStrip();
    removeAwardsSections();
    removeReadyToScaleLogos();
    removeResidualAwardsRows();
    removeClutchReviewSources();
    injectCustomReviews();
    replacePartnerLogosAndTestimonials();
    replacePricingComparison();
    enforceAboutTanzaniaOnlyLocations();
    redesignHomeResultsSection();
    rewriteHomePageCopy();
    refreshBlogContent();
    rewriteServicePages();
    scheduleInject(250);
    scheduleInject(1200);
    setTimeout(replaceFooterLocations, 250);
    setTimeout(removeSelectedAwardBadges, 250);
    setTimeout(removeFooterAwardsStrip, 250);
    setTimeout(removeAwardsSections, 250);
    setTimeout(removeReadyToScaleLogos, 250);
    setTimeout(removeResidualAwardsRows, 250);
    setTimeout(removeClutchReviewSources, 250);
    setTimeout(injectCustomReviews, 250);
    setTimeout(replacePartnerLogosAndTestimonials, 250);
    setTimeout(replacePricingComparison, 250);
    setTimeout(enforceAboutTanzaniaOnlyLocations, 250);
    setTimeout(redesignHomeResultsSection, 250);
    setTimeout(rewriteHomePageCopy, 250);
    setTimeout(refreshBlogContent, 250);
    setTimeout(rewriteServicePages, 250);
  }

  window.addEventListener('load', function () {
    installLenisUnblockFix();
  });

  document.addEventListener('mouseenter', function (e) {
    if (
      e.target &&
      e.target.closest &&
      e.target.closest('.navbar_link-main.w-dropdown, .navbar_link-main.is-dekstop.w-dropdown')
    ) {
      scheduleInject(0);
    }
  }, true);

  document.addEventListener('click', function (e) {
    if (
      e.target &&
      e.target.closest &&
      e.target.closest('.navbar_dropdown-toggle, .navbar_control-btn')
    ) {
      scheduleInject(0);
      scheduleInject(120);
      setTimeout(replaceFooterLocations, 120);
      setTimeout(removeSelectedAwardBadges, 120);
      setTimeout(removeFooterAwardsStrip, 120);
      setTimeout(removeAwardsSections, 120);
      setTimeout(removeReadyToScaleLogos, 120);
      setTimeout(removeResidualAwardsRows, 120);
      setTimeout(removeClutchReviewSources, 120);
      setTimeout(injectCustomReviews, 120);
      setTimeout(replacePartnerLogosAndTestimonials, 120);
      setTimeout(replacePricingComparison, 120);
      setTimeout(enforceAboutTanzaniaOnlyLocations, 120);
      setTimeout(redesignHomeResultsSection, 120);
      setTimeout(rewriteHomePageCopy, 120);
      setTimeout(refreshBlogContent, 120);
      setTimeout(rewriteServicePages, 120);
    }
  }, { passive: true });
})();

