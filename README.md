# ExitScreen

The project consits of a Server and a Client. The goal of the project is to fit nessesary information on a 2,8" TFT screen. The information sould be important when you Exit your home.

## Server:
Ther server gathers weather, daylaight, and public transit realtime information.

The server require a lon and lat for the place to have the wather from, and the stops to get the departures from.
/?lon=<WGS84lon>&lnat<WGS84lat>&sites=<A comma separated list with site ids to get realtime information from>

## Client
The client presents the data from the server according to the config. The client will only show busses departing from the stoppoint you decide. The topology is used to set the number of minutes needed to reach the stop. The walk is the total amount of time to show in the screen, in minutes.

 ```javascript
 var config = {
        "departures":[
            {"stoppoint":"13174", "id":"134"},
            {"stoppoint":"13174", "id":"168"},
            {"stoppoint":"13446", "id":"144"},
            {"stoppoint":"13445", "id":"144"},
            {"stoppoint":"13446", "id":"165"},
            {"stoppoint":"13445", "id":"165"}
        ],
        "topology":{
            "13174": {"walk":120, "run":3, "stay":1, "unit":"second" },
            "13446": {"walk":120, "run":5, "stay":3, "unit":"second" },
            "13445": {"walk":120, "run":5.2, "stay":4, "unit":"second" }
        },
        "weather":{
            "steps":"12",
            "unit":"hour",
            "unitShort":"h"
        }
    }'''
