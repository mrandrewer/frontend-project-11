import * as yup from 'yup';

const validate = (state, i18nextInstance) => {
  const { form } = state;
  const schema = yup.object().shape({
    feed: yup.string().url().required().notOneOf(state.feeds),
  });
  schema.validate(state.form.fields, { abortEarly: false })
    .catch((e) => {
      form.errors = e.errors.map((error) => i18nextInstance.t(`errors.${error.key}`));
      form.state = 'invalid';
    });
};

export default validate;
