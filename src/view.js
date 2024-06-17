const renderErrorsHandler = (elements, errors) => {
  const errorMessage = errors.feed !== undefined
    ? errors.feed.message
    : errors.feed;
  if (errorMessage) {
    elements.form.classList.add('was-validated');
    elements.input.setCustomValidity(errorMessage);
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

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value);
      break;
    default:
      // do nothing
      break;
  }
};

export default initView;
