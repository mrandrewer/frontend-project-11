import * as yup from 'yup';
import _ from 'lodash';

const schema = yup.object().shape({
  feed: yup.string().url().required(),
});

const validate = (state) => {
  schema.validate(state.form.fields, { abortEarly: false })
  .catch((e) => {
    const error =  _.keyBy(e.inner, 'path')
    state.form.errors = { error };
  });
};

export default validate;
