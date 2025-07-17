# Banner
This package exports a middleware function for Koajs app servers that displays useful start-up 
information.

```javascript
import Banner from '@mattduffy/banner'

// to emit a startup banner in your app logs
const banner = new Banner({
  name: <your_app_name>,
  local: <your_local_dev_host>,
  localPort: <your_local_dev_port>, // optional
  public: <your_public_domain_name>,
})
banner.print()
/*
  Emits to stdout (or where ever your logging goes).
  #####################################################
  #                                                   #
  #  Starting up: <your_app_name>                     #
  #        local: http://192.168.1.252:9876           #
  #       public: https://example.com                 #
  #      process: node v20.19.4 (Iron)                #
  #         arch: x64 linux                           #
  #                                                   #
  #####################################################
*/
// To emit a banner at the start of each request
app.use(banner.use())
/*
  Emits at the beginning of each client request.
  #################################################################
  #      GET: https://dev.example.com/map/getToken?debug=verbose
  #  Referer: https://dev.exaple.com/?debug=verbose
  #  From IP: 192.168.1.254
  #################################################################
*/
```

The request banner uses a different ASCII text character depending on the value of 
the ```ctx.request.method``` property.  The supported request methods are ```GET```, ```PUT```,
```POST```, and ```DELETE```.

```
// GET
######################################################################
#      GET: https://banner.test/a/really/long/url/to/a/special/page
#  Referer: https://googoogle.com
#  From IP: 192.168.1.250
######################################################################
```

```
// PUT
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
&      PUT: https://banner.test/a/really/long/url/to/a/special/page
&  Referer: https://googoogle.com
&  From IP: 192.168.1.250
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
```

```
// POST
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@     POST: https://banner.test/a/really/long/url/to/a/special/page
@  Referer: https://googoogle.com
@  From IP: 192.168.1.250
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

```
// DELETE
**********************************************************************
*   DELETE: https://banner.test/a/really/long/url/to/a/special/page
*  Referer: https://googoogle.com
*  From IP: 192.168.1.250
**********************************************************************
```
