/* Bombus Lab - Internationalization (i18n)
   Supports: Spanish (es), English (en), Portuguese (pt) */

var translations = {
  es: {
    // Meta
    pageTitle: "Bombus Lab - Automatizacion con IA",
    metaDescription: "Automatizacion inteligente para tu negocio",

    // Header
    navChat: "Chat",
    navContacto: "Contacto",
    ctaConversemos: "Conversemos",

    // Hero
    heroHeadline: "Automatiza tu negocio con inteligencia artificial.",
    heroSubtitle: "Resultados de equipo. Velocidad de startup. Lo que tomaba meses, ahora toma dias.",
    heroCTAPrimary: "Conversemos",
    heroCTASecondary: "Conversemos",

    // Chat
    chatTitle: "Conversemos",
    chatPlaceholder: "Escribe tu mensaje...",
    chatDemoUser: "Como puedo automatizar mi negocio con IA?",
    chatDemoAssistant: "Puedo ayudarte a identificar procesos que consumen tiempo y disenar soluciones con IA. Cuentame sobre tu operacion.",

    // PDF
    pdfLoading: "Generando tu propuesta...",
    pdfReady: "Tu propuesta esta lista",
    pdfDownload: "Descargar Propuesta PDF",

    // Errors
    errorGeneric: "Algo salio mal. Intenta de nuevo.",
    errorUnavailable: "El chat no esta disponible. Escribe a hola@bombuslab.com.",
    errorRateLimit: "Demasiadas solicitudes. Espera unos segundos.",

    // Contacto
    contactHeadline: "HABLEMOS.",
    contactCTA: "INICIAR PROYECTO",

    // Footer
    footerPrivacy: "Privacidad"
  },

  en: {
    pageTitle: "Bombus Lab - AI Automation",
    metaDescription: "Intelligent automation for your business",

    navChat: "Chat",
    navContacto: "Contact",
    ctaConversemos: "Let's talk",

    heroHeadline: "Automate your business with artificial intelligence.",
    heroSubtitle: "Team results. Startup speed. What took months now takes days.",
    heroCTAPrimary: "Let's talk",
    heroCTASecondary: "Let's talk",

    chatTitle: "Let's talk",
    chatPlaceholder: "Type your message...",
    chatDemoUser: "How can I automate my business with AI?",
    chatDemoAssistant: "I can help you identify time-consuming processes and design AI solutions. Tell me about your operation.",

    pdfLoading: "Generating your proposal...",
    pdfReady: "Your proposal is ready",
    pdfDownload: "Download Proposal PDF",

    errorGeneric: "Something went wrong. Try again.",
    errorUnavailable: "Chat is unavailable. Email us at hola@bombuslab.com.",
    errorRateLimit: "Too many requests. Wait a few seconds.",

    contactHeadline: "LET'S TALK.",
    contactCTA: "START PROJECT",

    footerPrivacy: "Privacy"
  },

  pt: {
    pageTitle: "Bombus Lab - Automacao com IA",
    metaDescription: "Automacao inteligente para seu negocio",

    navChat: "Chat",
    navContacto: "Contato",
    ctaConversemos: "Vamos conversar",

    heroHeadline: "Automatize seu negocio com inteligencia artificial.",
    heroSubtitle: "Resultados de equipe. Velocidade de startup. O que levava meses, agora leva dias.",
    heroCTAPrimary: "Vamos conversar",
    heroCTASecondary: "Vamos conversar",

    chatTitle: "Vamos conversar",
    chatPlaceholder: "Digite sua mensagem...",
    chatDemoUser: "Como posso automatizar meu negocio com IA?",
    chatDemoAssistant: "Posso ajudar a identificar processos que consomem tempo e desenhar solucoes com IA. Me conte sobre sua operacao.",

    pdfLoading: "Gerando sua proposta...",
    pdfReady: "Sua proposta esta pronta",
    pdfDownload: "Baixar Proposta PDF",

    errorGeneric: "Algo deu errado. Tente novamente.",
    errorUnavailable: "Chat indisponivel. Escreva para hola@bombuslab.com.",
    errorRateLimit: "Muitas solicitacoes. Espere alguns segundos.",

    contactHeadline: "VAMOS CONVERSAR.",
    contactCTA: "INICIAR PROJETO",

    footerPrivacy: "Privacidade"
  }
};

function detectLanguage() {
  var browserLang = navigator.language || navigator.userLanguage;
  var langCode = browserLang.split('-')[0].toLowerCase();
  return translations[langCode] ? langCode : 'es';
}

function getCurrentLanguage() {
  var stored = localStorage.getItem('bombuslab_lang');
  if (stored && translations[stored]) return stored;
  return detectLanguage();
}

function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('bombuslab_lang', lang);
    applyTranslations(lang);
    return true;
  }
  return false;
}

function t(key) {
  var lang = getCurrentLanguage();
  return (translations[lang] && translations[lang][key]) || (translations.es && translations.es[key]) || key;
}

function applyTranslations(lang) {
  if (!lang) lang = getCurrentLanguage();
  var trans = translations[lang];
  if (!trans) return;

  document.documentElement.lang = lang;
  document.title = trans.pageTitle || 'Bombus Lab';

  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', trans.metaDescription || '');

  var ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', trans.metaDescription || '');

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (trans[key]) el.textContent = trans[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-placeholder');
    if (trans[key]) el.placeholder = trans[key];
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-alt');
    if (trans[key]) el.alt = trans[key];
  });
}

window.i18n = {
  translations: translations,
  detectLanguage: detectLanguage,
  getCurrentLanguage: getCurrentLanguage,
  setLanguage: setLanguage,
  t: t,
  applyTranslations: applyTranslations
};
