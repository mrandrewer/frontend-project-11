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
}

const renderFormState = (elements, state) => {
  switch(state) {
    case 'filling':
    case 'invalid':
      elements.submit.enabled = false;
      break;
    case 'valid':
        elements.submit.enabled = true;
        break;
    case 'submitted':
      elements.form.classList.remove('was-validated');
      elements.submit.enabled = false;
      elements.input.value = '';
      break;
  }
}

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
    case 'form.state':
      renderFormState(elements, value);
      break;
  }
};

export default initView;
