import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import initView from './view.js';
import validate from './validation.js';
import resources from '../locales/index.js';
import yupLocale from '../locales/yupLocale.js';

export default () => {
  const state = {
    language: 'ru',
    form: {
      processState: '',
      fields: {
        feed: '',
      },
      filedsUi: {
        touched: {
          feed: false,
        },
      },
      errors: {},
    },
    feeds: [],
  };

  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: state.language,
    resources,
  });
  yup.setLocale(yupLocale);

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
  };

  const watchedState = onChange(state, initView(elements));

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.form.state = 'filling';
    const { value } = e.target;
    watchedState.form.fields.feed = value.trim();
    validate(watchedState, i18nextInstance);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (watchedState.form.fields.feed === '') {
      return;
    }
    watchedState.feeds.push(watchedState.form.fields.feed);
    watchedState.form.state = 'submitted';
    watchedState.form.fields.feed = '';
  });
};
