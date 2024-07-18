
const renderErrorsHandler = (elements, errors) => {
  const errorMessage = errors !== undefined && errors.length > 0;
  if (errorMessage) {
    elements.form.classList.add('was-validated');
    elements.input.setCustomValidity(errors);
    elements.input.reportValidity();
  } else {
    elements.form.classList.add('was-validated');
    elements.input.setCustomValidity('');
    elements.input.reportValidity();
  }
};

const renderFormState = (elements, state) => {
  const elems = elements;
  switch (state) {
    case 'filling':
    case 'invalid':
      elems.submit.enabled = false;
      break;
    case 'valid':
      elems.submit.enabled = true;
      break;
    case 'submitted':
      elems.form.classList.remove('was-validated');
      elems.submit.enabled = false;
      elems.input.value = '';
      break;
    default:
      throw new Error('Unknkown form state');
  }
};

const renderFeeds = (elements, i18nextInstance, feeds) => {
  const container = elements.feedContainer;
  container.innerHTML = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18nextInstance.t('feedsTitle')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
    </div>`;
  const list = container.querySelector('ul');
  feeds.forEach(feed => {
    const li = document.createElement('li');
    li.className = 'list-group-item border-0 border-end-0';
    li.innerHTML= `<h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>`
    list.append(li);
  });

};

const renderPosts = (elements, i18nextInstance, posts) => {
  const container = elements.postsContainer;
  container.innerHTML = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${i18nextInstance.t('postsTitle')}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
    </div>`;
  const list = container.querySelector('ul');
  posts.forEach(post => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';
    li.innerHTML= `<a href="http://example.com/test/1721066340" class="fw-bold" data-id="2" target="_blank" rel="noopener noreferrer">${post.title}</a>
      <button type="button" class="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal" data-bs-target="#modal">${i18nextInstance.t('feedsBtnText')}</button>`
    list.append(li);
  });   
}

const initView = (elements, i18nextInstance) => (path, value) => {
  console.log(path);
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value);
      break;
    case 'feeds':
      renderFeeds(elements, i18nextInstance, value);
    case 'posts':
        renderPosts(elements, i18nextInstance, value);
    default:
      // do nothing
      break;
  }
};

export default initView;
