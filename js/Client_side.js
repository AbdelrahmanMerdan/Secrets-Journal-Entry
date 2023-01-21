
var url = "https://secrets-server-side-production.up.railway.app";
// var url = "http://localhost:2000";

// login page
function login(){
  
  var usern = document.getElementById("user").value
  var pass = document.getElementById("pass").value
  
  if((usern != '') && (pass != '')){
    
        $.get(
          url + "/login" +'?data='+JSON.stringify({

          'action':'Login',
          "user" : usern,
          "pass": pass

          }),
          loginresponse
      );
  }
  else{
    document.getElementById("loginfail").innerHTML = "Wrong username or password, try again"
  }

  // $.get(url + "/hello", console.log('hello'))

}

function signup(){
  var usern = document.getElementById("user").value
  var pass = document.getElementById("pass").value
  
  $.post(
    url + "/signup"+ '?data='+JSON.stringify({

    'action':'Signup',
    "user" : usern,
    "pass": pass

    }),
    signupresponse
);

}


function loginresponse(data, status){
  var response = JSON.parse(data);

  var ff = response["flag"]
    
  if (ff){
      window.location.href="/Secrets-Journal-Entry/html/Project.html";

    }

  else{
    document.getElementById("loginfail").innerHTML = "Wrong username or password, try again"
  }
}

function signupresponse(data, status){
  var response = JSON.parse(data);

  var ff = response["flag"]
    
    if (ff){
        document.getElementById("success").innerHTML = "Success! You may now log in!";

      }
    else{
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
    

    if (check){
        
        var journal =  []
        
        journal.push(document.getElementById("Reflectiontitle").value)
        journal.push(document.getElementById("journalentry").value)
        journal.push(document.getElementById("Keypoints").value) 
        journal.push(document.getElementById("authornote").value)
        
      
        if (document.getElementById("red").checked == true){
            journal.push("Red")
          
            $.post(url + '/generatejournal' +'?data='+JSON.stringify({
                "entry": journal,
                'action':'generateJournal'
            }), submitjournalresponse)

            
        }

        else if (document.getElementById("blue").checked == true){
            journal.push("Blue")
            
            $.post(url+ '/generatejournal'+'?data='+JSON.stringify({
              "entry": journal,
              'action':'generateJournal'
          }), submitjournalresponse)
        }

        else if (document.getElementById("yellow").checked == true){
          journal.push("Yellow")
          
          $.post(url  + '/generatejournal' +'?data='+JSON.stringify({
            "entry": journal,
            'action':'generateJournal'
        }), submitjournalresponse)
      }

      else {
        journal.push("Green")
        
        $.post(url  + '/generatejournal' +'?data='+JSON.stringify({
          "entry": journal,
          'action':'generateJournal'
      }),submitjournalresponse)


    }

    }

    

}

function submitjournalresponse(data, status){
  var response = JSON.parse(data);

  if(response['flag']){
    alert("Journal added")
  }
  else{
    alert("Journal title already exists")
  }
}


function uncheckbtns(obj) {
  var box = document.getElementsByClassName("chck");
  for (var i = 0; i < box.length; i++) {
    box[i].checked = false;
  }
  obj.checked = true;
}

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
  var response = JSON.parse(data);

  var books = response["journals"]

    var len = books.length
    var i = 0

    while(i < len){

      var bk = books[i]
     
      createJbutton(bk)

      i += 1
    }
}




// creates the buttons that lead to each journal
function createJbutton(journal){
    
    var btn = document.createElement("button")
    var btntxt = document.createElement("span")
    btn.id = "Journals"
    
    
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

    
    btn.innerHTML = " <span id = 'btntxt'>" + journal[0] + "</span> " 

    var deletebtn = document.createElement("button")
    deletebtn.innerHTML = "delete"
    deletebtn.id = "deleteJournals"
    deletebtn.addEventListener("click", function(){
      deletejournal(journal[0])
      
    })

    btn.addEventListener("click", function(){
      document.getElementById("Rtitle").innerHTML = journal[0]
      document.getElementById("JEntry").innerHTML = journal[1]
      document.getElementById("kpoint").innerHTML = journal[2]
      document.getElementById("anote").innerHTML = journal[3]
      document.getElementById("deletebtn").innerHTML = ""
      document.getElementById("deletebtn").append(deletebtn)
      changebookcovertitle(journal[4])
    
    })
    
    document.getElementById("main").append(btn)
}

function changebookcovertitle(color){
  var cover = document.getElementById('covers')
  var paper = document.getElementById('paper')

  paper.src = "https://i.imgur.com/5KIttz0.png"
  
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

function deletejournal(title){
  $.post(
    url+ '/deletejournal' +'?data='+JSON.stringify({

    'action':'delete',
    "journal" : title

    })
    
);
alert("Journal deleted, refresh page to see")

}


// changes the settings of the user by sending to server
function settings(){
  var usern = document.getElementById("userset").value
  var pass = document.getElementById("passset").value
  var repass = document.getElementById("passreset").value

  if(pass != repass){
    
    alert("passwords don't match")
  }
  else{
    $.post(
      url + '/setting' +'?data='+JSON.stringify({

      'action':'Sett',
      "user" : usern,
      "pass": pass,
    
      }),
      settingsresponse)
    }  
}

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

  // if ((window.location.href.match('Project.html') != null)||
  //     (window.location.href.match('CreateJournal.html') != null)||
  //     (window.location.href.match('customization.html') != null)||
  //     (window.location.href.match('mysetting.html') != null)) {
  //       // customizepage()
  //       // placePpic()
        
        
  //       console.log("hello!")
        
  //   }

  }



