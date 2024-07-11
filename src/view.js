import { container } from "webpack";

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

const renderFeeds = (elements, feeds) => {
  const container = elements.feedContainer;
  container.innerHTML = `<div class="card border-0">
      <div class="card-body">
        <h2 class="card-title h4">Фиды</h2>
      </div>
      <ul class="list-group border-0 rounded-0">
      </ul>
    </div>`;
  const list = container.querySelector('ul');
  feeds.forEach(feed => {
    const feedHtml = `<li class="list-group-item border-0 border-end-0">
      <h3 class="h6 m-0">${feed.title}</h3>
      <p class="m-0 small text-black-50">${feed.description}</p>
    </li>`
    list.append(feedHtml);
  });

};

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value);
      break;
    case 'feeds':
      renderFeeds(elements, value);
    default:
      // do nothing
      break;
  }
};

export default initView;
