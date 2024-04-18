import initView from "./view.js"
import validate from "./validation.js";
import onChange from 'on-change';

export default () => {
  const state = {
    form: {
      processState: '',
      fields: {
        feed: ''
      },
      filedsUi: {
        touched:{
          feed: false,
        }
      },
      errors: {},
    },
    feeds: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    submit: document.querySelector('.rss-form button[type="submit"]'),
  }

  const watchedState = onChange(state, initView(elements));

  elements.input.addEventListener('input', (e) => {
    e.preventDefault();
    watchedState.form.state = 'filling';
    const { value } = e.target;
    watchedState.form.fields.feed = value.trim();
    validate(watchedState);
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (watchedState.form.fields.feed === '') {
      return;
    }
    watchedState.feeds.push(watchedState.form.fields.feed);
    watchedState.form.state = 'submitted';
    watchedState.form.fields.feed = ''
  });
}