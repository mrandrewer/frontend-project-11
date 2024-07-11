import _ from 'lodash';
import axios from 'axios';

const urls = {
    proxyAllowAll: 'https://allorigins.hexlet.app/get?charset=ISO-8859-1&url=',
}

const parseRssItem = (feedId, rssItem) => {
    return {
        title: rssItem.querySelector('title').textContent,
        description: rssItem.querySelector('description').textContent,
        link: rssItem.querySelector('link').textContent,
        id: _.uniqueId(),
        feedId,
    };
};

const parseRssData = (rssContent) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(rssContent, 'application/xml');
    
    const feedId = _.uniqueId();
    return {
        feed: {
            id: feedId,
            title: xml.querySelector('title').textContent,
            description: xml.querySelector('description').textContent
        },
        posts: Array.from(xml.querySelectorAll('item')).map((i) => parseRssItem(feedId, i))
    };
};

const addRss = (link, state, i18nextInstance) => {
    axios.get(urls.proxyAllowAll + encodeURIComponent(link))
        .then((response) => {
            if (response.status === 200) return response.json;
            throw new Error('networkError');
        })
        .then((feedData) => {
            data = parseRssData(feedData);
            state.feeds = [...state.feeds, data.feed];
            state.posts = [...state.posts, ...data.posts];
        })
        .catch((error) => {
            console.error(`Error fetching data from feed ${link}:`, error);
            state.form.error = i18nextInstance.t(`errors.${error.message}`);
        });
};

export default addRss;