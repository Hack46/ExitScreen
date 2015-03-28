    function caller() {
                var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://pi.thure.org:9165/?lon=18.03&lat=59.29&sites=1707,1534", true);
        
        xhr.onload = function (e) {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              data = JSON.parse(xhr.responseText);
                update(data);
            } else {
              console.error(xhr.statusText);
            }
          }
        };
        xhr.onerror = function (e) {
          console.error(xhr.statusText);
        };
        xhr.send(null);
    
    }