function init() {
            // NFL Data
            var full_play_type = ["pass_left", "pass_middle", "pass_right", "run_left", "run_middle", "run_right"];
            var full_play_frequency = [0.206, 0.134, 0.230, 0.156, 0.119, 0.155];
            var prediction_image = d3.select("#prediction--image");
            var prediction_play_type = d3.select("#prediction--play_type");
            var prediction_play_frequency = d3.select("#prediction--play_frequency");
        
            // Create the bar chart
            var trace1 = {
                x : full_play_type,
                y : full_play_frequency,
                type : 'bar',
                marker : {
                    color : 'navy',
                    opacity : 0.9
                }
            };
        
            var data = [trace1];
        
            var layout = {
                title : 'Play Selection: NFL'
            }
            Plotly.newPlot("bar",data, layout);
            // Create the gauge chart
            var data4 = [
                {
                type: "indicator",
                mode: "gauge+number",
                value: 305166,
                title: { text: "Sample Size", font: { size: 30 } },
                gauge: {
                    axis: { range: [null, 1000] },
                    bar: { color: "navy" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                }
                }
            ];
            
            var layout4 = {
                height: 350,
                font: {color: "navy", family: "Arial"}                           
            };  
            
            Plotly.newPlot('sampleSize', data4, layout4);
        
            prediction_image.append("img")
                .attr("src", "https://content.sportslogos.net/logos/7/1007/full/dwuw5lojnwsj12vfe0hfa6z47.gif")
                .classed("card-img", true);
        
            prediction_play_type.text("pass_right");
            prediction_play_frequency.text("23.0%");
    }
        // event handlers for filters
d3.selectAll("#selDataset").on("change", applyFilters);
d3.selectAll("#apply-filters").on("click", applyFilters);
d3.selectAll("#selSeason").on("change", applyFilters);


function applyFilters() {
    // selected filters
    var dropdownMenu = d3.select("#selDataset");
    var teamSelected = dropdownMenu.property("value");
    var seasonDropdown = d3.select("#selSeason");
    var seasonSelected = seasonDropdown.property("value");
    var offdefFilter = d3.select("#offdef-filter label.active input")._groups[0][0].getAttribute("id");
    var conferenceFilter = d3.select("#conference-filter label.active input")._groups[0][0].getAttribute("id");
    var divisionFilter = d3.select("#division-filter label.active input")._groups[0][0].getAttribute("id");
    var downFilter = d3.select("#down-filter label.active input")._groups[0][0].getAttribute("id");
    var quarterFilter = d3.select("#quarter-filter label.active input")._groups[0][0].getAttribute("id");
    var outcomeFilter = d3.select("#outcome-filter label.active input")._groups[0][0].getAttribute("id");
    var distanceFilter = d3.select("#distance-filter label.active input")._groups[0][0].getAttribute("id");
    var displayAppliedFilters = d3.selectAll("#displayAppliedFilters");
    var teamInfoName;
    var teamLogoSrc;
    var filterTeam = "posteam";
    var filterDiv = "division";
    var filterCon = "conference";
    var prediction_image = d3.select("#prediction--image");
    var prediction_play_type = d3.select("#prediction--play_type");
    var prediction_play_frequency = d3.select("#prediction--play_frequency");
            
    d3.tsv("https://gist.githubusercontent.com/bevansr/c185d44034a3c747ec3adf49632cb695/raw/31824bc64b80c12bd33ac24df715b8ed7c3bd1a9/nfl_off_def_count.tsv", function(nflData) {
        d3.tsv("https://gist.githubusercontent.com/bevansr/8706dd444037a11a076551230e5a0c43/raw/a690e92c43f632cd304f173dca938afd8ec274fb/nfl_team_info.tsv", function(teamData) {        
            displayAppliedFilters.html("");
            prediction_image.html("");
                
            // parse play type counts
            nflData.forEach(function(data) {
                data.count = +data.count;
                data.season = data.season.toString();
            });

            var filteredData = nflData;

            if (offdefFilter === 'defense') {
                filterTeam = "defteam";
                filterDiv = "defdivision";
                filterCon = "defconference";
            }

            if (seasonSelected != 'allSeasons') {
                console.log(`Applying season filter to ${seasonSelected}`);
                filteredData = filteredData.filter(i => i.season === seasonSelected);
            }

            if (teamSelected === 'NFL') {
                d3.selectAll("#conference-filter .btn").classed("disabled", false);
                d3.selectAll("#division-filter .btn").classed("disabled", false);
                teamLogoSrc = "https://content.sportslogos.net/logos/7/1007/full/dwuw5lojnwsj12vfe0hfa6z47.gif";
                // check conference filter 
                if (conferenceFilter != "all-con") {
                    console.log(`Applying conference filter to ${conferenceFilter}`);
                    // Filter data by conference selected
                    filteredData = filteredData.filter(i => i[filterCon] === conferenceFilter);
                    // Update team selected label for plots
                    teamSelected = d3.selectAll("#nfl-filters label.active input")._groups[0][0].getAttribute('id').toUpperCase();

                    displayAppliedFilters.append("span")
                        .text(`Conference: ${conferenceFilter.toUpperCase()}`);
                }
                // check division filter
                if (divisionFilter != "all-div") {
                    console.log(`Applying division filter to ${divisionFilter}`);
                    // Filter data by division selected
                    filteredData = filteredData.filter(i => i[filterDiv] === divisionFilter);
                    // check if conference filter is also applied
                    if (teamSelected != 'NFL') {
                        // select division id
                        var divisionSelected = d3.selectAll("#nfl-filters label.active input")._groups[0][1].getAttribute('id').toUpperCase();
                        // update team selected label to conference and division for plots
                        teamSelected = `${teamSelected} ${divisionSelected}`;
                    }
                    else {
                    // Update team selected label for plots    
                        teamSelected = d3.selectAll("#nfl-filters label.active input")._groups[0][1].getAttribute('id').toUpperCase();
                    }

                    displayAppliedFilters.append("span")
                        .text(`Division: ${divisionFilter.toUpperCase()}`);
                }
            }

            else {
                // disable conference and division filters
                d3.selectAll("#conference-filter .btn").classed("disabled", true);
                d3.selectAll("#division-filter .btn").classed("disabled", true);
                // Filter to team selected
                filteredData = filteredData.filter(i => i[filterTeam] === teamSelected);
                teamLogo = true;
                var teamInfo = teamData.filter(i => i.abbr === teamSelected);
                teamLogoSrc = teamInfo[0].logo_address;
                teamInfoName = teamInfo[0].club;
            }

            if (downFilter != "allD") {
                console.log(`Applying down filter to ${downFilter}`);
                // filter partial data
                filteredData = filteredData.filter(i => i.down === downFilter);
                // filter nfl data
                nflData = nflData.filter(i => i.down === downFilter);
                displayAppliedFilters.append("span")
                    .text(`Down: ${downFilter}`);
            }
            
            if (quarterFilter != "allQ") {
                console.log(`Applying quarter filter to ${quarterFilter}`);
                // filter partial data
                filteredData = filteredData.filter(i => i.qtr === quarterFilter);
                // filter nfl data
                nflData = nflData.filter(i => i.qtr === quarterFilter);
                displayAppliedFilters.append("span")
                    .text(`Qtr: ${quarterFilter}`);
            }
            
            if (outcomeFilter != "all-outcomes") {
                console.log(`Applying outcome filter to ${outcomeFilter}`);
                // filter partial data
                filteredData = filteredData.filter(i => i.score_differential === outcomeFilter);
                // filter nfl data
                nflData = nflData.filter(i => i.score_differential === outcomeFilter);
                displayAppliedFilters.append("span")
                    .text(`Outcome: ${outcomeFilter}`);
            }
            
            if (distanceFilter != "all-distance") {
                console.log(`Applying distance filter to ${distanceFilter}`);
                // filter partial data
                filteredData = filteredData.filter(i => i.ydstogo === distanceFilter);
                // filter nfl data
                nflData = nflData.filter(i => i.ydstogo === distanceFilter);
                displayAppliedFilters.append("span")
                    .text(`Distance: ${distanceFilter}`);
            }

            // prepare data for plotting
            var full_play_types = ["pass_left", "pass_middle", "pass_right", "run_left", "run_middle", "run_right"];
            var full_play_count = calculateTotalPlayCounts(filteredData);
            var nfl_full_play_count = calculateTotalPlayCounts(nflData);
            var full_play_count_sum = sum_play_count(full_play_count);
            var full_play_frequency = full_play_count.map(calculateFrequency);
            var nfl_full_play_count_sum = sum_play_count(nfl_full_play_count);
            var nfl_play_type_frequency = nfl_full_play_count.map(calculateFrequencyNFL);
            var full_play_frequency_max = d3.max(full_play_frequency);
            var frequency_max_index = full_play_frequency.findIndex((element) => element === full_play_frequency_max);
            var full_play_types_max = full_play_types[frequency_max_index];
            full_play_frequency_max = full_play_frequency_max * 100;

            function calculateTotalPlayCounts(data) {
                var play_count = [];
                for (i = 0; i < full_play_types.length; i++) {
                    var totalPlays = 0;
                    var play_type_data = data.filter(data => data.full_play_type === full_play_types[i]);
                    var playFrequency = play_type_data.map(data => data.count);
                    for (j = 0; j < playFrequency.length; j++) {
                        totalPlays += playFrequency[j];
                    }
                    play_count.push(totalPlays);
                }
                console.log('logging play counts');
                console.log(play_count);
                return play_count;
            }

            function sum_play_count(playTypes) {
                var totalPlays = 0;
                for (i = 0; i < playTypes.length; i++) {
                    totalPlays += playTypes[i];
                }
                return totalPlays;
            }

            function calculateFrequency(num) {
                return (num / full_play_count_sum).toFixed(3);
            }

            function calculateFrequencyNFL(num) {
                return (num / nfl_full_play_count_sum).toFixed(3);
            }

            prediction_image.append("img")
                .attr("src", teamLogoSrc)
                .classed("card-img", true);

            prediction_play_type.text(full_play_types_max);
            prediction_play_frequency.text(`${full_play_frequency_max.toFixed(1)}%`);

                // prepare bar chart
            var trace1 = {
                x : full_play_types,
                y : full_play_frequency,
                type : 'bar',
                name : teamSelected,
                marker : {
                    color : 'navy',
                    opacity : 0.9
                }
            };

            var data2;
            var layout;
            // if team conference or divison filters are applied include comparison
            if (teamSelected != 'NFL') {
                var trace2 = {
                    x : full_play_types,
                    y : nfl_play_type_frequency,
                    type : 'bar',
                    name : 'NFL',
                    marker : {
                        color : 'rgb(204,204,204)',
                        opacity : 0.7
                    }
                };
                    
                data2 = [trace1, trace2];
                layout = {
                    title : `Play Selection: ${teamSelected} vs. NFL`
                }
            }
            // if no team conference or division filters are applied don't include comparison
            else {
                data2 = [trace1];
                layout = {
                    title : 'Play Selection: NFL'
                }
            }
            // create bar chart
            Plotly.newPlot("bar",data2, layout);

            // create gauge chart
            var data4 = [
                {
                    type: "indicator",
                    mode: "gauge+number",
                    value: full_play_count_sum,
                    title: { text: "Sample Size", font: { size: 30 } },
                    gauge: {
                        axis: { range: [null, 1000] },
                        bar: { color: "navy" },
                        bgcolor: "white",
                        borderwidth: 2,
                        bordercolor: "gray",
                    }
                }
            ];
                
            var layout4 = {
                height: 350,
                font: {color: "navy", family: "Arial"}                           
            };  
                
            Plotly.newPlot('sampleSize', data4, layout4);

            // function to update radar chart
            updateRadar(full_play_frequency, nfl_play_type_frequency, full_play_types, teamSelected, "NFL");
        
        
       
        });
    });  

}

 // run function to display initial charts
 init();
