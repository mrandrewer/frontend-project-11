import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import initView from './view.js';
import validate from './validation.js';
import resources from '../locales/index.js';
import yupLocale from '../locales/yupLocale.js';
import { addRss, checkRssUpdate } from './rss.js';

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
    ui: {
      readPostsIds: new Set(),
      selectedPostId: undefined,
    },
    feeds: [],
    posts: [],
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
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedContainer: document.querySelector('.feeds'),
    modal: document.getElementById('modal'),
    modalTitle: document.querySelector('#modal .modal-title'),
    modalBody: document.querySelector('#modal .modal-body'),
    modalBtnsClose: document.querySelectorAll('#modal button[data-bs-dismiss="modal"]'),
    modalLnkReadMore: document.querySelector('#modal .full-article'),
  };

  const watchedState = onChange(state, initView(elements, state, i18nextInstance));

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
    addRss(watchedState.form.fields.feed, watchedState, i18nextInstance);
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const selectedPostId = e.target.dataset.id;
    if (selectedPostId) {
      watchedState.ui.selectedPostId = selectedPostId;
      watchedState.ui.readPostsIds.add(selectedPostId);
    }
  });

  elements.modalBtnsClose.forEach((btn) => {
    btn.addEventListener('click', () => {
      watchedState.ui.selectedPostId = undefined;
    });
  });

  checkRssUpdate(watchedState);
};
