(function () {
  function ensureStyle() {
    if (document.getElementById('site-fixes-services-style')) return;
    const style = document.createElement('style');
    style.id = 'site-fixes-services-style';
    style.textContent = [
      'html,body{max-width:100%;overflow-x:hidden;}',
      'img{max-width:100%;height:auto;}',
      '@media (min-width:992px){',
      '.navbar_dropmenu-desktop,.navbar_dropmenu-desktop-section-wrapper.is-services,.navbar_dropmenu.is-deskotp.w-dropdown-list{overflow:visible !important;}',
      '.navbar_dropmenu-desktop-section.is-3-col{display:grid !important;grid-template-columns:repeat(5,minmax(170px,1fr)) !important;column-gap:20px !important;row-gap:14px !important;min-width:min(1500px,calc(100vw - 120px));}',
      '.navbar_dropmenu-desktop-section.is-3-col>.navbar_dropmenu-section{min-width:0;}',
      '}',
      '@media (min-width:992px) and (max-width:1439px){.navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(4,minmax(170px,1fr)) !important;min-width:min(1300px,calc(100vw - 80px));}}',
      '@media (max-width:1279px){.navbar_dropmenu-desktop-section.is-3-col{grid-template-columns:repeat(3,minmax(160px,1fr)) !important;min-width:100% !important;}}'
    ].join('');
    document.head.appendChild(style);
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

    links.forEach((item) => {
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
    return Array.from(labels).some((n) => n.textContent.trim().toLowerCase() === name.toLowerCase());
  }

  function injectSections() {
    ensureStyle();

    const dropdowns = document.querySelectorAll('.navbar_link-main.w-dropdown, .navbar_link-main.is-dekstop.w-dropdown');

    dropdowns.forEach((dropdown) => {
      const titleNode = dropdown.querySelector('.navbar_dropdown-toggle .navbar_link-title');
      if (!titleNode || titleNode.textContent.trim().toLowerCase() !== 'services') return;

      const desktopContainer = dropdown.querySelector('.navbar_dropmenu-desktop-section.is-3-col');
      if (desktopContainer) {
        if (!hasSection(desktopContainer, 'Cybersecurity')) {
          desktopContainer.appendChild(createSection('Cybersecurity', cyberLinks, true));
        }
        if (!hasSection(desktopContainer, 'Civil Engineering')) {
          desktopContainer.appendChild(createSection('Civil Engineering', civilLinks, true));
        }
      }

      const mobileContainer = dropdown.querySelector('.navbar_dropmenu.w-dropdown-list');
      if (mobileContainer) {
        if (!hasSection(mobileContainer, 'Cybersecurity')) {
          mobileContainer.appendChild(createSection('Cybersecurity', cyberLinks, false));
        }
        if (!hasSection(mobileContainer, 'Civil Engineering')) {
          mobileContainer.appendChild(createSection('Civil Engineering', civilLinks, false));
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSections);
  } else {
    injectSections();
  }

  document.addEventListener('mouseover', function (e) {
    if (e.target && e.target.closest && e.target.closest('.navbar_link-main.w-dropdown, .navbar_link-main.is-dekstop.w-dropdown')) {
      injectSections();
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest && e.target.closest('.navbar_dropdown-toggle, .navbar_control-btn')) {
      setTimeout(injectSections, 0);
      setTimeout(injectSections, 120);
    }
  });

  const observer = new MutationObserver(function () {
    injectSections();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
