    //define config
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
            "13174": {"walk":60, "run":3, "stay":1, "unit":"second" },
            "13446": {"walk":60, "run":5, "stay":3, "unit":"second" },
            "13445": {"walk":60, "run":5.2, "stay":4, "unit":"second" }
        },
        "weather":{
            "steps":"12",
            "unit":"hour",
            "unitShort":"h"
        }
    }