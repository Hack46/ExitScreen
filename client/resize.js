        
    
    
    function resize(){
        DEPARTURES_SCALE_HEIGHT = 20;//px
        WEATHER_SCALE_HEIGHT = 20;//px
        DEPARTURES_WIDTH_GRAPH = 1; //fraction
        WIDTH = parseInt(d3.select("#container").style("width"));
        WEATHER_HEIGHT = parseInt(d3.select("#weather").style("height")) - WEATHER_SCALE_HEIGHT;
        DEPARTURES_ROW_HEIGHT = (parseInt(d3.select("#departures").style("height")) - DEPARTURES_SCALE_HEIGHT) / config.departures.length;
        WEATHER_WIDTH_ONE = WIDTH/config.weather.steps;
        
        TEXTHEIGHT_LAGOM = Math.min(24, Math.max(6, DEPARTURES_ROW_HEIGHT - 8));
        TEXTHEIGHT_SMALL = Math.min(18, Math.max(4, DEPARTURES_ROW_HEIGHT - 20));
        
        tScale.range([WIDTH * (1-DEPARTURES_WIDTH_GRAPH), WIDTH]);
        sunScale.range([0,WEATHER_WIDTH_ONE/2]);
        windScale.range([0, WEATHER_HEIGHT/2]);
        rainScale.range([0, WEATHER_HEIGHT/2]);
        tempScale.range([WEATHER_HEIGHT, 0]);
        
        
        d3.select("#departures").select("svg").select(".axis")
            .call(tAxis)
            .attr("transform","translate(0,"+DEPARTURES_SCALE_HEIGHT+")")
            .selectAll("text")
            .attr("y",(-1*DEPARTURES_SCALE_HEIGHT) + "px")
            .attr("dy","0.94em")
        
        d3.selectAll("#departures text").style("font-size", TEXTHEIGHT_LAGOM);
        d3.selectAll("#weather text").style("font-size", TEXTHEIGHT_LAGOM);
        d3.select(".axis").selectAll(".tick").style("font-size", TEXTHEIGHT_SMALL);
        //d3.select("#weather").selectAll(".grid").style("font-size", TEXTHEIGHT_SMALL);
        
        d3.select("#departures").select("svg").selectAll(".row")
            .attr("transform",function(d,i){return "translate(0,"+(i*DEPARTURES_ROW_HEIGHT + DEPARTURES_SCALE_HEIGHT)+")"})
            .each(function(departure,index){
                var departureOne = d3.select(this);
                var stackX = 0;

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
            .attr("transform",function(d,i){return "translate("+(i* WEATHER_WIDTH_ONE)+",0)"})
            .each(function(departure,index){
                var weatherOne = d3.select(this);
            
                weatherOne.select("circle.sun")
                    .attr("cx", WEATHER_WIDTH_ONE/2);
                weatherOne.select("rect.rain")
                    .attr("width", WEATHER_WIDTH_ONE/2)
                    .attr("x", WEATHER_WIDTH_ONE/4);
                weatherOne.select("rect.wind")
                    .attr("x", WEATHER_WIDTH_ONE/2-WEATHER_WIDTH_ONE/6/2)
                    .attr("width", WEATHER_WIDTH_ONE/6);
                        
                weatherOne.select("text.sun")
                    .attr("x", WEATHER_WIDTH_ONE/2);
                weatherOne.select("text.rain")
                    .attr("x", WEATHER_WIDTH_ONE/2);
                weatherOne.select("text.wind")
                    .attr("x", WEATHER_WIDTH_ONE/2)
                    .attr("dy", "-0.32em");
                weatherOne.select("text.temp")
                    .attr("x", WEATHER_WIDTH_ONE/2)
                    .attr("dy", "0.32em");
            
            
            
                weatherOne.select("line.grid")
                        .attr("y2",WEATHER_HEIGHT)                
                weatherOne.select("text.grid")
                        .attr("x", WEATHER_WIDTH_ONE/2)
                        .attr("y",WEATHER_HEIGHT + WEATHER_SCALE_HEIGHT);
            

                
            })
    }
    