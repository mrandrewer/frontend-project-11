import * as yup from 'yup';
import _ from 'lodash';

const validate = (state) => {
  const { form } = state;
  const schema = yup.object().shape({
    feed: yup.string().url().required().notOneOf(state.feeds),
  });
  schema.validate(state.form.fields, { abortEarly: false })
    .catch((e) => {
      form.errors = _.keyBy(e.inner, 'path');
      form.state = 'invalid';
    });
};

export default validate;
