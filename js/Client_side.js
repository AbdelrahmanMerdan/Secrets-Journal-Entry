
var url = "https://secrets-server-side-production.up.railway.app";
// var url = "http://localhost:2000";

// login page
// This function is called when a login form is submitted.
function login(){
  // Get the values of the 'user' and 'pass' fields from the HTML form.
  var usern = document.getElementById("user").value
  var pass = document.getElementById("pass").value
  // Check if both the 'usern' and 'pass' fields are not empty.
  if((usern != '') && (pass != '')){
        // Send a GET request to the server with the login information as query parameters.
        $.get(
          url + "/login" +'?data='+JSON.stringify({

          'action':'Login',
          "user" : usern,
          "pass": pass

          }),
          loginresponse
      );
  }
  // Display an error message on the HTML page when the 'usern' or 'pass' fields are empty.
  else{
    document.getElementById("loginfail").innerHTML = "Wrong username or password, try again"
  }
}
// This function is called when a user submits a signup form.
function signup(){
  // Get the values of the 'user' and 'pass' fields from the HTML form.
  var usern = document.getElementById("user").value
  var pass = document.getElementById("pass").value
  // Send a POST request to the server with the signup information as data in the request body.
  $.post(
    url + "/signup"+ '?data='+JSON.stringify({

    'action':'Signup',
    "user" : usern,
    "pass": pass

    }),
    signupresponse
);

}

// This function, named 'loginresponse', is called as a callback when a response is received from a login request.
function loginresponse(data, status){
  // Parse the JSON data received from the server.
  var response = JSON.parse(data);
  // Extract the 'flag' value from the response, indicating the success of the login attempt.
  var ff = response["flag"]
  // If 'ff' is true (login was successful):  
  if (ff){
    // Redirect the user to the main application page.
      window.location.href="/Secrets-Journal-Entry/Project.html";

    }
  else{
    // If 'ff' is false, display an error message on the HTML page indicating a failed login attempt.
    document.getElementById("loginfail").innerHTML = "Wrong username or password, try again"
  }
}

// This function, named 'signupresponse', is called as a callback when a response is received from a signup request.
function signupresponse(data, status){
  // Parse the JSON data received from the server.
  var response = JSON.parse(data);
  // Extract the 'flag' value from the response, indicating the success of the signup attempt.
  var ff = response["flag"]
    // If 'ff' is true (signup was successful):
    if (ff){
        // Display a success message on the HTML page, indicating that the signup was successful.
        document.getElementById("success").innerHTML = "Success! You may now log in!";

      }
    else{
      // If 'ff' is false, display an error message on the HTML page indicating that the chosen username is already taken.
      document.getElementById("success").innerHTML = "This username is take, try another username";
    }

}


// side bar
function openBar() {
  document.getElementById("myBar").style.width = "250px";
  document.getElementById("mainContent").style.marginLeft = "250px";
}

function closeBar() {
  document.getElementById("myBar").style.width = "0";
  document.getElementById("mainContent").style.marginLeft= "0";
}

// In the journal entry, you have nested lists, [Reflection title, Journal entry , Key points, Authors note, Readers note, color]
// Submit Journal into the data
function SubmitJ(){
   
    
    var check = true
    
    // Check if 'check' is true.
    if (check){
        // Create an array 'journal' to store journal entry data.
        var journal =  []
        // Add data from the form fields to the 'journal' array.
        journal.push(document.getElementById("Reflectiontitle").value)
        journal.push(document.getElementById("journalentry").value)
        journal.push(document.getElementById("Keypoints").value) 
        journal.push(document.getElementById("authornote").value)
        
        // Determine the selected color and add it to the 'journal' array.
        if (document.getElementById("red").checked == true){
            journal.push("Red")
            // Send a POST request to the server to generate and save the journal entry.
            $.post(url + '/generatejournal' +'?data='+JSON.stringify({
                "entry": journal,
                'action':'generateJournal'
            }), submitjournalresponse)

            
        }

        else if (document.getElementById("blue").checked == true){
            journal.push("Blue")
            // Send a POST request to the server to generate and save the journal entry.
            $.post(url+ '/generatejournal'+'?data='+JSON.stringify({
              "entry": journal,
              'action':'generateJournal'
          }), submitjournalresponse)
        }

        else if (document.getElementById("yellow").checked == true){
          journal.push("Yellow")
          // Send a POST request to the server to generate and save the journal entry.
          $.post(url  + '/generatejournal' +'?data='+JSON.stringify({
            "entry": journal,
            'action':'generateJournal'
        }), submitjournalresponse)
      }

      else {
        journal.push("Green")
        // Send a POST request to the server to generate and save the journal entry.
        $.post(url  + '/generatejournal' +'?data='+JSON.stringify({
          "entry": journal,
          'action':'generateJournal'
      }),submitjournalresponse)

    }

    }

    

}
// Alerts user that journal is added
function submitjournalresponse(data, status){
  var response = JSON.parse(data);

  if(response['flag']){
    alert("Journal added")
  }
  else{
    alert("Journal title already exists")
  }
}

//changes book covers
function uncheckbtns(obj) {
  var box = document.getElementsByClassName("chck");
  for (var i = 0; i < box.length; i++) {
    box[i].checked = false;
  }
  obj.checked = true;
}

//changes book covers
function changebookcover(obj) {
  var cover = document.getElementById('covers')
  if($(obj).is(":checked")){
    if (obj.value == 'red'){
      cover.src = "https://i.imgur.com/OdqFX0P.png"
    }
    else if (obj.value == 'blue'){
      cover.src = "https://i.imgur.com/EyFxKPO.png"
    }
    else if (obj.value == 'yellow'){
      cover.src = "https://i.imgur.com/2um356T.png"
    }
    else if (obj.value == 'green'){
      cover.src = "https://i.imgur.com/TYhNJJC.png"
    }
    
    


  }else{
    alert("Not checked"); //when not checked
  }
  
}

// asks the server to send the info to create the books
function addjournaltopage(){
  $.post(
    url + '/addjournal' + '?data='+JSON.stringify({

    'action':'AddJournal',
    "trial" : "helloooo"

    }),
    addjournalrespone
);
}

function addjournalrespone(data, status){
  // Parse the JSON data received from the server.
  var response = JSON.parse(data);
  // Extract the 'journals' array from the response, which contains the retrieved journal entries.
  var books = response["journals"]

    var len = books.length
    var i = 0
    // Iterate through the 'journals' array and create buttons for each journal entry.
    while(i < len){
      // Get a single journal entry from the array.
      var bk = books[i]
      // Call a function 'createJbutton' with the journal entry to create a button for it.
      createJbutton(bk)

      i += 1
    }
}




// creates the buttons that lead to each journal
function createJbutton(journal){
    // Create a new button element and a span element to hold button text.
    var btn = document.createElement("button")
    var btntxt = document.createElement("span")
    // Set the 'id' of the button to "Journals".
    btn.id = "Journals"
    
    // Determine the color of the journal entry and set the 'id' of the button accordingly.
    if(journal[4] == "Red") {
      btn.id = "JournalsRED"
      
    }
    else if(journal[4] == "Blue"){
      btn.id = "JournalsBLUE"
      
    }
    else if(journal[4] == "Yellow"){
      btn.id = "JournalsYELLOW"
      
    }
    else{
      btn.id = "JournalsGREEN"
      
    } 

    // Set the inner HTML of the button with the title of the journal entry.
    btn.innerHTML = " <span id = 'btntxt'>" + journal[0] + "</span> " 
    // Create a "delete" button for removing the journal entry.
    var deletebtn = document.createElement("button")
    deletebtn.innerHTML = "delete"
    deletebtn.id = "deleteJournals"
    deletebtn.addEventListener("click", function(){
      // Add an event listener to the delete button to trigger the deletion of the journal entry.
      deletejournal(journal[0])
      
    })
    // Add an event listener to the main button to display the journal entry details when clicked.
    btn.addEventListener("click", function(){
      document.getElementById("Rtitle").innerHTML = journal[0]
      document.getElementById("JEntry").innerHTML = journal[1]
      document.getElementById("kpoint").innerHTML = journal[2]
      document.getElementById("anote").innerHTML = journal[3]
      document.getElementById("deletebtn").innerHTML = ""
      document.getElementById("deletebtn").append(deletebtn)
      changebookcovertitle(journal[4])
    
    })
    // Append the button to the main element of the webpage.
    document.getElementById("main").append(btn)
}

function changebookcovertitle(color){
  // Get references to the 'covers' and 'paper' elements from the HTML.
  var cover = document.getElementById('covers')
  var paper = document.getElementById('paper')

    // Check the color of the journal entry and set the 'src' attribute of the 'cover' element accordingly.
    if (color == 'Red'){
      cover.src = "https://i.imgur.com/OdqFX0P.png"
      
    }
    else if (color == 'Blue'){
      cover.src = "https://i.imgur.com/EyFxKPO.png"
      
    }
    else if (color == 'Yellow'){
      cover.src = "https://i.imgur.com/2um356T.png"
    }
    else if (color == 'Green'){
      cover.src = "https://i.imgur.com/TYhNJJC.png"
    }

}

// This function, named 'deletejournal', is used to send a request to the server to delete a journal entry by title.
function deletejournal(title){
  // Send a POST request to the server to request the deletion of the journal entry with the specified title.
  $.post(
    url+ '/deletejournal' +'?data='+JSON.stringify({

    'action':'delete',
    "journal" : title

    })
    
);
// Display an alert to inform the user that the journal has been deleted and suggest refreshing the page to see the changes.
alert("Journal deleted, refresh page to see")

}


// changes the settings of the user by sending to server
function settings(){
  // Get the values of the 'userset', 'passset', and 'passreset' fields from the HTML form.
  var usern = document.getElementById("userset").value
  var pass = document.getElementById("passset").value
  var repass = document.getElementById("passreset").value
  // Check if the 'pass' and 'repass' fields do not match.
  if(pass != repass){
    
    alert("passwords don't match")
  }
  else{
    // If the passwords match, send a POST request to the server with the updated user information.
    $.post(
      url + '/setting' +'?data='+JSON.stringify({

      'action':'Sett',
      "user" : usern,
      "pass": pass,
    
      }),
      settingsresponse)
    }  
}
//The response to Settings
function settingsresponse(data, status){
  var response = JSON.parse(data);

  var ff = response["flag"]

        if (ff){
          alert("username and password have been changed")
        }
        else{
          alert("Username is taken by another user")
        }


}

// responds to the requests made to the server


// profile picture 

// function profilePicture(num){
// 	var im = document.getElementById("pfp");
// 	switch (num) {
// 		case 0:
// 			im.src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png";
      
//       $.post(
//         url + '/profilepicture' +'?data='+JSON.stringify({

//           'action':'Profile',
//           "theme" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
//         })
        
//         ) 
// 			break;
// 		case 1:
// 			im.src="https://cdn.pixabay.com/photo/2022/01/11/19/43/avocado-6931344_1280.jpg";
//       $.post(
//         url + '/profilepicture' +'?data='+JSON.stringify({

//           'action':'Profile',
//           "theme" : "https://cdn.pixabay.com/photo/2022/01/11/19/43/avocado-6931344_1280.jpg"
//         })
        
//         ) 
// 			break;
// 		case 2:
// 			im.src="https://cdn.pixabay.com/photo/2018/05/26/18/06/dog-3431913_1280.jpg";
//       $.post(
//         url + '/profilepicture' +'?data='+JSON.stringify({

//           'action':'Profile',
//           "theme" : "https://cdn.pixabay.com/photo/2018/05/26/18/06/dog-3431913_1280.jpg"
//         })
        
//         ) 
// 			break;
// 		case 3:
// 			im.src="https://cdn.pixabay.com/photo/2017/11/06/18/30/eggplant-2924511_1280.png";
//       $.post(
//         url + '/profilepicture' +'?data='+JSON.stringify({

//           'action':'Profile',
//           "theme" : "https://cdn.pixabay.com/photo/2017/11/06/18/30/eggplant-2924511_1280.png"
//         })
        
//         ) 
// 			break;
// 	}
// }

// function placePpic(){
//   $.post(
//     url + '/placeprofilepicture' +'?data='+JSON.stringify({

//     'action':'Ppic',

//     }),
//     placeppicresponse
//   );

// }

// function placeppicresponse(data, status){
//   var response = JSON.parse(data);
//   document.getElementById("profilepic").src = response["url"]
// }

// Customization


// add reminder buttons

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}


function alertremider(m){
  
  alert(m)
  
}

//Not yet implemented
function reminder(){

  var title = document.getElementById("remtitle").value
  var time = document.getElementById("remtime").value
  var notes = document.getElementById("remnotes").value

  $.post(
    url+'?data='+JSON.stringify({

    'action':'reminder',
    "title" : title,
    "time": time,
    "notes": notes

    }),
    response)


}

window.onload = function() {
    
  if (window.location.href.match('Project.html') != null) {
  addjournaltopage()
  }

  }



