import _ from 'lodash';
import axios from 'axios';

const urls = {
  proxyAllowAll: 'https://allorigins.hexlet.app/get?disableCache=true&charset=ISO-8859-1&url=',
};

const parseRssItem = (feedId, rssItem) => ({
  title: rssItem.querySelector('title').textContent,
  description: rssItem.querySelector('description').textContent,
  link: rssItem.querySelector('link').textContent,
  id: _.uniqueId(),
  feedId,
});

const parseRssData = (rssContent) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(rssContent, 'application/xml');

  const parseError = xml.querySelector('parsererror');
  if (parseError) {
    const error = new Error('notRss');
    error.isParsingError = true;
    throw error;
  }

  const feedId = _.uniqueId();
  return {
    feed: {
      id: feedId,
      title: xml.querySelector('title').textContent,
      description: xml.querySelector('description').textContent,
    },
    posts: Array.from(xml.querySelectorAll('item')).map((i) => parseRssItem(feedId, i)),
  };
};

const getRss = (link) => axios.get(urls.proxyAllowAll + encodeURIComponent(link))
  .then((response) => {
    if (response.status === 200) return response.data.contents;
    throw new Error('networkError');
  })
  .then((feedData) => {
    const data = parseRssData(feedData);
    data.feed.link = link;
    return data;
  });

const addRss = (link, state, i18nextInstance) => {
  const localState = state;
  localState.form.state = 'sending';
  getRss(link)
    .then((data) => {
      localState.feeds = [...localState.feeds, data.feed];
      localState.posts = [...data.posts, ...localState.posts];
      localState.form.state = 'success';
      localState.form.fields.feed = '';
    })
    .catch((error) => {
      console.error(`Error fetching data from feed ${link}:`, error);
      localState.form.state = 'valid';
      if (axios.isAxiosError(error)) {
        localState.form.errors = [i18nextInstance.t(`errors.networkError`)];
      } else {
        localState.form.errors = [i18nextInstance.t(`errors.${error.message}`)];
      }
    });
};

const checkRssUpdate = (state, timeout = 5000) => {
  const localState = state;
  if (localState.feeds.length > 0) {
    localState.feeds.map((f) => getRss(f.link)
      .then((data) => {
        const existingLinks = localState.posts
          .filter((p) => p.feedId === f.id)
          .map((p) => p.link);
        const newPosts = data.posts.filter((p) => !existingLinks.includes(p.link));
        localState.posts = [...newPosts, ...localState.posts];
      })
      .catch((error) => {
        console.error('Error updating data from feeds:', error);
      }));
  }
  setTimeout(() => checkRssUpdate(state, timeout), timeout);
};

export { addRss, checkRssUpdate };
