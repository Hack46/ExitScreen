    
    
    function init(){
    
        
        d3.select("#departures")
            .append("svg")
            .selectAll(".row")
            .data(config.departures)
            .enter().append("g")
            .attr("class","row")
            .each(function(departure,index){
                var departureOne = d3.select(this);
                departureOne.append("rect").attr("class","walk");
                departureOne.append("rect").attr("class","run");
                departureOne.append("rect").attr("class","stay");
                departureOne.append("text").attr("class","id").text(departure.id);
                departureOne.append("text").attr("class","stoppoint").text(departure.stoppoint); 
            
                departureOne.append("text").attr("class","time");
            })
        
        d3.select("#departures").select("svg").append("g").attr("class","axis");
        
        var weatherColumns = new Array(+config.weather.steps);
        d3.select("#weather")
            .append("svg")
            .selectAll(".column")
            .data(weatherColumns)
            .enter().append("svg")
            .attr("class","column")
            .each(function(departure,index){
                var weatherOne = d3.select(this);
                weatherOne.append("circle").attr("class","sun");
                weatherOne.append("g").attr("class","curtains");
                weatherOne.append("rect").attr("class","grid");
                weatherOne.append("rect").attr("class","grid bottom");
                weatherOne.append("rect").attr("class","rain");
                weatherOne.append("rect").attr("class","wind");
                weatherOne.append("text").attr("class","temp shadow");
                weatherOne.append("text").attr("class","temp");
                weatherOne.append("text").attr("class","rain");
                weatherOne.append("text").attr("class","wind shadow");
                weatherOne.append("text").attr("class","wind");
                weatherOne.append("text").attr("class","grid").text(index==0?"now":(index==1?1+config.weather.unitShort:index));

            })
    }