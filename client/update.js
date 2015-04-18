    
    
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
                    //.attr("r", Math.abs(sunScale(dataWeather.sun)) || 1)
                    .transition().duration(DURATION_LAGOM)
                    .attr("cy", tempScale(dataWeather.temp))
                weatherOne.select("g.curtains")
                    .selectAll("rect")
                    .attr("transform", "rotate(45)")
                    .attr("y", function(d,i){return i*WEATHER_CURTAIN_HEIGHT + WEATHER_CURTAIN_HEIGHT/2})
                    .attr("height", WEATHER_CURTAIN_HEIGHT * (1-dataWeather.sun))
                weatherOne.select("g.curtains")
                    .transition().duration(DURATION_LAGOM)
                    .attr("transform", "translate("+WEATHER_WIDTH_ONE/2+","+ (tempScale(dataWeather.temp) - WEATHER_WIDTH_ONE/1.5) +")")
                weatherOne.select("rect.rain")
                    .attr("height", rainScale(dataWeather.rain))
                weatherOne.select("rect.wind")
                    .attr("height", windScale(dataWeather.windspeed))
                    .attr("y", WEATHER_HEIGHT - windScale(dataWeather.windspeed))
                
                weatherOne.selectAll("text.temp")
                    .transition().duration(DURATION_LAGOM)
                    .attr("y", tempScale(dataWeather.temp))
                    .text(Math.round(dataWeather.temp) + "°C")
                weatherOne.select("text.rain")
                    .attr("y", rainScale(dataWeather.rain) + 20 )
                    .text(dataWeather.rain==0?"":dataWeather.rain)
                weatherOne.selectAll("text.wind")
                    .attr("y", WEATHER_HEIGHT)
                    .text(Math.round(dataWeather.windspeed)==0?"":Math.round(dataWeather.windspeed))
    
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