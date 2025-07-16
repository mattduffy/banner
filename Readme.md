# Banner
This package exports a middleware function for Koajs app servers that displays useful start-up 
information.

```javascript
import banner from '@mattduffy/banner'

// to emit a startup banner in your app logs
banner.print()

// To emit a banner at the start of each request
app.use(banner.use())
```
