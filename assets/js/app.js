$(document).ready(function() {




    $(".sortable").sortable();
    $(".sortable").disableSelection();
    $(".draggable").draggable();
    $(".droppable").droppable({
        drop: function(event, ui) {
            var draggedWrapper = $(ui.draggable)[0]
            var draggedBtn = $(draggedWrapper).find(".cast-member-btn");
            createGifs(draggedBtn);
        }
    });

    $(".clear-gif-area-btn").hide();


    var apiKey = "pu0g7RhCjo8xLoaeWnNyrJu1xfGOQh1R";

    var initialCastMembers = [{
            name: "Sponge Bob",
            image: "spongebob.jpeg"
        },
        {
            name: "Patrick Star",
            image: "Patrick star.jpg"
        },
        {
            name: "Mr. Krabs",
            image: "Mr.Krabs.jpg"
        },
        {
            name: "Squidward Tentacle",
            image: "Squidward.jpg"
        },
        {
            name: "Sandy Cheeks",
            image: "Sandy_Cheeks.jpg"
        },
        {
            name: "Plankton",
            image: "plankton.jpeg"
        },
        {
            name: "Gary Snail",
            image: "gary_snail.jpeg"
        }
    ];

    // Set castMembers array to initialCastMembers array initally
    var castMembers = initialCastMembers.slice(0);

    // Initialize customCastMembers string for future use in storing HTML
    var customCastMembers;

    // Boolean to ensure Clear Gifs button doesn't remove instructions prior to user generating first set of gifs
    var hasGeneratedGifs = false;


    ////////////////////////////
    ////// EVENT HANDLERS //////
    ////////////////////////////


    // Cast Members Button Click Handler
    $(document).on("click", ".cast-members-btn", function() {
        // Toggle "hidden" class on sidebar class
        $(".sidebar").toggleClass("hidden");
    });

    // Add Cast Member Button Click Handler
    $(document).on("click", ".add-cast-member-btn", function() {
        $(".search-form").slideToggle("fast", "swing");
        $("#search-input").focus();
        $("#search-input").val("");
    });

    // Clear Gifs Button Click Handler
    $(document).on("click", ".clear-gif-area-btn", function() {
        if (hasGeneratedGifs) {
            // Empty gif-area
            $(".gif-area").empty();
            // Hide button
            $(".clear-gif-area-btn").hide();
        }
    });

    // Append Cast Member Button Click Handler
    $(document).on("click", "#append-cast-member-btn", function(event) {
        // Prevent button from reloading page
        event.preventDefault();
        // Close search form
        $(".search-form").slideToggle("fast", "swing");

        // Add input to array
        var newCastMember = {
            name: `${$("#search-input").val().trim()}`,
            image: "snl.jpg"
        };

        // Add new button to beginning of castMembers array
        castMembers.unshift(newCastMember);

        // Clear search form
        $("#search-input").val("");

        // Call createButtons functions
        createButtons();

        // Select new button
        var newBtn = $(".btn-area div:first-child").find(".cast-member-btn");

        // Call createGifs
        createGifs(newBtn);
    });

    // Cast Member Button Click Handler
    $(document).on("click", ".cast-member-btn", function() {
        // Save clicked button to a variable
        var clickedBtn = $(this);
        // Call createGifs function and pass it clickedBtn
        createGifs(clickedBtn);
    });

    // Gif Click Event Handler
    $(document).on("click", ".cast-member-gif", function() {
        // Store clicked gif's src as a variable
        var clickedGifSrc = $(this).attr("src");
        // If gif is playing
        if ($(this).hasClass("playing")) {
            // Change src to still version
            $(this).attr("src", clickedGifSrc.replace(/\.gif/i, "_s.gif"));
            // Remove class "playing"
            $(this).removeClass("playing");
        } else {
            // Otherwise, gif is stopped
            // Add class "playing"
            $(this).addClass("playing");
            // Change src to non-still version
            $(this).attr("src", clickedGifSrc.replace(/\_s.gif/i, ".gif"));
        }
    });

    // Close Search Bar Event Handler
    $(document).on("click", "#close-search-btn", function() {
        // Toggle search form slide
        $(".search-form").slideToggle("fast", "swing");
        // Clear content
        $("#search-input").val("");
    });

    // Close Cast Member Button Click Handler
    $(document).on("click", ".cast-member-btn-close", function() {
        // Save parent to a variable
        var clickedParent = $(this).parent();
        // Save value of index attribute of clicked button to variable
        var clickedIndex = clickedParent.attr("index");

        // Remove element at index of clickedIndex from castMembers array
        castMembers.splice(clickedIndex, 1);

        // Animate button disappearing
        clickedParent.animate({ opacity: 0 }, 300);

        // Call createButtons
        setTimeout(createButtons, 300);
    });



    function createButtons() {
        $(".btn-area").empty();
        for (i = 0; i < castMembers.length; i++) {
            // Save current cast member info to variables
            var castMemberName = castMembers[i].name;
            var castMemberImage = castMembers[i].image;

            $(".btn-area").append(`
          <div class="cast-member-btn-wrapper" index=${i}>
            <i class="fa fa-bars cast-member-reorder" aria-hidden="true"></i>
            <button type="button" class="btn btn-dark cast-member-btn" cast-member-name="${castMemberName}">
              <img class="cast-member-img" src="assets/images/${castMemberImage}">
              <p class="cast-member-name">${castMemberName}</p>
              <button type="button" class="cast-member-btn-close"><i class="fa fa-times-circle" aria-hidden="true"></i></button>
            </button>
          </div>`);
        }
    }

    function createGifs(button) {
        hasGeneratedGifs = true;

        var clickedName = button.attr("cast-member-name").split(" ").join("+");

        var queryURL = `https://api.giphy.com/v1/gifs/search?q=SpongeBob+${clickedName}&api_key=${apiKey}&limit=20`;

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {

            $(".gif-area").empty();

            $(".sidebar").addClass("hidden");

            for (i = 0; i < response.data.length; i++) {
                var currentGif = response.data[i];

                $(".gif-area").append(`
            <div class="gif-container">
              <div class="gif-rating">${currentGif.rating}</div>
              <img class="cast-member-gif" src="${currentGif.images.fixed_height_still.url}">
            </div>`);
            }

            $(".clear-gif-area-btn").show();
        });
    }




    createButtons();


});