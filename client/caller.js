    function caller() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", config.serverUrl, true);
        
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