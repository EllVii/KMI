const scriptures = {
  home: ['Commit your work to the Lord, and your plans will be established.', 'Proverbs 16:3'],
  about: ['For even the Son of Man did not come to be served, but to serve, and to give his life as a ransom for many.', 'Mark 10:45'],
  resources: ['And do not forget to do good and to share with others, for with such sacrifices God is pleased.', 'Hebrews 13:16'],
  edu: ['Let the wise hear and increase in learning.', 'Proverbs 1:5'],
  outreach: ['And do not forget to do good and to share with others, for with such sacrifices God is pleased.', 'Hebrews 13:16'],
  connect: ['Carry each other’s burdens, and in this way you will fulfill the law of Christ.', 'Galatians 6:2'],
  brochure: ['Write the vision; make it plain.', 'Habakkuk 2:2'],
  plans: ['It is required of stewards that they be found faithful.', '1 Corinthians 4:2'],
  timeline: ['For everything there is a season, and a time for every matter under heaven.', 'Ecclesiastes 3:1']
};

const page = document.body.dataset.page || 'home';
const siteUrl = 'https://ellvii.github.io/KMI';
const organizationName = 'Kingdom Missions International';
const organizationEmail = 'info@KingdomMissionsGlobal.org';
const publicPages = new Set(['home', 'about', 'resources', 'edu', 'outreach', 'connect']);

const seoPages = {
  home: {
    path: '/',
    title: 'Christian Ministry & Community Resources in Las Vegas | KMI',
    description: 'Kingdom Missions International is a Las Vegas-based Christian ministry providing community resources, education, food outreach, referrals, volunteer opportunities, and international mission support.',
    image: '/assets/media/home-hero-international-missions.webp',
    schemaType: 'WebPage',
    index: true
  },
  about: {
    path: '/about.html',
    title: 'About KMI | Christian Ministry Leaders, Mission & Values',
    description: 'Learn about Kingdom Missions International, servant leaders Marc and Helen, KMI’s Christian mission, vision, beliefs, core values, and commitment to serving communities.',
    image: '/assets/media/gallery-mission-relationship.webp',
    schemaType: 'AboutPage',
    index: true
  },
  resources: {
    path: '/resources.html',
    title: 'Las Vegas Community Resources & Faith-Based Referrals | KMI',
    description: 'Explore KMI community resources and referrals for housing, food distribution, scholarships, life coaching, biblical counseling, education, and pathways toward stability.',
    image: '/assets/media/ministry-food-packing.webp',
    schemaType: 'CollectionPage',
    index: true
  },
  edu: {
    path: '/edu.html',
    title: 'Faith-Based Education, Degrees & Certifications | KMI',
    description: 'Explore KMI faith-based education, degree pathways, chaplaincy, biblical counseling, and service-centered certification opportunities grounded in biblical principles.',
    image: '/assets/media/resources-community-teaching.webp',
    schemaType: 'CollectionPage',
    index: true
  },
  outreach: {
    path: '/outreach.html',
    title: 'Christian Outreach, Food Relief & Volunteer Opportunities | KMI',
    description: 'See KMI Christian outreach through Las Vegas food relief, volunteer service, community partnerships, fellowship, teaching, Los Angeles outreach, and international missions.',
    image: '/assets/media/gallery-youth-outreach.webp',
    schemaType: 'CollectionPage',
    index: true
  },
  connect: {
    path: '/connect.html',
    title: 'Get Help, Volunteer or Partner With KMI | Contact KMI',
    description: 'Connect with Kingdom Missions International to request community resource guidance, volunteer, form a ministry partnership, ask about education, or contact KMI.',
    image: '/assets/media/fellowship-community-meal.webp',
    schemaType: 'ContactPage',
    index: true
  },
  brochure: {
    path: '/brochure.html',
    title: 'KMI Ministry Brochure | Coming Soon',
    description: 'The Kingdom Missions International ministry brochure is being prepared.',
    image: '/assets/media/home-hero-international-missions.webp',
    schemaType: 'WebPage',
    index: false
  },
  plans: {
    path: '/plans.html',
    title: 'KMI Website Support Plans',
    description: 'Private website support and CRM planning information for Kingdom Missions International.',
    image: '/assets/media/home-hero-international-missions.webp',
    schemaType: 'WebPage',
    index: false,
    follow: false
  },
  timeline: {
    path: '/timeline.html',
    title: 'KMI Website Project Timeline',
    description: 'Private project timeline information for the Kingdom Missions International website.',
    image: '/assets/media/home-hero-international-missions.webp',
    schemaType: 'WebPage',
    index: false,
    follow: false
  },
  crm: {
    path: '/crm.html',
    title: 'KMI CRM Dashboard',
    description: 'Private CRM dashboard prototype for Kingdom Missions International.',
    image: '/assets/media/home-hero-international-missions.webp',
    schemaType: 'WebPage',
    index: false,
    follow: false
  }
};

const seo = seoPages[page] || seoPages.home;
const canonicalUrl = `${siteUrl}${seo.path}`;
const imageUrl = `${siteUrl}${seo.image}`;
const robotsValue = seo.index
  ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
  : `noindex,${seo.follow === false ? 'nofollow' : 'follow'},noarchive`;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

document.title = seo.title;
upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
upsertMeta('meta[name="robots"]', { name: 'robots', content: robotsValue });
upsertMeta('meta[name="author"]', { name: 'author', content: organizationName });
upsertMeta('meta[name="theme-color"]', { name: 'theme-color', content: '#2f271c' });
upsertLink('canonical', canonicalUrl);
upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: organizationName });
upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US' });
upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl });
upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: `${organizationName} ministry and community service` });
upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl });

if (seo.index) {
  const breadcrumbItems = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` }];
  if (page !== 'home') {
    breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: seo.title.split('|')[0].trim(), item: canonicalUrl });
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: organizationName,
        alternateName: 'KMI',
        url: `${siteUrl}/`,
        email: organizationEmail,
        logo: { '@type': 'ImageObject', url: `${siteUrl}/assets/logo.jpg` },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Las Vegas',
          addressRegion: 'NV',
          postalCode: '89183',
          addressCountry: 'US'
        },
        areaServed: ['Las Vegas, Nevada', 'Los Angeles, California', 'Philippines', 'International'],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'general inquiries',
          email: organizationEmail,
          availableLanguage: 'English'
        },
        description: 'A Las Vegas-based Christian ministry providing community resources, education, referrals, outreach, volunteer opportunities, and international mission support.'
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: organizationName,
        alternateName: 'KMI',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'en-US'
      },
      {
        '@type': seo.schemaType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#organization` },
        primaryImageOfPage: { '@type': 'ImageObject', url: imageUrl },
        breadcrumb: { '@id': `${canonicalUrl}#breadcrumb` },
        inLanguage: 'en-US'
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbItems
      }
    ]
  };

  let structuredDataElement = document.querySelector('#kmi-structured-data');
  if (!structuredDataElement) {
    structuredDataElement = document.createElement('script');
    structuredDataElement.type = 'application/ld+json';
    structuredDataElement.id = 'kmi-structured-data';
    document.head.appendChild(structuredDataElement);
  }
  structuredDataElement.textContent = JSON.stringify(structuredData);
}

if (!document.querySelector('.skip-link')) {
  const skipLink = document.createElement('a');
  skipLink.className = 'skip-link';
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  document.body.prepend(skipLink);
}

const main = document.querySelector('main');
if (main && !main.id) main.id = 'main-content';

const nav = document.querySelector('.nav-links');
document.querySelectorAll('a[data-nav="brochure"], .nav-links a[href$="brochure.html"]').forEach((link) => link.remove());
if (nav && publicPages.has(page) && !nav.querySelector('[data-nav="connect"]')) {
  const connectLink = document.createElement('a');
  connectLink.dataset.nav = 'connect';
  connectLink.href = 'connect.html';
  connectLink.textContent = 'Connect';
  connectLink.className = 'nav-primary-action';
  nav.appendChild(connectLink);
}

document.querySelectorAll('[data-nav]').forEach((link) => {
  link.classList.toggle('active', link.dataset.nav === page);
  if (link.dataset.nav === page) link.setAttribute('aria-current', 'page');
});

const navbar = document.querySelector('.navbar');
if (navbar && nav && publicPages.has(page) && !navbar.querySelector('.nav-menu-toggle')) {
  nav.id = nav.id || 'primary-navigation';
  nav.setAttribute('aria-label', nav.getAttribute('aria-label') || 'Primary navigation');
  const menuButton = document.createElement('button');
  menuButton.type = 'button';
  menuButton.className = 'nav-menu-toggle';
  menuButton.setAttribute('aria-controls', nav.id);
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';
  navbar.insertBefore(menuButton, nav);

  const closeMenu = () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.querySelector('[aria-hidden="true"]').textContent = '☰';
  };

  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.querySelector('[aria-hidden="true"]').textContent = isOpen ? '×' : '☰';
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

document.querySelectorAll('[data-scripture-card]').forEach((element) => {
  const scripture = scriptures[page] || scriptures.home;
  element.innerHTML = `<blockquote>“${escapeHtml(scripture[0])}”</blockquote><cite>${escapeHtml(scripture[1])}</cite>`;
});

const form = document.querySelector('#intakeForm');
const table = document.querySelector('#submissions');
const storageKey = 'kmiDemoSubmissions';

function renderSubmissions() {
  if (!table) return;
  const rows = JSON.parse(localStorage.getItem(storageKey) || '[]');
  table.innerHTML = rows.length
    ? rows.map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.email)}</td><td>${escapeHtml(row.interest)}</td><td>${escapeHtml(row.status)}</td></tr>`).join('')
    : '<tr><td colspan="4">No demo submissions yet.</td></tr>';
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const rows = JSON.parse(localStorage.getItem(storageKey) || '[]');
    rows.push({
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      interest: formData.get('interest') || '',
      status: 'New inquiry'
    });
    localStorage.setItem(storageKey, JSON.stringify(rows));
    form.reset();
    renderSubmissions();
  });
}
renderSubmissions();

const footerContainer = document.querySelector('.footer .container');
if (footerContainer && publicPages.has(page) && !footerContainer.querySelector('.footer-seo-nav')) {
  const footerNav = document.createElement('nav');
  footerNav.className = 'footer-seo-nav';
  footerNav.setAttribute('aria-label', 'KMI website links');
  footerNav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="about.html">About KMI</a>
    <a href="resources.html">Community Resources</a>
    <a href="edu.html">Education</a>
    <a href="outreach.html">Outreach & Volunteering</a>
    <a href="connect.html">Connect With KMI</a>`;
  footerContainer.prepend(footerNav);
}

document.querySelectorAll('.footer .mini').forEach((element) => {
  if (/Prototype by Ell Vii/i.test(element.textContent)) {
    element.textContent = "Website development and technical SEO by Ell Vii's Automations.";
  }
});

document.querySelectorAll('.footer img[src*="ellvii-logo-dark-background"]').forEach((image) => {
  image.style.width = '26px';
  image.style.height = '26px';
  image.style.objectFit = 'cover';
  image.style.borderRadius = '6px';
  image.style.background = 'transparent';
  image.style.padding = '0';
  image.style.verticalAlign = 'middle';
  image.style.boxShadow = 'none';
});

if (publicPages.has(page) && !document.querySelector('script[data-kmi-assistant]')) {
  const assistantScript = document.createElement('script');
  assistantScript.src = 'assets/chatbot.js';
  assistantScript.dataset.kmiAssistant = 'true';
  document.body.appendChild(assistantScript);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('video[autoplay]').forEach((video) => {
    video.pause();
    video.removeAttribute('autoplay');
  });
}
