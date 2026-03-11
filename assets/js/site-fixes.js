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
      '@media (max-width:991px){.elite-custom-reviews{margin:40px auto;}.elite-custom-reviews__grid{grid-template-columns:1fr;}}',
      '@media (min-width:992px){',
      '.navbar_dropmenu-desktop,.navbar_dropmenu-desktop-section-wrapper.is-services,.navbar_dropmenu.is-deskotp.w-dropdown-list{overflow:visible !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{display:grid !important;grid-template-columns:repeat(4,minmax(220px,1fr)) !important;column-gap:28px !important;row-gap:16px !important;min-width:0 !important;width:100% !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-section{width:auto !important;max-width:none !important;min-width:0 !important;flex:0 0 auto !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-link{width:100% !important;max-width:none !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropwmenu-link-text{min-width:0 !important;overflow-wrap:break-word;word-break:normal;}',
      '}',
      '@media (min-width:992px) and (max-width:1439px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(3,minmax(220px,1fr)) !important;}}',
      '@media (max-width:1279px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(2,minmax(220px,1fr)) !important;}}',
      '.section_services-awards,.services-page-awards_cards,.services-page_awards-wrapper,.services-page_show-more,.home-ready-to-scale__logos,.works-match_awards,.works-match_awards-card{display:none !important;}'
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

    const dropdowns = document.querySelectorAll('.navbar_link-main.w-dropdown, .navbar_link-main.is-dekstop.w-dropdown');

    dropdowns.forEach(function (dropdown) {
      const titleNode = dropdown.querySelector('.navbar_dropdown-toggle .navbar_link-title');
      if (!titleNode || titleNode.textContent.trim().toLowerCase() !== 'services') return;

      const desktopContainer = dropdown.querySelector('.navbar_dropmenu-desktop-section.is-3-col');
      if (desktopContainer) {
        removeSection(desktopContainer, 'Branding');

        if (!hasSection(desktopContainer, 'Cybersecurity')) {
          desktopContainer.appendChild(createSection('Cybersecurity', cyberLinks, true));
        }
        if (!hasSection(desktopContainer, 'Civil Engineering')) {
          desktopContainer.appendChild(createSection('Civil Engineering', civilLinks, true));
        }
      }

      const mobileContainer = dropdown.querySelector('.navbar_dropmenu.w-dropdown-list');
      if (mobileContainer) {
        removeSection(mobileContainer, 'Branding');

        if (!hasSection(mobileContainer, 'Cybersecurity')) {
          mobileContainer.appendChild(createSection('Cybersecurity', cyberLinks, false));
        }
        if (!hasSection(mobileContainer, 'Civil Engineering')) {
          mobileContainer.appendChild(createSection('Civil Engineering', civilLinks, false));
        }
      }
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

    const mapInteractive = document.querySelector('.cp-location_map-wrapper.is-interactive');
    if (mapInteractive) {
      mapInteractive.style.display = 'none';
    }

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
    }
  }, { passive: true });
})();

