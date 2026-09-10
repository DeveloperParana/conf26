// Modo preview: acessando a página com "?preview=1" na URL, Palestrantes e
// Patrocínio usam os arquivos .mock.json (dados fictícios) em vez dos reais.
// Útil pra mostrar o site "cheio" pra validação, sem mexer nos dados de verdade.
function dataUrl(name) {
  const isPreview = new URLSearchParams(location.search).has('preview');
  const mockable = ['speakers', 'sponsors'];
  return isPreview && mockable.includes(name) ? `data/${name}.mock.json` : `data/${name}.json`;
}

// Botões que apontam pra ingressos/CFP/e-mail de contato: URL vem de data/config.js
/* global CONFIG */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-link="tickets"]').forEach((link) => {
    link.href = CONFIG.ticketsUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  });
  document.querySelectorAll('[data-link="cfp"]').forEach((link) => {
    link.href = CONFIG.cfpUrl;
    link.target = '_blank';
    link.rel = 'noopener';
  });
  document.querySelectorAll('[data-link="contact-email"]').forEach((link) => {
    link.href = CONFIG.contactEmail ? `mailto:${CONFIG.contactEmail}` : '#';
  });
  document.querySelectorAll('[data-text="contact-email"]').forEach((el) => {
    el.textContent = CONFIG.contactEmail || '[e-mail de contato]';
  });
});

// Menu mobile do header
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.header__menu-toggle');
  const mobileNav = document.querySelector('.header__mobile-nav');

  if (!toggle || !mobileNav) return;

  const closeMenu = () => {
    mobileNav.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = !mobileNav.hidden;
    mobileNav.hidden = isOpen;
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
});

// Hero: destaques ("1 palco" / "7 palestras" / "conexões reais") alternam
// a cada 2s, em loop. Respeita quem prefere menos animação na tela.
document.addEventListener('DOMContentLoaded', () => {
  const lines = document.querySelectorAll('.hero__highlight-line');
  if (!lines.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let current = [...lines].findIndex((line) => line.classList.contains('hero__highlight-line--active'));
  if (current === -1) current = 0;

  setInterval(() => {
    lines[current].classList.remove('hero__highlight-line--active');
    current = (current + 1) % lines.length;
    lines[current].classList.add('hero__highlight-line--active');
  }, 2000);
});

// Seção Programação: linhas carregadas de data/schedule.json
async function initProgramacao() {
  const list = document.querySelector('.programacao__list');
  if (!list) return;

  try {
    const response = await fetch(dataUrl('schedule'));
    const schedule = await response.json();

    list.innerHTML = schedule.map((item) => `
      <div class="programacao__row${item.highlight ? ' programacao__row--lunch' : ''}">
        <div class="programacao__time">${item.time}</div>
        <div>
          <div class="programacao__title">${item.title}</div>
          <div class="programacao__desc">${item.description}</div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.warn('Não foi possível carregar data/schedule.json. Sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

// Seção Palestrantes: o heading e o texto de apoio ficam sempre no ar.
// Os cards abaixo saem de data/speakers.json. Sem nenhum confirmado, não renderiza nada.
async function initPalestrantes() {
  const cardsContainer = document.querySelector('.palestrantes__cards');
  if (!cardsContainer) return;

  try {
    const response = await fetch(dataUrl('speakers'));
    const speakers = await response.json();
    if (speakers.length === 0) return;

    const socialLink = (label, url) => url
      ? `<a href="${url}" target="_blank" rel="noopener" class="palestrantes__card-link">${label} ↗</a>`
      : '';

    cardsContainer.innerHTML = speakers.map((speaker) => {
      // Placeholder ("placeholder": true no JSON): card tracejado, só o nome,
      // pra segurar o lugar enquanto o line-up não fecha.
      const isPlaceholder = Boolean(speaker.placeholder);
      const photo = speaker.foto
        ? `<img src="${speaker.foto}" alt="">`
        : (isPlaceholder ? '' : '<span>foto</span>');
      const links = [
        socialLink('LinkedIn', speaker.linkedin),
        socialLink('Instagram', speaker.instagram),
      ].filter(Boolean).join('');

      return `
        <div class="palestrantes__card${isPlaceholder ? ' palestrantes__card--placeholder' : ''}">
          <div class="palestrantes__card-photo">${photo}</div>
          <div class="palestrantes__card-name">${speaker.nome}</div>
          ${speaker.cargo ? `<div class="palestrantes__card-role">${speaker.cargo}</div>` : ''}
          ${speaker.empresa ? `<div class="palestrantes__card-company">${speaker.empresa}</div>` : ''}
          ${links ? `<div class="palestrantes__card-links">${links}</div>` : ''}
        </div>
      `;
    }).join('');
  } catch (error) {
    console.warn('Não foi possível carregar data/speakers.json. Sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

// Seção Patrocínio: estado "em breve" ou logos por tier, conforme data/sponsors.json.
// Sem patrocinador nenhum, o bloco "Patrocinadores confirmados" (com as vagas
// tracejadas) some também, fica só o convite pra patrocinar.
async function initPatrocinio() {
  const soonState = document.querySelector('.patrocinio__state[data-state="em-breve"]');
  const filledState = document.querySelector('.patrocinio__state[data-state="populado"]');
  const groupsContainer = document.querySelector('.patrocinio__groups--populated');
  const confirmedBlock = document.querySelector('.patrocinio__confirmed');
  if (!soonState || !filledState || !groupsContainer) return;

  try {
    const response = await fetch(dataUrl('sponsors'));
    const sponsors = await response.json();

    if (sponsors.length === 0) {
      if (confirmedBlock) confirmedBlock.hidden = true;
      return;
    }

    const tiers = [
      { key: 'ouro', label: 'Ouro' },
      { key: 'prata', label: 'Prata' },
      { key: 'bronze', label: 'Bronze / Apoio e comunidades' },
    ];

    groupsContainer.innerHTML = tiers.map((tier) => {
      const tierSponsors = sponsors.filter((sponsor) => sponsor.tier === tier.key);
      if (tierSponsors.length === 0) return '';

      const slots = tierSponsors.map((sponsor) => `
        <a href="${sponsor.url}" target="_blank" rel="noopener" class="patrocinio__slot patrocinio__slot--filled">
          ${sponsor.logo ? `<img src="${sponsor.logo}" alt="${sponsor.nome}">` : `<span>${sponsor.nome}</span>`}
        </a>
      `).join('');

      return `
        <div>
          <div class="patrocinio__group-header">
            <span class="patrocinio__group-label">${tier.label}</span>
            <span class="patrocinio__group-line"></span>
          </div>
          <div class="patrocinio__slots patrocinio__slots--${tier.key}">${slots}</div>
        </div>
      `;
    }).join('');

    soonState.hidden = true;
    filledState.hidden = false;
  } catch (error) {
    console.warn('Não foi possível carregar data/sponsors.json. Sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

// Seção FAQ: perguntas carregadas de data/faq.json
async function initFaq() {
  const list = document.querySelector('.faq__list');
  if (!list) return;

  try {
    const response = await fetch(dataUrl('faq'));
    const faq = await response.json();

    list.innerHTML = faq.map((item) => `
      <details class="faq__item">
        <summary class="faq__question">${item.question}</summary>
        <p class="faq__answer">${item.answer}</p>
      </details>
    `).join('');
  } catch (error) {
    console.warn('Não foi possível carregar data/faq.json. Sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProgramacao();
  initPalestrantes();
  initPatrocinio();
  initFaq();
});
