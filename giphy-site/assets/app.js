$("button").on("click", function(){
    // listener for click on button
    var player = $(this).attr("data-player");
    console.log(player);
    // come back to create vars for apiKey and limit
    // construct query
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + player + "&api_key=dc6zaTOxFJmzC&limit=10";
    // API call
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    })

    // when API call is done
    .done(function(gifsreturned) {
        var results = gifsreturned.data;
        // loop over all results
        for (i=0; i<results.length; i++) {
            var divGif = $("<div class='gif'>"); // stupid angled brackets
            // return the rating
            var rating = results[i].rating;
            // show the rating
            var ptag = $("<p>").text("Gif rating: " + rating);
            // create image tag - DON'T FORGET
            var playerImage = $("<img>");
            playerImage.attr("src", results[i].images.fixed_height.url);
            // append the ptag and image
            divGif.append(ptag);
            divGif.append(playerImage);
            // add it to the HTML div
            $("#gifs-appear-here").prepend(divGif);
        }
    });
});