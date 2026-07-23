(() => {
  const providerId = 'https://ellviisautomations.com/#organization';
  const providerUrl = 'https://ellviisautomations.com/';
  const caseStudyUrl = 'https://ellviisautomations.com/case-studies/kmi/';
  const provider = {
    '@type': 'Organization',
    '@id': providerId,
    name: "Ell Vii's Automations",
    url: providerUrl,
    description: 'Website development, technical SEO, CRM, automation, and digital support provider.',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ellviisautomations.com/assets/icon/ellvii-logo-app-icon.png'
    }
  };

  const structuredDataElement = document.querySelector('#kmi-structured-data');
  if (structuredDataElement) {
    try {
      const structuredData = JSON.parse(structuredDataElement.textContent || '{}');
      const graph = Array.isArray(structuredData['@graph']) ? structuredData['@graph'] : [];

      if (!graph.some((item) => item && item['@id'] === providerId)) {
        graph.push(provider);
      }

      graph.forEach((item) => {
        if (!item || typeof item !== 'object') return;

        if (item['@type'] === 'WebSite') {
          item.creator = { '@id': providerId };
          item.provider = { '@id': providerId };
        }

        if (['WebPage', 'AboutPage', 'CollectionPage'].includes(item['@type'])) {
          item.creator = { '@id': providerId };
          item.provider = { '@id': providerId };
        }
      });

      structuredData['@graph'] = graph;
      structuredDataElement.textContent = JSON.stringify(structuredData);
    } catch (error) {
      console.warn('KMI structured-data provider connection could not be added.', error);
    }
  }

  const footerContainer = document.querySelector('.footer .container');
  if (footerContainer && !footerContainer.querySelector('.ellvii-seo-credit')) {
    const credit = document.createElement('p');
    credit.className = 'mini ellvii-seo-credit';
    credit.innerHTML = `Website development, technical SEO, and digital support by <a href="${caseStudyUrl}" target="_blank" rel="noopener">Ell Vii's Automations</a>.`;
    footerContainer.appendChild(credit);
  }

  if (!document.querySelector('#ellvii-seo-credit-styles')) {
    const style = document.createElement('style');
    style.id = 'ellvii-seo-credit-styles';
    style.textContent = `
      .ellvii-seo-credit {
        margin-top: 12px;
        line-height: 1.55;
      }
      .ellvii-seo-credit a {
        color: #f8e8a5;
        font-weight: 800;
        text-decoration: none;
      }
      .ellvii-seo-credit a:hover,
      .ellvii-seo-credit a:focus-visible {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }
})();
