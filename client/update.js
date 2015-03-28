    
    
    function update(data){
        
        d3.select("#title").text(updateTitle(data));
        
        d3.select("#departures").select("svg").selectAll(".row")
            .each(function(departure,index){
                var departureOne = d3.select(this);
            
            
            
                var now = new Date();
                var dataBuses = data.departures.filter(function(d){
                    return d.stoppoint==departure.stoppoint && d.id == departure.id
                        && now.getTime()/1000 + tScale.domain()[0]*60 < d.time && d.time < now.getTime()/1000 + tScale.domain()[1]*60
                })
                
                
                departureOne.select(".stoppoint").text(dataBuses.length>0? dataBuses[0].direction : "No hope"); 
            
                
//                var resolvedTime = (now.getTime() - dataBuses[0].time*1000)/1000;
//                departureOne.select(".time").text(resolvedTime);
                
                var busses = departureOne.selectAll(".bus")
                    .data(dataBuses, function(d){return d.tabletime});
            
                busses.exit()
                    .classed("invisible",true)
                    .remove();
                busses.enter().append("rect")
                    .attr("class","bus invisible")
                    .attr("width",WIDTH*0.01)
                    .attr("height",DEPARTURES_ROW_HEIGHT)
                    .classed("invisible",false);
                busses
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("x", function(d){return tScale( (d.time*1000 - now.getTime())/1000/60 )});
            
                    
            })
        
        var tempMax = d3.max(data.weather.map(function(d){return d.temp}));
        var tempMin = d3.min(data.weather.map(function(d){return d.temp}));
        
        var WEATHER_TEMPDOMAIN_LIMIT = 10;
        if(tempMax - tempMin < WEATHER_TEMPDOMAIN_LIMIT){
            tempMax = (tempMax + tempMin)/2 + WEATHER_TEMPDOMAIN_LIMIT/2; 
            tempMin = (tempMax + tempMin)/2 - WEATHER_TEMPDOMAIN_LIMIT/2;
        }
        tempScale.domain([tempMin, tempMax]);
        
        d3.select("#weather").select("svg").selectAll(".column")
            .each(function(departure,index){
                var weatherOne = d3.select(this);
        
                var dataWeather = data.weather[index];
            
        
                weatherOne.select("circle.sun")
                    .classed("moon", !dataWeather.day)
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("r", Math.abs(sunScale(dataWeather.sun)) || 1)
                    .attr("cy", tempScale(dataWeather.temp))
                weatherOne.select("rect.rain")
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("height", rainScale(dataWeather.rain))
                weatherOne.select("rect.wind")
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("height", windScale(dataWeather.windspeed))
                    .attr("y", WEATHER_HEIGHT - windScale(dataWeather.windspeed))
                
                weatherOne.select("text.sun")
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .text(dataWeather.sun)
                weatherOne.select("text.temp")
                    .attr("y", tempScale(dataWeather.temp))
                    .text(Math.round(dataWeather.temp) + "°C")
                weatherOne.select("text.rain")
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("y", rainScale(dataWeather.rain) + 20 )
                    .text(dataWeather.rain + (index==0?"mm/h":""))
                weatherOne.select("text.wind")
                    .transition().duration(DURATION_LAGOM).ease("linear")
                    .attr("y", WEATHER_HEIGHT - windScale(dataWeather.windspeed))
                    .text(Math.round(dataWeather.windspeed) + (index==0?"m/s":""))
    
            })
    
        
        
    }
        








function updateTitle(data){
    var weatherText = [{tip:"", suffer:0}];
    var traficText = [{tip:"", suffer:0}];
    var andText = "";
    
    var now = new Date();
    if(data.weather[0].temp<0) weatherText.push({tip: "Wear a hat", suffer: 1});
    if(data.weather[0].windspeed>10) weatherText.push({tip: "Hold your hat", suffer: 10});
    if(data.weather[0].rain>0.5) weatherText.push({tip: "Take an umbrella", suffer: 5});
    if(data.weather[0].rain>3) weatherText.push({tip: "Wear a raincoat", suffer: 7});
    if(data.weather[0].rain>5) weatherText.push({tip: "Wear a bathing suit", suffer: 20});
    

    weatherText.sort(function(a,b){return b.suffer - a.suffer})
    traficText.sort(function(a,b){return b.suffer - a.suffer})
    
    //if(data.departures[0].time/1000 - now.getTime) weatherText = "Wear a hat"
    
    if(weatherText[0].tip!="" && traficText[0].tip!="")andText = " and ";
    return weatherText[0].tip + andText + traficText[0].tip;
    
}