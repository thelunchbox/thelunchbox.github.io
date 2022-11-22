async function loadContent(file) {
  const result = await fetch(`./content/${file}.html`);
  return await result.text();
}

function resolveContent(raw) {
  const parsed = raw.split('{{').reduce((agg, code) => {
    return [
      ...agg,
      ...code.split('}}'),
    ];
  }, []);
  return parsed.map((code, i) => {
    if (i % 2 === 0) return code;
    return eval(code);
  }).join('')
}

async function loadSection(element, file, { header = true } = {}) {
  const rawContent = await loadContent(file);
  const content = resolveContent(rawContent);
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = content;
  if (header) {
    const headerDiv = document.createElement('h1');
    headerDiv.innerText = file;
    element.appendChild(headerDiv);
  }
  element.appendChild(contentDiv);
}

function loadTabSection(hash) {
  const hashToUse = hash || '#about';
  const tabs = Array.from(document.querySelectorAll('.menu>a'));
  tabs.forEach(t => t.classList.remove('selected'));
  const selectedTab = document.querySelector(`.menu>a[href='${hashToUse}']`);
  if (!selectedTab) return;
  selectedTab.classList.add('selected');
  const myBody = document.querySelector('.body');
  myBody.innerHTML = '';
  loadSection(myBody, hashToUse.substring(1), { header: false });
}

window.addEventListener('load', () => {
  const elements = Array.from(document.querySelectorAll('[data-content]'));
  elements.forEach(e => loadSection(e, e.getAttribute('data-content')));
  loadTabSection(document.location.hash);
});

window.addEventListener('hashchange', () => {
  loadTabSection(document.location.hash);
});

window.addEventListener('keydown', () => {

});
