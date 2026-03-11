(function () {
  let styleInjected = false;
  let injectTimer = null;

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
      '@media (min-width:992px){',
      '.navbar_dropmenu-desktop,.navbar_dropmenu-desktop-section-wrapper.is-services,.navbar_dropmenu.is-deskotp.w-dropdown-list{overflow:visible !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{display:grid !important;grid-template-columns:repeat(4,minmax(220px,1fr)) !important;column-gap:28px !important;row-gap:16px !important;min-width:0 !important;width:100% !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-section{width:auto !important;max-width:none !important;min-width:0 !important;flex:0 0 auto !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-link{width:100% !important;max-width:none !important;}',
      '.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropwmenu-link-text{min-width:0 !important;overflow-wrap:break-word;word-break:normal;}',
      '}',
      '@media (min-width:992px) and (max-width:1439px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(3,minmax(220px,1fr)) !important;}}',
      '@media (max-width:1279px){.navbar_dropmenu-desktop-section-wrapper.is-services .navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(2,minmax(220px,1fr)) !important;}}'
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
      scheduleInject(250);
      scheduleInject(1200);
      setTimeout(replaceFooterLocations, 250);
      setTimeout(removeSelectedAwardBadges, 250);
      setTimeout(removeFooterAwardsStrip, 250);
      setTimeout(removeAwardsSections, 250);
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
    scheduleInject(250);
    scheduleInject(1200);
    setTimeout(replaceFooterLocations, 250);
    setTimeout(removeSelectedAwardBadges, 250);
    setTimeout(removeFooterAwardsStrip, 250);
    setTimeout(removeAwardsSections, 250);
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
    }
  }, { passive: true });
})();

