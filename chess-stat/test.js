$(".stats-content").hide();
$(".alert").hide();

var width = 150,
height = 150,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#449d44", "#ec971f", "#c9302c"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var labelArc = d3.svg.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.population; });

var svg = d3.select("#stats-overall")
    .attr("width", width)
    .attr("height", height)
		.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var svg2 = d3.select("#stats-white")
    .attr("width", width)
    .attr("height", height)
		.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var svg3 = d3.select("#stats-black")
    .attr("width", width)
    .attr("height", height)
		.append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function fetchData() {
	$(".alert").hide();
	var playerName = document.getElementById("player-name").value.toLowerCase();
	
	$.get("https://en.lichess.org/api/user/"+playerName+"/games?nb=100&rated=1", function(data) {

		$("#data-found").fadeIn();

		document.getElementById("player-name-title").textContent =  playerName;

		var results = [{ result : "win" , population : 0} , {  result : "draw" , population : 0} , { result : "loss", population : 0}];

		var resultsWhite = [{ result : "win" , population : 0} , {  result : "draw" , population : 0} , { result : "loss" ,population : 0}];

		var resultsBlack = [{ result : "win" , population : 0} , {  result : "draw" , population : 0} , { result : "loss" , population : 0}];

		data.currentPageResults.forEach(function(game){
			var colorResults = resultsBlack;
			if (game.players.white.userId === playerName) {
				colorResults = resultsWhite;
			}

			if (!game.winner) {
				results[1].population++;
				colorResults[1].population++;
			} else if(game.players[game.winner].userId === playerName) {
				results[0].population++;
				colorResults[0].population++;
			} else {
				results[2].population++;
				colorResults[2].population++;
			}				
		});
		
		var g1 = svg.selectAll(".arc")
	      .data(pie(results))
		.enter().append("g")
	      .attr("class", "arc");

      	g1.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.result); });

      
      	var g2 = svg2.selectAll(".arc")
	      .data(pie(resultsWhite))
		.enter().append("g")
	      .attr("class", "arc");

      	g2.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.result); });

		var g3 = svg3.selectAll(".arc")
	      .data(pie(resultsBlack))
		.enter().append("g")
	      .attr("class", "arc");

      	g3.append("path")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.result); });

      	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([0, 0])
		  .html(function(d) {
		    return "<strong>Number of " + d.data.result + ":</strong> <span style='color:red'>" + d.data.population + "</span>";
		  });
	    
	    svg.call(tip);
	    svg2.call(tip);
	    svg3.call(tip);

	    d3.selectAll(".arc")
	    	.on('mouseover', tip.show)
  			.on('mouseout', tip.hide);

			$(".stats-content").fadeIn();
	}).fail(function(){
		$("#player-not-found").fadeIn();
	});
}
		