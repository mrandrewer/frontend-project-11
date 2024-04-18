import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  feed: yup.string().url().required(),
});

const validate = (state) => {
  schema.validate(state.form.fields, { abortEarly: false })
  .then(() => {
    if(state.feeds.includes(state.form.fields.feed)) {
      state.form.errors = { feed: {message: 'This feed is already added' } };
      state.form.state = 'invalid';
    } else {
      state.form.errors = { };
      state.form.state = 'valid';
    }
  })
  .catch((e) => {
    state.form.errors = _.keyBy(e.inner, 'path');
    state.form.state = 'invalid';
  });
};

export default validate;
