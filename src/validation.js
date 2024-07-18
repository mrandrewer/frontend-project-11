import * as yup from 'yup';

const validate = (state, i18nextInstance) => {
  const { form } = state;
  const schema = yup.object().shape({
    feed: yup.string().url().required().notOneOf(state.feeds.map((f) => f.link)),
  });
  schema.validate(state.form.fields, { abortEarly: false })
    .then(() => {
      form.errors = '';
      form.state = 'valid';
    })
    .catch((e) => {
      form.errors = e.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
      form.state = 'invalid';
    });
};

export default validate;
