const renderErrorsHandler = (elements, errors) => {
  const errorMessage = errors.error.feed !== undefined
    ? errors.error.feed.message
    : errors.error.feed;
    if (errorMessage) {
      elements.form.classList.add('was-validated');
      elements.input.setCustomValidity(errorMessage);
      elements.input.reportValidity(false);
    } else {
      elements.form.classList.add('was-validated');
      elements.input.setCustomValidity(null);
      elements.input.reportValidity(true);
    }
}

const initView = (elements) => (path, value) => {
  switch (path) {
    case 'form.errors':
      renderErrorsHandler(elements, value);
      break;
  }
};

export default initView;
