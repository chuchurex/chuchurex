/* Bombus Lab - Main Application */

var API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:8002'
  : 'https://api.bombuslab.com';

/* =============================================================================
   HEADER SCROLL
   ============================================================================= */

(function () {
  var header = document.getElementById('header');
  if (!header) return;

  var lastScroll = 0;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }, { passive: true });
})();

/* =============================================================================
   SMOOTH SCROLL NAVIGATION
   ============================================================================= */

(function () {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* =============================================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================================= */

(function () {
  var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(function (el) {
    observer.observe(el);
  });
})();

/* =============================================================================
   CHAT FUNCTIONALITY
   ============================================================================= */

(function () {
  var chatInput = document.getElementById('chatInput');
  var chatSend = document.getElementById('chatSend');
  var chatMessages = document.getElementById('chatMessages');
  if (!chatInput || !chatSend || !chatMessages) return;

  var conversationHistory = [];
  var currentLang = (window.i18n && window.i18n.getCurrentLanguage) ? window.i18n.getCurrentLanguage() : 'es';

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatMessage(text) {
    text = escapeHtml(text);
    var paragraphs = text.split('\n\n');
    return paragraphs.map(function (p) {
      p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      p = p.replace(/\*(.*?)\*/g, '<em>$1</em>');
      p = p.replace(/\n/g, '<br>');
      return '<p>' + p + '</p>';
    }).join('');
  }

  function displayMessage(content, role) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message chat-message--' + role;

    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';

    if (role === 'assistant') {
      bubble.innerHTML = formatMessage(content);
    } else {
      bubble.textContent = content;
    }

    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    var indicator = document.createElement('div');
    indicator.className = 'chat-message chat-message--assistant';
    indicator.innerHTML = '<div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
  }

  function sendMessage(message) {
    conversationHistory.push({ role: 'user', content: message });
    displayMessage(message, 'user');

    var typing = showTypingIndicator();

    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, 30000);

    fetch(API_URL + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        history: conversationHistory.slice(-10),
        lang: currentLang
      }),
      signal: controller.signal
    })
    .then(function (response) {
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      typing.remove();
      conversationHistory.push({ role: 'assistant', content: data.response });
      displayMessage(data.response, 'assistant');
      if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
      }
      if (data.generate_pdf && data.pdf_url && data.pdf_url.indexOf('/download-proposal/') === 0) {
        displayPDFLink(data.pdf_url);
      }
    })
    .catch(function (error) {
      typing.remove();
      conversationHistory.pop();
      var errMsg = 'Ha ocurrido un error. Intenta nuevamente.';
      if (window.i18n && window.i18n.t) {
        errMsg = window.i18n.t('errorGeneric');
      }
      displayMessage(errMsg, 'assistant');
    });
  }

  function displayPDFLink(pdfUrl) {
    var msgDiv = document.createElement('div');
    msgDiv.className = 'chat-message chat-message--assistant';
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    var a = document.createElement('a');
    a.href = API_URL + pdfUrl;
    a.target = '_blank';
    a.download = '';
    a.textContent = (window.i18n && window.i18n.t) ? window.i18n.t('pdfDownload') : 'Descargar propuesta PDF';
    a.style.fontWeight = '600';
    bubble.appendChild(a);
    msgDiv.appendChild(bubble);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Auto-resize textarea
  chatInput.addEventListener('input', function () {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // Send on click
  chatSend.addEventListener('click', function () {
    var msg = chatInput.value.trim();
    if (!msg) return;
    chatInput.value = '';
    chatInput.style.height = 'auto';
    chatInput.disabled = true;
    chatSend.disabled = true;
    sendMessage(msg);
    setTimeout(function () {
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();
    }, 500);
  });

  // Send on Enter
  chatInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      chatSend.click();
    }
  });
})();

/* =============================================================================
   INITIALIZATION
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  if (window.i18n && window.i18n.applyTranslations) {
    var lang = window.i18n.getCurrentLanguage();
    window.i18n.applyTranslations(lang);
  }
});
