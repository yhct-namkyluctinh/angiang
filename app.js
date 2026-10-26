(() => {
  const chapters = [...document.querySelectorAll('main details')];
  document.getElementById('expand')?.addEventListener('click', () => {
    chapters.forEach(chapter => { chapter.open = true; });
  });
  document.getElementById('collapse')?.addEventListener('click', () => {
    chapters.forEach(chapter => { chapter.open = false; });
  });

  const viewer = document.getElementById('lightbox');
  const viewerImage = viewer.querySelector('img');
  const viewerCaption = viewer.querySelector('p');
  let previousFocus = null;

  document.querySelectorAll('main figure img').forEach(image => {
    const figure = image.closest('figure');
    let control = image.closest('.photo');
    if (control?.tagName === 'A') {
      const button = document.createElement('button');
      button.className = control.className;
      button.append(...control.childNodes);
      control.replaceWith(button);
      control = button;
    } else if (!control) {
      control = document.createElement('button');
      control.className = 'photo';
      image.before(control);
      control.append(image);
    }
    control.type = 'button';
    control.setAttribute('aria-haspopup', 'dialog');
    const caption = figure.querySelector('figcaption')?.textContent.trim() || image.alt;
    control.setAttribute('aria-label', `Phóng to ảnh: ${caption}`);
    control.addEventListener('click', event => {
      event.preventDefault();
      previousFocus = control;
      viewerImage.src = image.currentSrc || image.src;
      viewerImage.alt = image.alt;
      viewerCaption.textContent = caption;
      if (!viewer.open) viewer.showModal();
    });
  });

  document.getElementById('close-lightbox').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const rect = viewer.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    previousFocus?.focus({ preventScroll: true });
  });

  function openLinkedChapter() {
    const chapter = chapters.find(item => `#${item.id}` === location.hash);
    if (chapter) chapter.open = true;
  }
  window.addEventListener('hashchange', openLinkedChapter);
  openLinkedChapter();
})();
