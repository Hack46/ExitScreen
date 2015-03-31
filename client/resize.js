        
    
    
    function resize(){
        DEPARTURES_AXIS_HEIGHT = window.innerHeight*0.05;//px
        WEATHER_AXIS_HEIGHT = window.innerHeight*0.05;//px
        DEPARTURES_WIDTH_GRAPH = 1; //fraction
        WIDTH = window.innerWidth;
        WEATHER_HEIGHT = parseInt(d3.select("#weather").style("height")) - WEATHER_AXIS_HEIGHT;
        DEPARTURES_ROW_HEIGHT = (parseInt(d3.select("#departures").style("height")) - DEPARTURES_AXIS_HEIGHT) / config.departures.length;
        WEATHER_WIDTH_ONE = WIDTH/config.weather.steps;
        WEATHER_CURTAIN_HEIGHT = 8; //px
        
        TEXTHEIGHT_LAGOM = Math.min(24, Math.max(6, DEPARTURES_ROW_HEIGHT - 8));
        TEXTHEIGHT_SMALL = Math.min(18, Math.max(4, DEPARTURES_ROW_HEIGHT - 20));
        
        tScale.range([WIDTH * (1-DEPARTURES_WIDTH_GRAPH), WIDTH]);
        sunScale.range([0,WEATHER_WIDTH_ONE/2]);
        windScale.range([0, WEATHER_HEIGHT/2]);
        rainScale.range([0, WEATHER_HEIGHT/2]);
        tempScale.range([WEATHER_HEIGHT, 0]);
        
        
        d3.select("#departures").select("svg").select(".axis")
            .call(tAxis)
            .attr("transform","translate(0,"+DEPARTURES_AXIS_HEIGHT+")")
            .selectAll("text")
            .attr("y",(-1*DEPARTURES_AXIS_HEIGHT) + "px")
            .attr("dy","0.94em")
        
        d3.selectAll("#departures").selectAll(".row").selectAll("text").style("font-size", TEXTHEIGHT_LAGOM);
        d3.selectAll("#weather text").style("font-size", TEXTHEIGHT_LAGOM);
        //d3.select(".axis").selectAll(".tick").style("font-size", TEXTHEIGHT_SMALL);
        //d3.select("#weather").selectAll(".grid").style("font-size", TEXTHEIGHT_SMALL);
        
        d3.select("#departures").select("svg").selectAll(".row")
            .attr("transform",function(d,i){return "translate(0,"+(i*DEPARTURES_ROW_HEIGHT + DEPARTURES_AXIS_HEIGHT)+")"})
            .each(function(departure,index){
                var departureOne = d3.select(this);
                var stackX = 0;
            
                departureOne.selectAll(".bus")
                    .attr("width",WIDTH*0.01)
                    .attr("height",DEPARTURES_ROW_HEIGHT);

                departureOne.select(".id")
                    .attr("x",0)
                    .attr("y",DEPARTURES_ROW_HEIGHT/2)
                    .attr("dy","0.32em")

                departureOne.select(".stoppoint")
                    .attr("x",WIDTH * 0.1)
                    .attr("y",DEPARTURES_ROW_HEIGHT/2)
                    .attr("dy","0.32em")

                departureOne.select(".time")
                    .attr("x",WIDTH * (1-DEPARTURES_WIDTH_GRAPH) / 2)
                    .attr("dy",DEPARTURES_ROW_HEIGHT);

                departureOne.select(".walk")
                    .attr("x",tScale(d3.min(tScale.domain())))
                    .attr("width",tScale(config.topology[departure.stoppoint].walk)- tScale(d3.min(tScale.domain())) )
                    .attr("height",DEPARTURES_ROW_HEIGHT)

                departureOne.select(".run")
                    .attr("x",tScale(d3.min(tScale.domain())))
                    .attr("width",tScale(config.topology[departure.stoppoint].run)- tScale(d3.min(tScale.domain())) )
                    .attr("height",DEPARTURES_ROW_HEIGHT)

                departureOne.select(".stay")
                    .attr("x",tScale(d3.min(tScale.domain())))
                    .attr("width",tScale(config.topology[departure.stoppoint].stay)- tScale(d3.min(tScale.domain())) )
                    .attr("height",DEPARTURES_ROW_HEIGHT)
                
                
            })
        d3.select("#weather").select("svg").selectAll(".column")
            .attr("width",WEATHER_WIDTH_ONE)
            .attr("height",WEATHER_HEIGHT+WEATHER_AXIS_HEIGHT)
            .attr("x",function(d,i){return i* WEATHER_WIDTH_ONE})
            .each(function(departure,index){
                var weatherOne = d3.select(this);
            
                weatherOne.select("circle.sun")
                    .attr("r", WEATHER_WIDTH_ONE/2*0.8)
                    .attr("cx", WEATHER_WIDTH_ONE/2);
            
                var curtainsData = new Array(Math.floor(WEATHER_WIDTH_ONE/WEATHER_CURTAIN_HEIGHT));
                var curtains = weatherOne.select("g.curtains").selectAll("rect").data(curtainsData);
                curtains.exit().remove();
                curtains.enter().append("rect");
                curtains.attr("width", WEATHER_WIDTH_ONE);
            
                weatherOne.select("rect.rain")
                    .attr("width", WEATHER_WIDTH_ONE/2)
                    .attr("x", WEATHER_WIDTH_ONE/4);
                weatherOne.select("rect.wind")
                    .attr("x", WEATHER_WIDTH_ONE-WEATHER_WIDTH_ONE/8)
                    .attr("width", WEATHER_WIDTH_ONE/8);
                        
                weatherOne.select("text.rain")
                    .attr("x", WEATHER_WIDTH_ONE/2);
                weatherOne.selectAll("text.wind")
                    .attr("x", WEATHER_WIDTH_ONE)
                    .attr("dy", "-0.18em")
                    .attr("dx", "-0.72em");
                weatherOne.selectAll("text.temp")
                    .attr("x", WEATHER_WIDTH_ONE/2)
                    .attr("dy", "0.32em");
            
            
            
                weatherOne.select("rect.grid")
                        .attr("y",0)                
                        .attr("x",WEATHER_WIDTH_ONE-1)                
                        .attr("height",WEATHER_HEIGHT)                
                        .attr("width",1)  
                weatherOne.select("rect.grid.bottom")
                        .attr("y",WEATHER_HEIGHT)                
                        .attr("x",0)                
                        .attr("height",1)                
                        .attr("width",WEATHER_WIDTH_ONE)  
                weatherOne.select("text.grid")
                        .attr("x", WEATHER_WIDTH_ONE/2)
                        .attr("y",WEATHER_HEIGHT + WEATHER_AXIS_HEIGHT);
            

                
            })
    }
    