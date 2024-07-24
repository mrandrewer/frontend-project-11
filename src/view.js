/* eslint-disable no-param-reassign */

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

const initBaseContainerList = (container, title) => {
  container.innerHTML = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">${title}</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
    </div>`;
  return container.querySelector('ul');
};

const renderFeeds = (elements, state, i18nextInstance) => {
  const list = initBaseContainerList(elements.feedContainer, i18nextInstance.t('feedsTitle'));
  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.className = 'list-group-item border-0 border-end-0';
    const heading = document.createElement('h3');
    heading.className = 'h6 m-0';
    heading.innerText = feed.title;
    const para = document.createElement('p');
    para.className = 'm-0 small text-black-50';
    para.innerText = feed.description;
    li.append(heading, para);
    list.append(li);
  });
};

const renderPosts = (elements, state, i18nextInstance) => {
  const list = initBaseContainerList(elements.postsContainer, i18nextInstance.t('postsTitle'));
  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0';

    const link = document.createElement('a');
    link.className = state.ui.readPostsIds.has(post.id) ? 'fw-normal' : 'fw-bold';
    link.href = post.link;
    link.dataset.id = post.id;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerText = post.title;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-outline-primary btn-sm';
    btn.dataset.id = post.id;
    btn.dataset.bs_toggle = 'modal';
    btn.dataset.bs_target = '#modal';
    btn.innerText = i18nextInstance.t('feedsBtnText');

    li.append(link, btn);
    list.append(li);
  });
};

const renderModal = (elements, state, selectedPostId) => {
  const {
    modal,
    modalTitle,
    modalBody,
    modalLnkReadMore,
  } = elements;

  if (selectedPostId === undefined) {
    modal.classList.remove('show');
    modal.style = '';
    return;
  }

  const post = state.posts.find((p) => p.id === selectedPostId);
  const { title, description, href } = post;
  modalTitle.textContent = title;
  modalBody.textContent = description;
  modal.classList.add('show');
  modal.style = 'display:block';
  modalLnkReadMore.setAttribute('href', href);
};

const initView = (elements, state, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value);
      break;
    case 'feeds':
      renderFeeds(elements, state, i18nextInstance);
      break;
    case 'posts':
    case 'ui.readPostsIds':
      renderPosts(elements, state, i18nextInstance);
      break;
    case 'ui.selectedPostId':
      renderModal(elements, state, value);
      break;
    default:
      // do nothing
      break;
  }
};

export default initView;
