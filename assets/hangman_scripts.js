$(document).ready(function(){
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  //FUNCTIONS
  //1. New random word
  function newRandomWord() {
    $.ajax({
      type: "GET",
      url: "http://randomword.setgetgo.com/get.php",
      dataType: "jsonp",
      jsonpCallback: 'RandomWordComplete',
      success: function(data) {
        var randomWord = data.Word.toLowerCase();
        var newRow = $("tr");
        console.log("The new random word is: " + randomWord);
        for (var i = 0; i < randomWord.length; i++) {
          newRow.append($("<td class='randomWordTd randomWordTdWhite'>" + randomWord[i] + "</td>"));
        }
        $("#randomWordTable").append(function(){
            $(newRow).show(2000);
        });
        $(".remainingLetters").html("<h3>You have " + randomWord.length + " letters remaining for guessing</h3>");
        $("#usedLetters").empty();
        $("#wordSubmit").click(function(){
          var $wordGuess = $("#iKnowTheWord").val().toLowerCase();
          if ($wordGuess === randomWord) {
            $("#infoMessage").html("<h3>That is great! You have guessed the word. YOU WON!</h3>");
            $("#imageArea").html("<img class='finalImage' src='assets/images/escape.gif'>");
          }
          else {
            $("#infoMessage").html("<h3>Sorry, the right word is " + randomWord + ". You lost :-(</h3>");
            $("#imageArea").html("<img src='assets/images/12.jpg'>");
          }
        });
      } //End of success key
    }); //End of $.ajax({})
  } //End of newRandomWord function declaration

  //2. New letter entry

  var controlNumber = 1;
  function newLetterEntry() {
    var $letterGuess = $("#newLetter").val().toLowerCase();
    var imageChanger = controlNumber;
    // alert($letterGuess);
    var counter = 0;
    var $wordToGuess = $("td[class='randomWordTd randomWordTdWhite']").text();
    var $guessedLetters = $("td[class='randomWordTd randomWordTdBlack']").text();
    var wordLength = $wordToGuess.length;
    // console.log("The remaining letters are: " + $wordToGuess);
    // console.log("The found letters are: " + $guessedLetters);
    var usedLettersString = $("#usedLetters").text()
    if (usedLettersString.indexOf($letterGuess) !== -1 || $guessedLetters.indexOf($letterGuess) !== -1) {
      $("#infoMessage").html("<h3>You have already tried to guess this letter. Try again.");
    }
    else {
      for (var i = 0; i < wordLength; i++) {
        // console.log("checking on position " + i + " for the element " + $wordToGuess[i] + " and with image changer " + imageChanger);
        if ($letterGuess === $wordToGuess[i]) {
          // console.log("Inside the if statement. $letterGuess is " + $letterGuess + " and $wordToGuess is " + $wordToGuess[i] + " for position " + i);
          $("#infoMessage").html("<h3>That is correct! The letter '" + $letterGuess + "' is included in the secret word</h3>");
          $($("td[class='randomWordTd randomWordTdWhite']")[i - counter]).removeClass("randomWordTdWhite").addClass("randomWordTdBlack");
          counter +=1;
          $(".remainingLetters").html("<h3>You have " + ($wordToGuess.length - counter) + " letters remaining for guessing</h3>");
          // console.log("counter is " + counter + " and word length is " + wordLength);
          if (wordLength - counter === 0) {
            $("#infoMessage").html("<h3>That is great! You have guessed the word. YOU WON!</h3>");
            $("#imageArea").html("<img class='finalImage' src='assets/images/escape.gif'>");
          }
        }
        else if ($wordToGuess.indexOf($letterGuess) !== -1 && $letterGuess !== $wordToGuess[i]) {
          continue;
        }
        else {
          imageChanger += 1;
          // console.log("imageChanger is " + imageChanger);
          if (imageChanger >= 12) {
            $("#infoMessage").html("<h3>Sorry, you lost. The word is '" + $("td").text() + "'. Better luck next time.");
            $("#imageArea").html("<img src='assets/images/12.jpg'>");
            imageChanger = 0;
            controlNumber = 1;
            break;
          }
          else {
            $("#infoMessage").html("<h3>Bummer. The letter '" + $letterGuess + "' is not included in the secret word.</h3>");
            $("#imageArea").html("<img src='assets/images/" + imageChanger + ".jpg'>");
            $("#usedLetters").append($letterGuess + " ");
            break;
          }
        } //else if the letter is not matching
      } //End of for loop for evaluating the letter matching
    } //else if the letter has not been evaluated already

    if (imageChanger > controlNumber) {
      controlNumber = imageChanger;
    }
  } //End of newLetterEntry function

  //GAME FLOW
  $(".startButton").click(function(){
    $("tr").empty();
    $("#infoMessage").empty();
    $("#imageArea").html("<img src='assets/images/1.jpg'>");
    newRandomWord();
  });  //End of $(".startButton").click

  $("#letterSubmit").click(function(){
    var $newLetter = $("#newLetter").val().toLowerCase();
    if ($newLetter.length === 0 || alphabet.indexOf($newLetter) === -1) {
      $("#infoMessage").html("<h3>Please enter a valid alphabet letter</h3>");
    }
    else {
      newLetterEntry();
    }

  });

});
