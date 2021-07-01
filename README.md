# Instagram Basic API

# Install

From npm

```
npm i ig-basic-api
```

# Example

You can find usage example

```javascript
const ig = require('ig-basic-api');

(async () => {
    await ig.initialize();
    await ig.login('INSERT_USERNAME', 'INSERT_PASSWORD');
    
    const jsdata = await ig.getUserInfo('svnmez');
    console.log(await ig.getUserID(jsdata));
    await ig.logout('INSERT_USERNAME');
    await ig.browserClose();

})()
```
