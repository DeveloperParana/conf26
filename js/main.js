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
    console.warn('Não foi possível carregar data/schedule.json — sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

// Seção Palestrantes: estado "em breve" ou grid populado, conforme data/speakers.json.
// Sem palestrante nenhum, os 4 cards fantasma também somem — só ficam heading/CTAs.
async function initPalestrantes() {
  const soonState = document.querySelector('.palestrantes__state[data-state="em-breve"]');
  const filledState = document.querySelector('.palestrantes__state[data-state="populado"]');
  const cardsContainer = document.querySelector('.palestrantes__cards');
  const listContainer = document.querySelector('.palestrantes__list');
  const ghostGrid = document.querySelector('.palestrantes__ghost-grid');
  if (!soonState || !filledState || !cardsContainer) return;

  try {
    const response = await fetch(dataUrl('speakers'));
    const speakers = await response.json();

    if (speakers.length === 0) {
      if (ghostGrid) ghostGrid.hidden = true;
      return;
    }

    cardsContainer.innerHTML = speakers.map((speaker) => `
      <a href="${speaker.linkedin}" target="_blank" rel="noopener" class="palestrantes__card">
        <div class="palestrantes__card-photo">${speaker.foto ? `<img src="${speaker.foto}" alt="">` : '<span>foto</span>'}</div>
        <div class="palestrantes__card-name">${speaker.nome}</div>
        <div class="palestrantes__card-role">${speaker.cargo}</div>
        <div class="palestrantes__card-company">${speaker.empresa}</div>
        <div class="palestrantes__card-linkedin">LinkedIn ↗</div>
      </a>
    `).join('');

    // Mesmos dados, lista compacta pro celular (css/palestrantes.css troca qual aparece)
    if (listContainer) {
      listContainer.innerHTML = speakers.map((speaker) => `
        <a href="${speaker.linkedin}" target="_blank" rel="noopener" class="palestrantes__list-row">
          <div class="palestrantes__list-photo">${speaker.foto ? `<img src="${speaker.foto}" alt="">` : '<span>foto</span>'}</div>
          <div class="palestrantes__list-info">
            <div class="palestrantes__list-name">${speaker.nome}</div>
            <div class="palestrantes__list-role">${speaker.cargo}</div>
          </div>
          <div class="palestrantes__list-meta">
            <div class="palestrantes__list-company">${speaker.empresa}</div>
            <div class="palestrantes__list-linkedin">LinkedIn ↗</div>
          </div>
        </a>
      `).join('');
    }

    soonState.hidden = true;
    filledState.hidden = false;
  } catch (error) {
    console.warn('Não foi possível carregar data/speakers.json — sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

// Seção Patrocínio: estado "em breve" ou logos por tier, conforme data/sponsors.json.
// Sem patrocinador nenhum, o bloco "Patrocinadores confirmados" (com as vagas
// tracejadas) some também — fica só o convite pra patrocinar.
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
    console.warn('Não foi possível carregar data/sponsors.json — sirva o site por um servidor local (ex.: python3 -m http.server).', error);
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
    console.warn('Não foi possível carregar data/faq.json — sirva o site por um servidor local (ex.: python3 -m http.server).', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProgramacao();
  initPalestrantes();
  initPatrocinio();
  initFaq();
});
