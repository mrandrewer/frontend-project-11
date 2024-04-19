import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  feed: yup.string().url().required(),
});

const validate = (state) => {
  const { form } = state;
  schema.validate(state.form.fields, { abortEarly: false })
    .then(() => {
      if (state.feeds.includes(state.form.fields.feed)) {
        form.errors = { feed: { message: 'This feed is already added' } };
        form.state = 'invalid';
      } else {
        form.errors = { };
        form.state = 'valid';
      }
    })
    .catch((e) => {
      form.errors = _.keyBy(e.inner, 'path');
      form.state = 'invalid';
    });
};

export default validate;
