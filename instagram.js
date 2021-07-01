const puppeteer = require('puppeteer');

const BASE_URL = 'https://www.instagram.com/';
const INFO_URL = (user) => `https://www.instagram.com/${user}/?__a=1`;
const PROFILE_URL = (user) => `https://www.instagram.com/${user}`;

const instagram = {
    browser: null,
    page: null,

    initialize: async () => {
        instagram.browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-popup-blocking", "--allow-popups-during-page-unload", "--enable-features=NetworkService", "--no-sandbox"],
            ignoreHTTPSErrors: true
        });

        instagram.page = await instagram.browser.newPage();
        await instagram.page.setUserAgent("Mozilla/5.0 (Windows NT 10.0Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36");
    },

    login: async (username, password) => {
        await instagram.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

        await instagram.page.waitFor(1000);

        await instagram.page.type('input[name="username"]', username, { delay: 50});
        await instagram.page.type('input[name="password"]', password, { delay: 50});

        await instagram.page.click('button[type="submit"]');

        await instagram.page.waitFor('.logged-in');
    },

    logout: async (user) => {
        await instagram.page.goto(PROFILE_URL(user), { waitUntil: 'networkidle2' });

        await instagram.page.click('[role="link"]');
        await instagram.page.waitForSelector('._01UL2');
        await instagram.page.evaluate(() => {
            document.querySelectorAll('[aria-labelledby]')[4].click(); 
        });
    },

    getUserInfo: async (user) => {
        await instagram.page.goto(INFO_URL(user), { waitUntil: 'networkidle2'});
        const data = await instagram.page.waitForSelector('pre');
        const ndata = await data.evaluate(el => el.textContent);
        const jsondata = JSON.parse(ndata);
        return jsondata;
    },

    getUserProfilePicUrl: async (jsdata) => {
        return (jsdata['graphql']['user']['profile_pic_url_hd']);
    },

    getUserFollowerCount: async (jsdata) => {
        return (jsdata['graphql']['user']['edge_followed_by']['count']);
    },

    getUserFollowingCount: async (jsdata) => {
        return (jsdata['graphql']['user']['edge_follow']['count']);
    },

    getUserID: async (jsdata) => {
        return (jsdata['graphql']['user']['id']);
    },

    getIsVerified: async (jsdata) => {
        return (jsdata['graphql']['user']['is_verified']);
    },

    getIsPrivate: async (jsdata) => {
        return (jsdata['graphql']['user']['is_private']);
    },

    getFullName: async (jsdata) => {
        return (jsdata['graphql']['user']['full_name']);
    },

    getUserPublicMail: async (jsdata) => {
        return (jsdata['graphql']['user']['business_email']);
    },

    getUserPublicPhoneNumber: async (jsdata) => {
        return (jsdata['graphql']['user']['business_phone_number']);
    },

    getUserExternalUrl: async (jsdata) => {
        return (jsdata['graphql']['user']['external_url']);
    },

    getUserBiography: async (jsdata) => {
        return (jsdata['graphql']['user']['biography']);
    },

    browserClose: async () => {
        await instagram.browser.close();
    }
}

module.exports = instagram;