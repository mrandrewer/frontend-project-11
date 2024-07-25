/* eslint-disable no-param-reassign */

const renderFeedback = (elements, feedbackState, text) => {
  const { feedback } = elements;
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  feedback.classList.remove('text-warning');
  switch (feedbackState) {
    case 'success':
      feedback.classList.add('text-success');
      feedback.textContent = text;
      break;
    case 'warn':
      feedback.classList.add('text-warning');
      feedback.textContent = text;
      break;
    case 'error':
      feedback.classList.add('text-danger');
      feedback.textContent = text;
      break;
    default:
      feedback.textContent = '';
  }
};

const renderErrors = (elements, errors) => {
  const errorMessage = errors !== undefined && errors.length > 0;
  if (errorMessage) {
    elements.form.classList.add('was-validated');
    elements.input.setCustomValidity(errors);
    elements.input.reportValidity();
    renderFeedback(elements, 'error', errors.join(', '));
  } else {
    elements.form.classList.add('was-validated');
    elements.input.setCustomValidity('');
    elements.input.reportValidity();
    renderFeedback(elements, 'error', '');
  }
};

const renderFormState = (elements, state, i18nextInstance) => {
  switch (state) {
    case 'filling':
    case 'invalid':
      elements.submit.enabled = false;
      break;
    case 'valid':
      elements.submit.enabled = true;
      break;
    case 'sending':
      renderFeedback(elements, 'warn', i18nextInstance.t('formStateHint.sending'));
      break;
    case 'success':
      elements.form.classList.remove('was-validated');
      elements.submit.enabled = false;
      elements.input.value = '';
      renderFeedback(elements, 'success', i18nextInstance.t('formStateHint.success'));
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
      renderErrors(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value, i18nextInstance);
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
