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
  #           GET: https://dev.example.com/map/getToken
  #  Query Params: ?debug=verbose
  #       Referer: https://dev.example.com/?debug=verbose
  #       From IP: 192.168.1.254
  #     Timestamp: 1/7/2026, 10:34:14 AM
  #################################################################
*/
```

The request banner uses a different ASCII text character depending on the value of 
the ```ctx.request.method``` property.  The supported request methods are ```GET```, ```PUT```,
```POST```, and ```DELETE```.

```
// GET
##########################################################################
#           GET: https://banner.test/a/really/long/url/to/a/special/page
#  Query Params: ?param1=querty&param2=12345&param3=true
#       Referer: https://googoogle.com
#       From IP: 192.168.1.250
#     Timestamp: 1/7/2026, 10:34:14 AM
##########################################################################
```

```
// PUT
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
&        PUT: https://banner.test/a/really/long/url/to/a/special/page
&    Referer: https://googoogle.com
&    From IP: 192.168.1.250
&  Timestamp: 1/7/2026, 10:34:14 AM
&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
```

```
// POST
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@       POST: https://banner.test/a/really/long/url/to/a/special/page
@    Referer: https://googoogle.com
@    From IP: 192.168.1.250
@  Timestamp: 1/7/2026, 10:34:14 AM
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

```
// DELETE
**********************************************************************
*     DELETE: https://banner.test/a/really/long/url/to/a/special/page
*    Referer: https://googoogle.com
*    From IP: 192.168.1.250
*  Timestamp: 1/7/2026, 10:34:14 AM
**********************************************************************
```

Under the right conditions, the request banner can also include geo-location details
about the client.  For each new request, Koajs creates a context object containing the
request and response objects ```ctx.request``` and ```ctx.response```.  It is a common
technique to add a state property to the ctx object, like ```ctx.state```.  If geo-location
is available, save it to ```ctx.state``` like so:
```javascript
ctx.state.logEntry = {
  geos: [
    {
      country: 'United States',
      city: 'New York City',
      subdivision: 'New York', // the state in USA
      coords: [40.775697, -73.971727],
    },
  ],
}

############################################################################################################
#        GET: https://banner.test/a/really/long/url/to/a/special/page
#    Referer: https://googoogle.com
#    From IP: 192.168.1.250
#   Location: Country: United States, State: New York, City: New York City, lat/lon: 40.775697, -73.971727
#  Timestamp: 1/8/2026, 9:15:40 AM
############################################################################################################
```
The geo-location details must be saved to the context state property before the 
```app.use(banner.use())``` is executed for this to work.
