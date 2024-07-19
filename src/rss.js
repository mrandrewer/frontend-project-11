import _ from 'lodash';
import axios from 'axios';

const urls = {
    proxyAllowAll: 'https://allorigins.hexlet.app/get?disableCache=true&charset=ISO-8859-1&url=',
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

const getRss = (link) => {
    return axios.get(urls.proxyAllowAll + encodeURIComponent(link))
    .then((response) => {
        if (response.status === 200) return response.data.contents;
        throw new Error('networkError');
    })
    .then((feedData) => {
        const data = parseRssData(feedData);
        data.feed.link = link;
        return data;
    });
}

const addRss = (link, state, i18nextInstance) => {
    getRss(link)
        .then((data) => {
            state.feeds = [...state.feeds, data.feed];
            state.posts = [ ...data.posts, ...state.posts];
        })
        .catch((error) => {
            console.error(`Error fetching data from feed ${link}:`, error);
            state.form.error = i18nextInstance.t(`errors.${error.message}`);
        });
};

const checkRssUpdate = (state, timeout = 5000) => {
    if (state.feeds.length > 0) {
        state.feeds.map((f) => getRss(f.link)
            .then((data) => {
                const existingLinks = state.posts
                    .filter((p) => p.feedId === f.id)
                    .map((p) => p.link);
                const newPosts = data.posts.filter((p) => !existingLinks.includes(p.link));
                state.posts = [...newPosts, ...state.posts];
            })
            .catch((error) => {
                console.error(`Error fetching data from feed ${link}:`, error);
            })
        );
    }
    setTimeout(() => checkRssUpdate(state, timeout), timeout);
}

export { addRss, checkRssUpdate };