# ExitScreen

The project consits of a Server and a Client. The goal of the project is to fit nessesary information on a 2,8" TFT screen. The information sould be important when you Exit your home.

[Example](http://visuel.tv/exitscreen/)

## Server:
Ther server gathers weather, daylaight, and public transit realtime information.

The server require a lon and lat for the place to have the wather from, and the stops to get the departures from.
`server.domain.se:9165/?lon=<WGS84lon>&lnat<WGS84lat>&sites=<A comma separated list with site ids to get realtime information from>`

## Client
The client presents the data from the server according to the config. The client will only show busses departing from the stoppoint you decide. The topology is used to set the number of minutes needed to reach the stop, in minutes.
Walk is the max time on the screen (60 is max that SL allowes), Run is the max time when one can still catch the transport but needs to hurry, Stay is the max time when transport can't be reached even if you hurry up

 ```javascript
 var config = {
        "serverUrl": "http://pi.thure.org:9165/?lon=18.03&lat=59.29&sites=1707,1534",
        "departures":[
            {"stoppoint":"13174", "id":"134"},
            {"stoppoint":"13174", "id":"168"},
            {"stoppoint":"13446", "id":"144"},
            {"stoppoint":"13445", "id":"144"},
            {"stoppoint":"13446", "id":"165"},
            {"stoppoint":"13445", "id":"165"}
            
        ],
        "topology":{
            "13174": {"walk":60, "run":3, "stay":1},
            "13446": {"walk":60, "run":5, "stay":3},
            "13445": {"walk":60, "run":5.2, "stay":4}
        },
        "weather":{
            "steps":"12",
            "unit":"hour",
            "unitShort":"h"
        }
    }'''
