// Selecciona todos los elementos que deben aparecer con efecto
const faders = document.querySelectorAll('.fade-in-up');
const nav = document.querySelector('.navegacion');
const stickyOffset = nav.offsetTop;

if ('IntersectionObserver' in window) {
  const options = {
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px"
  };

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  faders.forEach(el => obs.observe(el));
} else {
  // Fallback simple: si no soporta IntersectionObserver, mostramos todo
  faders.forEach(el => el.classList.add('show'));
}

window.addEventListener('scroll', () => {
  if (window.pageYOffset > stickyOffset) {
    nav.style.position = 'fixed';
    nav.style.top = '0';
    nav.style.width = '100%'; // importante para que no se achique
    nav.style.zIndex = '9999';
  } else {
    nav.style.position = 'sticky';
    nav.style.top = '0';
    nav.style.width = 'auto';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  // Fade-in IntersectionObserver
  const faders = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window) {
    const options = { threshold: 0.25, rootMargin: "0px 0px -10% 0px" };
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    faders.forEach(el => obs.observe(el));
  } else {
    faders.forEach(el => el.classList.add('show'));
  }

  // Sticky navigation
  const nav = document.querySelector('.navegacion');
  const stickyOffset = nav.offsetTop;
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > stickyOffset) {
      nav.style.position = 'fixed';
      nav.style.top = '0';
      nav.style.width = '100%';
      nav.style.zIndex = '9999';
    } else {
      nav.style.position = 'static';
      nav.style.width = 'auto';
      nav.style.zIndex = 'auto';
    }
  });

  // Tipeo texto que respeta etiquetas HTML
  const typingElement = document.getElementById("typing");
  if(typingElement) {
    const fullText = typingElement.innerHTML;
    typingElement.innerHTML = "";
    let i = 0;
    function type() {
      if (i < fullText.length) {
        if (fullText[i] === "<") {
          let tagEnd = fullText.indexOf(">", i);
          if (tagEnd === -1) tagEnd = i;
          typingElement.innerHTML += fullText.substring(i, tagEnd + 1);
          i = tagEnd + 1;
        } else {
          typingElement.innerHTML += fullText[i];
          i++;
        }
        setTimeout(type, 80);
      }
    }
    type();
  }

  // Tipeo código con resaltado simple y números de línea
  const codeString = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>EvenCloud Demo</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header>
    <h1>Bienvenido a EvenCloud</h1>
  </header>
  <main>
    <p>Crea, innova y escala con nosotros.</p>
  </main>
</body>
</html>`;

  const escapeHtml = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  function applyHighlight(html) {
    html = html.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="comment">$1</span>');
    html = html.replace(/(&lt;\/?)([a-zA-Z0-9\-]+)([^&gt;]*?)(&gt;)/g, (m,prefix,name,rest,suf) => {
      let r = rest.replace(/([\w-:]+)(\s*=\s*)(".*?"|'.*?')/g,
        '<span class="attr">$1</span><span class="equals">$2</span><span class="string">$3</span>');
      return `${prefix}<span class="name">${name}</span>${r}${suf}`;
    });
    return html;
  }

  const output = document.getElementById('codeOutput');
  const numbers = document.querySelector('.line-numbers');

  if (output && numbers) {
    const escaped = escapeHtml(codeString);
    let i = 0;
    const speed = 18;
    let current = '';

    function updateLineNumbers(text) {
      const lines = text.split('\n').length;
      let cols = '';
      for (let n=1; n<=Math.max(lines,6); n++) {
        cols += n + '\n';
      }
      numbers.textContent = cols;
    }

    function step() {
      if (i <= escaped.length) {
        current = escaped.slice(0, i);
        const highlighted = applyHighlight(current);
        output.innerHTML = highlighted + '<span class="cursor" aria-hidden></span>';
        updateLineNumbers(current);
        i++;
        setTimeout(step, speed);
      } else {
        const cursor = output.querySelector('.cursor');
        if (cursor) cursor.remove();
      }
    }

    setTimeout(step, 200);
  }
});
