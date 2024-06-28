// Name : Jon Sham
// Class : DCITP/FT/1A
// Adm : 2317342

var input = require(`readline-sync`);
const fs = require('fs'); // used to work with the file system allowing us to save and load comments to and from files

// Used in Advanced Feature
// Utility function to sanitise movie title for use in filenames 
// This is done as i noticed filepath with movie names with special characters dont link up
function sanitiseFileName(title) {
    // Remove special characters
    // fyi .replace replaces parts of a string with a specified replacement [^\w\s] matches any character that is not a word character or whitespace character
    // gi flags are used after the regular expression to indicate that the replacement should be global and case-insensitive
    // the '' is when there is a word matching the validator, will make it empty string
    return title.replace(/[^\w\s]/gi, '');
}

//Classes

class Movie{

    constructor(name, genre, runningTime, releaseDate, rating){
        this.name=name;
        this.genre=genre;
        this.runningTime=runningTime;
        this.releaseDate=releaseDate;
        this.rating=rating;
        this.comments = []; // New property to store comments for the movie
    }
    displayMovieDetails(){
        var runningTime1 = `Running Time       :`
        if(Math.floor(this.runningTime/60)!=0){
            runningTime1+=` ${Math.floor(this.runningTime/60)}h`;
        }
        if(this.runningTime%60!=0){
            runningTime1+=` ${this.runningTime%60}m`;
        }
        var ratingScore = ((this.rating[1])/(this.rating[0])).toFixed(1);
        // Appears when no ratings
        if(isNaN(ratingScore)) {
            ratingScore = `No Ratings`
        }
            console.log(`Name               : ${this.name}\nGenre              : ${this.genre}\n${runningTime1}\nRelease Date       : ${this.releaseDate}\nRating             : ${ratingScore} (${this.rating[0]} voters)\n\n`);
    }
    // Method to add a new comment to the movie
    addComment(comment) {
        // pushes the comments by user into the array
        this.comments.push(comment);
    }

    // Method to get all comments for the movie
    getAllComments() {
        // meant to dispaly the array
        return this.comments;
    }
}

class MovieList{
    constructor(){
        this.MovieList = [];
        this.MovieList.push (new Movie (`Black Panther: Wakanda Forever 2022`, ['Adventure',`Action`,`Drama`,`Fantasy`,`Sci-Fi`,`Thriller`], 161, `11 Nov 2022`, [9, 42]));
        this.MovieList.push (new Movie (`Avatar: The Way of Water`,[`Adventure`, `Sci-Fi`], 192, `16 Dec 2022`, [4, 15]));
        this.MovieList.push (new Movie (`Fast X`, [`Crime`, `Action`, `Mystery`, `Thriller`], 43, `19 May 2023`, [28, 60]));
        this.MovieList.push (new Movie (`Ant-Man and the Wasp: Quantumania`, [`Adventure`, `Action`], 120, `16 Feb 2023`, [18,80]));
        this.MovieList.push (new Movie (`M3GAN`, [`Horror`, `Mystery`, `Thriller`], 102, `6 Jan 2023`, [20, 70]));
    }
    // 1st Method
    displayAllMovieDetails(){
        for(var i=0;i<this.MovieList.length; i++){
            this.MovieList[i].displayMovieDetails();
        }
    }
    // 2nd Method
    addMovie() {
        // First Message
        do {
          var newMovieAddValidate = false;
          var newMovieAdd = input.question(`\n     Please enter Movie's name: `);
          
          // Check for blank spaces
          if (newMovieAdd.trim() === '') { // fyi .trim is to remove spaces
            console.log('     Movie name cannot be empty. Please enter a valid name!');
            newMovieAddValidate = true;
            continue;
          }
          
          // Check for duplicate movie titles
          for (var i = 0; i < this.MovieList.length; i++) {
            if (this.MovieList[i].name.toLowerCase() === newMovieAdd.toLowerCase()) {
              console.log(`     Please enter a unique movie name!`);
              newMovieAddValidate = true;
              break;
            }
          }
        } while (newMovieAddValidate);
        // Second Message
        do {
        // if loop dont loop resets the array
        var newMovieGenres = []; 

        var newMovieAddValidate1 = false;
        var newMovieGenre = input.question(`\n     Please enter Movie's genre(s):\n     1) Action\n     2) Adventure\n     3) Crime\n     4) Drama\n     5) Fantasy\n     6) Horror\n     7) Mystery\n     8) Sci-Fi\n     9) Thriller\n     Enter genre number(s) separated by commas (e.g., 1,2,4,5): `);

        // Check if input is empty
        if (newMovieGenre.trim() === '') {
        console.log(`     Please enter at least one genre!`);
        newMovieAddValidate1 = true;
        continue;
        }
        // fyi .split splits a string into an array of substrings based on a specified separator
        // fyi .map creates a new array by applying a provided function to each element of the original array
        const selectedGenreNumbers = newMovieGenre.split(',').map(Number);
    
        // Check if input with choice range and is a number
        for (const genreNumber of selectedGenreNumbers) {
            if (genreNumber > 9 || genreNumber < 1 || isNaN(genreNumber)) {
            console.log(`     Please enter valid genre option(s)!`);
            newMovieAddValidate1 = true;
            break;
        }

        // Converts input numbers to the actual genre and pushes them into an array if valid if not reloops
        const genre = ['Action', 'Adventure', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller'][genreNumber - 1];
        if (!newMovieGenres.includes(genre)) { //fyi .includes used to check whether an element or substring is present in the given array or string, respectively
            newMovieGenres.push(genre);
        } else {
            console.log(`     Genre '${genre}' already selected. Please enter unique genres!`);
            newMovieAddValidate1 = true;
            break;
        }
        }
        } while (newMovieAddValidate1);
        // Third Message
        do {
        var newMovieAddValidate2 = false;  
        var newMovieReleaseDate = input.question(`\n     Please enter Movie's release date (day month year): `);

        // Check if the input is empty
        if (newMovieReleaseDate.trim() === '') {
        console.log(`     Movie's release date cannot be empty. Please enter a valid release date!`);
        newMovieAddValidate2 = true;
        continue;
        }

        // Check if the input matches the format "date month year"
        var dateChecker = /^([1-9]|[1-2][0-9]|3[0-1]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4}$/i;
        if (!dateChecker.test(newMovieReleaseDate)) {
        console.log(`     Please enter the date in the format "day month year"! (e.g., 25 Jan 2023)`);
        newMovieAddValidate2 = true;
        } else {
        // Capitalize the month input
        newMovieReleaseDate = capitalizeMonth(newMovieReleaseDate);
        }
        } while (newMovieAddValidate2);

        // function to capitalize the month input
        function capitalizeMonth(dateString) {
            // fyi .replace method searches for a specified pattern in the string and replaces it with a new value
            return dateString.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i, function(match) {
                // fyi .charAt.toUpperCase is to change first letter to caps while .slice(1).toLowerCase makes from the second character onwards samll caps
                return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
            });
        }
        // Last Message
        do {
        var newMovieAddValidate3 = false;
        var newMovieRunTime = input.question(`\n     Please enter Movie's running time (mins): `);

        // Check if the input is empty
        if (newMovieRunTime.trim() === '') {
        console.log(`     Movie's running time cannot be empty. Please enter a valid running time!`);
        newMovieAddValidate3 = true;
        continue;
        }

        // Check if the input is a valid integer
        if (isNaN(newMovieRunTime)) {
        console.log(`     Please enter a valid integer for the running time!`);
        newMovieAddValidate3 = true;
        continue; 
        }

        // check if the input is a whole integer
        if (!Number.isInteger(parseFloat(newMovieRunTime))){
        console.log(`     Please enter a whole number for the running time!`);
        newMovieAddValidate3 = true;
        continue;
        }

        // Check if the input is greater than zero
        if (parseInt(newMovieRunTime) <= 0) {
        console.log(`     Please enter a positive number for the running time!`);
        newMovieAddValidate3 = true;
        }

        // Convert to an integer
        var newMovieRunTimeInt = parseInt(newMovieRunTime);
        } while (newMovieAddValidate3);

        this.MovieList.push(new Movie(newMovieAdd, newMovieGenres, newMovieRunTimeInt, newMovieReleaseDate, [0, 0]));
    }
    // 3rd Method
    addRating() {

        var movieToRateIndex;
        do {
        // First line of qn
        console.log(`\n     Select the movie to add a rating:`);
        // Lists all the movies
        for (let i = 0; i < this.MovieList.length; i++) {
        console.log(`     ${i + 1}) ${this.MovieList[i].name}`)
        }
        // Last qn for exiting back to main menu
        console.log(`     ${this.MovieList.length + 1}) Go Back to Main Menu`);
    
        var qnMovieToRateIndex = input.question(`     >> `);
        var addRatingValidate = false;
        
        // Check if input is empty
        if (qnMovieToRateIndex.trim() === '') {
            console.log(`     Movie to be rated cannot be empty. Please enter a valid movie index!`);
            addRatingValidate = true;
            continue;
        }
        
        // Check if input is a number and within the choice range
        if (isNaN(qnMovieToRateIndex) || qnMovieToRateIndex < 1 || qnMovieToRateIndex > this.MovieList.length + 1) {
            console.log(`     Kindly enter a valid movie index (number between 1 and ${this.MovieList.length + 1})!`);
            addRatingValidate = true;
        }
        } while (addRatingValidate);

        // Convert string to a number
        movieToRateIndex = parseInt(qnMovieToRateIndex);
    
        switch (movieToRateIndex) {
            // Exits out to the main menu
            case this.MovieList.length + 1:
            break;

            // Input is generated into a rating
            default:
                const selectedMovie = this.MovieList[movieToRateIndex - 1];
                var rating, qnRating;
                do {
                    qnRating = input.question(`\n     Enter your rating for '${selectedMovie.name}' (1 to 5 inclusive): `);
                    var addRatingValidate1 = false;

                    // Check if input is empty
                    if (qnRating.trim() === '') {
                        console.log(`     Rating cannot be empty. Please enter a valid movie rating!`);
                        addRatingValidate1 = true;
                        continue;
                    }

                    if (isNaN(qnRating) || qnRating < 1 || qnRating > 5) {
                        console.log(`     Kindly enter a valid rating (a number between 1 and 5)!`);
                        addRatingValidate1 = true
                    }
                } while (addRatingValidate1);
            // convert to a number
            rating = parseInt(qnRating);

            // Update movie's rating
            selectedMovie.rating[1] += rating; // Add the new rating to the total rating
            selectedMovie.rating[0]++; // add the vote count

            console.log(`     Thank you for rating '${selectedMovie.name}'!`);
            break;
            }
        }
    // 4th Method
    latest3ReleaseDate() {
        // Sort the movie list by release date in descending order
        // fyi The new Date() constructor is used to convert the release date strings into JavaScript Date objects
        // fyi .sort used to sort the elements of an array in place and returns the sorted array
        const sortedMovies = this.MovieList.sort(function(a, b) {return new Date(b.releaseDate) - new Date(a.releaseDate);});
        // Side note: How this thing works is it will run through the whole movielist then subtract the dates of a and b
        // if the result is positive, b is more recent vice versa
        console.log(`\n     The latest 3 movies are:`);
        var count = 0, i = 0;
        do {
            const movie = sortedMovies[i];
            console.log(`     ${count + 1}) ${movie.releaseDate} - ${movie.name}`);
            count++;
            i++;
        } while (count < 3);
    }
    // 5th Method
    filterByGenre() {
        const genreList = ['Action', 'Adventure', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller'];

        // to display the choices of genre to pick from 
        function displayGenreWithIndex(genre, index) {console.log(`     ${index + 1}) ${genre}`);}

        
        let selectedGenreIndex;
        do {
            console.log(`\n     Please select a genre:\n`);

            // fyi .forEach() is used to iterate over the elements of an array.
            genreList.forEach(displayGenreWithIndex);

            selectedGenreIndex = input.question(`     >> `);
            var filterByGenreValidator = false;

            // Check if input is not a number
            if (isNaN(selectedGenreIndex)) {
                console.log(`     Please enter a valid genre number from 1 to 9!`);
                filterByGenreValidator = true;
                continue;
            }
            
            // Check if input is empty
            if (selectedGenreIndex.trim() === '') {
                console.log(`     Input cannot be empty. Please enter a valid movie genre!`);
                filterByGenreValidator = true;
                continue;
            }

            // Convert to an integer
            selectedGenreIndex = parseInt(selectedGenreIndex);

            // Check if the selected genre index is within the valid range
            if (selectedGenreIndex < 1 || selectedGenreIndex > genreList.length) {
                console.log(`     Please enter a valid genre number within the range!`);
                filterByGenreValidator = true;
                continue;
            }

        } while (filterByGenreValidator);

        const selectedGenre = genreList[selectedGenreIndex - 1];
        console.log(`\n     You have selected "${selectedGenre}" genre:`);

        // Side note: So how this works is that it will run through each of the genre array in this.MovieList to see if
        // it has the selectedGenreIndex genre list in it and if it has the counter will increment and will display the movie
        // count will be the index of the movie
        let count = 0;
        for (const movie of this.MovieList) {
            if (movie.genre.includes(selectedGenre)) {
                console.log(`     ${count + 1}) ${movie.name}`);
                count++;
            }
        }

        if (count === 0) {
            // added just in case theres a no movies found with that genre
            console.log(`     No movies found with the "${selectedGenre}" genre.`);
        }
    }
// 6th Method - Comments Section (Advanced Feature)
commentsSection() {
    let selectedMovieIndex;

    while (true) {do {
        var commentsSectionValidator = false;
        console.log("\n     Select a movie to discuss about:");

        // lists all movies
        for (let i = 0; i < this.MovieList.length; i++) {console.log(`     ${i + 1}) ${this.MovieList[i].name}`);}
        console.log(`     ${this.MovieList.length + 1}) Return to Main Menu`);

        // input
        const inputIndex = input.question("     >> ");

        // Check if input is empty
        if (inputIndex.trim() === '') {
        console.log("     Input cannot be empty. Please enter a valid movie index!");
        commentsSectionValidator = true;
        continue; 
        }

        // Check if input is a non number, out of the movie index range
        if (isNaN(inputIndex) || inputIndex < 1 || inputIndex > this.MovieList.length + 1) {
            console.log("     Please enter a valid movie index!");
            commentsSectionValidator = true;
        }

        // Convert to an integer
        selectedMovieIndex = parseInt(inputIndex);

        if (selectedMovieIndex === this.MovieList.length + 1) {
            console.log("     Returning to the main menu...");
            return;
        } else if (selectedMovieIndex < 1 || selectedMovieIndex > this.MovieList.length) {
            console.log("     Please enter a valid movie index!");
            continue;
        } 
    } while(commentsSectionValidator)

        // decrement index by 1 to match the array index cuz like array index is zero index
        selectedMovieIndex--;

        const selectedMovie = this.MovieList[selectedMovieIndex];

        while (true) {
            console.log("\n     1) Add Comment");
            console.log("     2) View Comments");
            console.log("     3) Select Another Movie to Discuss About");
            console.log("     4) Return to Main Menu");
        
            const option = input.question("     >> ");
        
            switch (option) {
                // to write comments
                case "1":
                    let currentTime = new Date();
                    let hour = currentTime.getHours();
                    let min = currentTime.getMinutes();
                    let sec = currentTime.getSeconds();
                    let newComment = input.question("     Enter your comment (To exit type /exit): ");

                    // when user exits, nothing saves
                    if (newComment.trim().toLowerCase() === "/exit") {
                        console.log("     Exiting comment section...");
                        break;
                    }
                    
                    // adds date and time to string comment
                    newComment += ` - on ` + (currentTime.getDate() + ` ` + currentTime.toLocaleString('default', { month: 'long', weekday: 'long' }) + ` at ${hour}:${min}:${sec}`);
                    selectedMovie.addComment(newComment);
                    console.log("     Comment added!");
                    this.saveComments();
                    break;
        
                // to view comments
                case "2":
                    const comments = selectedMovie.getAllComments();
                    console.log(`\n     Comments about '${selectedMovie.name}':`);
                    // if no comments yet
                    if (comments.length === 0) {
                        console.log("     No comments yet.");
                    } else {
                        // if there are comments to view
                        comments.forEach(function (comment, index) {
                            console.log(`     ${capitalisedName}: ${comment}`);
                        });
                    }
                    break;
        
                // to select another movie
                case "3":
                    console.log("     Returning to movie selection...");
                    break;

                // to return to the main menu
                case "4":
                    console.log("     Returning to the main menu...");
                    return;
        
                default:
                    console.log("     Please enter a valid option!");
            }

            if (option === "3") {
                break; // Exit the inner loop and go back to selecting another movie
            }
        }
    }
}
   // Method to save comments to a file - Comments Section (Advanced Feature)
   saveComments() {
    try { // fyi the try catch loop is basically try the code may have an outlier then catch is to solve or do something if the outlier
         // actually happens
        for (const movie of this.MovieList) {
            // for each movie in the movielist will create a txt filepath where user comments will be kept
            // sanitise to remove special character in movie name to prevent it from having a filepath problem
            const sanitisedFileName = sanitiseFileName(movie.name);
            const commentsFilePath = `./comments_${sanitisedFileName}.txt`;
            // fyi comments are converted to a JSON string using JSON.stringify()
            // fyi utf8 parameter passed to fs.writeFileSync() specifies the character encoding to be used when writing the data
            fs.writeFileSync(commentsFilePath, JSON.stringify(movie.getAllComments()), 'utf8');
        }
        // if successful
        console.log("     Comments saved successfully!");
    } catch (error) {
        // if not successful
        console.log("     Error while saving comments.");
    }
}

// Method to load comments from a file - Comments Section (Advanced Feature)
loadComments() {
    try {
        for (const movie of this.MovieList) {
            // for each movie in the movielist a filepath is created to specific txt file for that certain movie where is 
            // is kept
            // again sanitised to ensure no filepath issues
            const sanitisedFileName = sanitiseFileName(movie.name);
            const commentsFilePath = `./comments_${sanitisedFileName}.txt`;
            if (fs.existsSync(commentsFilePath)) {
                // again file is read in utc-8 encoding lan so it is intepreted correctly
                const data = fs.readFileSync(commentsFilePath, 'utf8');
                // contents of comments are parsed from JSON string previously in the saveComments() 
                // back into js arrays using JSON.parse(data)
                const comments = JSON.parse(data);
                // this ensures comments for each movie are loaded and updated back into their corresponding movie objects
                movie.comments = comments;
            }
        }
    } catch (error) {
        // if catches a certain error error message displays
        console.log("     Error while loading comments.");
    }
}
}

//Main programme

console.log(`Welcome to Silver Vintage Movie Review Program`);
var name;

while (true) { // to check if name has special characters or numbers if has, rejects it and reasks the question
  name = input.question(`Please enter your name: `);

  var invalid = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  
  if (!invalid.test(name)) {
    break;
  } else {
    console.log("Please enter a valid name.");
  }
}

// Name checker
// fyi .slice used to extract a portion of an array or a substring of a string without modifying the original array or string
var firstChar = name.slice(0, 1);  // to capitalise the first letter and make the rest of the letters lower case
var upperCaseFirstChar = firstChar.toUpperCase();
var restOfName = name.slice(1).toLowerCase();
var capitalisedName = upperCaseFirstChar + restOfName;

// Create a single instance of MovieList
var movieList = new MovieList(); 

var choice;
do {
    choice = input.question(`
Hi ${capitalisedName}, please select your choices:
     1. Display All Movies
     2. Add Movie
     3. Add Rating
     4. Latest 3 Release Date
     5. Filter by Genre
     6. Comments Section
     7. Exit
     >> `);

    switch (choice) {
        case `1` :
            movieList.displayAllMovieDetails(); 
        break;
        case `2` :
            movieList.addMovie(); 
        break;
        case `3` :
            movieList.addRating();
        break;
        case `4` :
            movieList.latest3ReleaseDate();
        break;
        case `5` :
            movieList.filterByGenre();
        break;
        case `6` :
            movieList.commentsSection();
        break;
        case `7` :
        break;
        default :
            console.log(`Please enter a valid input.`)
    }

}while(choice!=`7`);

console.log(`Thank you & goodbye!`);
