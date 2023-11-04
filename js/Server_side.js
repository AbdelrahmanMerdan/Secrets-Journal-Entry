// Express
var express = require('express');
var app = express();
app.use(express.static('public'));


// mongodb connection
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Bodo:Bodo0101@cluster0.ph9lr1p.mongodb.net/?retryWrites=true&w=majority" 
const client = new MongoClient(uri)

//host listening
app.listen(2000,  () => console.log("Server is running! (listening on port " +  ")") )



// This shouldnt be needed anymore
var users = {
    "user1" : {
        "Username" : "user1" ,
        "Password" : "1234",
        "Journal_Entrys" : [],
        "Reminders": [],
        "Settings" : ["lightgray", "#CE7777", "#2B3A55"],
        "Profilepic" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
    }
              
}



//Normally this is empty and it gets replaced by the user logging in , but for now we populate it
var user = users.user1



app.use(express.static("Combine"))


// Login and Signup
// This code defines a route handler for the '/login' endpoint in your application.
app.get('/login', (req, res) => {
    
    // Set the "Access-Control-Allow-Origin" header to allow cross-origin requests.
    res.header("Access-Control-Allow-Origin", "*");

    // Parse the 'data' parameter from the query string in the request as JSON.
    var z = JSON.parse(req.query['data'])

    // Extract the 'user' and 'pass' values from the parsed JSON.
    var usern = z["user"]
    var pass = z["pass"]

    // Find a user with the provided username in a MongoDB collection named "Users" in the "Secrets" database.
    const finduser = client.db("Secrets").collection("Users").find({Username: usern})
        .toArray()
        .then((response) => {
            return response
        })
    
    // Define a function to check the users found by finduser.
    const checkUsers = () => {
            finduser.then((usersfound) => {

                // If no users are found with the given username:
                if(usersfound.length == 0){
                    console.log("empty no user with username")
                    var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': false,
                        });
                        
                        res.send(jsontext)

                }
                // If a user is found with the given username:
                else{
                     // Check if the provided 'pass' matches the password stored in the database for the first user found.
                    if(usersfound[0].Password == pass){
                        // Assign the user information to the 'user' variable.
                        user = usersfound[0]
                        console.log(user)
                        // Create a JSON response indicating success and send it to the client.
                        var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': true,
                    })
                    res.send(jsontext)
                }
                // If the password does not match:        
                else{
                    // Create a JSON response indicating failure and send it to the client.
                    var jsontext = JSON.stringify({
                        'action': z['action'],
                        'flag': false,
                })
                console.log("Wrong Pass")
                res.send(jsontext)

                }
                    
                
                }
            })
    }
    // Call the 'checkUsers' function to initiate the user authentication process.
     checkUsers()
})

app.post('/signup', (req, res) => {
    
    // Set the "Access-Control-Allow-Origin" header to allow cross-origin requests.
    res.header("Access-Control-Allow-Origin", "*");

    // Parse the 'data' parameter from the query string in the request as JSON.
    var z = JSON.parse(req.query['data'])

    // Extract the 'user' and 'pass' values from the parsed JSON.
    var usern = z["user"]
    var pass = z["pass"]
    
    // Find a user with the provided username in a MongoDB collection named "Users" in the "Secrets" database.
    const finduser = client.db("Secrets").collection("Users").find({Username: usern})
        .toArray()
        .then((response) => {
            return response
        })
    // Define a function to add a new user or return an error if the username is already taken.
        const addUsers = () => {
            finduser.then((usersfound) => {
                
                // If no users are found with the given username:
                if(usersfound.length == 0){
                    console.log("Creating User!")
                    // Create a new user object with default values.
                    var newuser = {
                                "Username" : usern ,
                                "Password" : pass,
                                "Journal_Entrys" : [],
                                "Reminders": [],
                                "Settings" : ["lightgray", "#CE7777", "#2B3A55"],
                                "Profilepic" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                            }
                        // Insert the new user into the "Users" collection in the database.
                        client.db("Secrets").collection("Users").insertOne(newuser)
                    
                        // Create a JSON response indicating success and send it to the client.
                        var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': true,
                        });
                        
                        res.send(jsontext)

                }
                    
                // If a user with the same username already exists:
                else{
                    console.log("already taken")
                    // Create a JSON response indicating failure (username already taken) and send it to the client.
                    var jsontext = JSON.stringify({
                    'action': z['action'],
                    'flag': false,
                });
                
                res.send(jsontext)
                }
                });
            };
            // Call the 'addUsers' function to initiate the user creation process.
            addUsers()

    

   
})


//Add Journal and Delete it

// This code defines a route handler for the '/generatejournal' endpoint in your application, expecting a POST request.
app.post('/generatejournal' , (req, res) => {
    
    // Set the "Access-Control-Allow-Origin" header to allow cross-origin requests.
    res.header("Access-Control-Allow-Origin", "*");

    // Parse the 'data' parameter from the query string in the request as JSON.
    var z = JSON.parse(req.query['data'])

    // Create a query to find the user's information in a MongoDB collection based on the user's stored Username.
    const finduser = client.db("Secrets").collection("Users").find({Username: user.Username})
    .toArray()
    .then((response) => {
        return response
    })

// Define a function to add a new journal entry or return an error if a journal entry with the same title already exists for the user.
const addJournal = () => {
    finduser.then((usersfound) => {
        var flag = true
        // Check if a journal entry with the same title already exists for the user.
       for(var n in user["Journal_Entrys"]){
        if(user["Journal_Entrys"][n][0] == z["entry"][0]){
            flag = false                    
        }
    }

        if (flag){
            // Update the user's document in the "Users" collection by pushing the new journal entry.
            client.db("Secrets").collection("Users")
            .updateOne({Username:user.Username }, {$push: {Journal_Entrys: z["entry"]}})
            // Also update the local 'user' object to reflect the change.
            user.Journal_Entrys.push(z["entry"])
            console.log(user)
            // Create a JSON response indicating success and send it to the client.
            var jsontext = JSON.stringify({
            'action': z['action'],
            'flag': flag
            });
            res.send(jsontext)
            
        }
        else{
            // Create a JSON response indicating failure (entry already exists) and send it to the client.
            var jsontext = JSON.stringify({
                'action': z['action'],
                'flag': flag
                });
                console.log("not updated")
                res.send(jsontext)
        }

            
    })

    
}
    // Call the 'addJournal' function to initiate the process of adding a journal entry.
addJournal()   
    
    
   
})


app.post('/addjournal' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])   

    var jsontext = JSON.stringify({
        'action': z['action'],
        'journals': user.Journal_Entrys,
    });

    console.log(JSON.parse(jsontext)["action"])
    res.send(jsontext)
   
})

app.post('/deletejournal' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])
    
    for(var n in user["Journal_Entrys"]){
        // console.log(user["Journal_Entrys"][n][0])
        if(user["Journal_Entrys"][n][0] == z["journal"]){
            var tr =user["Journal_Entrys"][n][0] == z["journal"]
            
            user["Journal_Entrys"].splice(n,1)

            console.log(user["Journal_Entrys"])

            removejournal()         
        }
    } 
    
   
})


//Change Username and Password
app.post('/setting' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data']) 
    
    var userset = z["user"]
    var passet = z["pass"]
    
        
        const finduser = client.db("Secrets").collection("Users").find({Username: userset})
            .toArray()
            .then((response) => {
                return response
            })

        const changeuser = () => {
            finduser.then((usersfound) => {
                
                
                if(  ((usersfound.length == 1) && (usersfound[0].Username == user.Username)) || (usersfound.length == 0)){
                    console.log("Changing User!")
                    
                    if(userset != ''){
                        client.db("Secrets").collection("Users").updateOne({Username: user.Username}, {$set: {"Username": userset}})
                            .then(console.log("Changed Username"))
                        
                        user["Username"] = userset 
                    }

                    if(passet != ''){
                        client.db("Secrets").collection("Users").updateOne({Username: user.Username}, {$set: {"Password": passet}})
                            .then(console.log("Changed Password"))
                        user["Password"] = passet 

                    }

                        var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': true,
                        });
                        
                        res.send(jsontext)

                }



                else{
                    console.log("already taken, not changed")
                    var jsontext = JSON.stringify({
                    'action': z['action'],
                    'flag': false,
                });
                
                res.send(jsontext)
                }
                });
            };

            changeuser()
   
})


//Customize Pages
app.post('/customize' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])  
    
    var num = z["theme"]
        
    if(num == 0){
        user["Settings"] = ["lightgray", "#CE7777", "#2B3A55"]
    }
    else if(num == 1){
        user["Settings"] = ["#E8C4C4", "#8EACD0", "#B0C1DB"]
        
    }
    else if(num == 2){
        user["Settings"] = ["#FCDDB0", "#FF9F9F", "#E97777"]
    }
    else if(num == 3){
        user["Settings"] = ["#FBF7F0", "#D9E400", "#CDC9C3"]
    }
   
})

app.post('/customizepage' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])   

    var jsontext = JSON.stringify({
        
        'action': z['action'],
        "back" : user["Settings"][0],
        "top": user["Settings"][1],
        "myBar":user["Settings"][2]
    });

    res.send(jsontext)
   
})

app.post('/profilepicture' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])

    user["Profilepic"] = z["theme"]
   
})

app.post('/placeprofilepicture' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])

    var jsontext = JSON.stringify({
        
        'action': z['action'],
        'url': user["Profilepic"]
    });
    // console.log(user["Profilepic"])
    
    res.send(jsontext)

       
})


app.post('/w' , (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])

    
   
})






// This shouldnt be needed anymore
app.post('/post', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    var z = JSON.parse(req.query['data'])

    // take the create Journal action and put the journal into the user
    if(z["action"] == 'generateJournal'){
        

            // var flag = true

            // for(var n in user["Journal_Entrys"]){
            
            //     if(user["Journal_Entrys"][n][0] == z["entry"][0]){
                    
            //         flag = false                    
            //     }
            // }

            // if(flag){
            //     user.Journal_Entrys.push(z["entry"])
            //     console.log(z["entry"])
            // }

            // var jsontext = JSON.stringify({
            //     'action': z['action'],
            //     'flag': flag
            // });
    
            // res.send(jsontext)



            const finduser = client.db("Secrets").collection("Users").find({Username: usern})
            .toArray()
            .then((response) => {
                return response
            })

        const addJournal = () => {
            finduser.then((usersfound) => {
                var flag = true
               for(var n in user["Journal_Entrys"]){
            
                if(user["Journal_Entrys"][n][0] == z["entry"][0]){
                    
                    flag = false                    
                }
            }

                if (flag){
                    client.db("Secrets").collection("Users")
                    .updateOne({Username:user.Username }, {$push: {Journal_Entrys: z["entry"]}})

                    user.Journal_Entrys.push(z["entry"])
                    console.log(user)

                    var jsontext = JSON.stringify({
                    'action': z['action'],
                    'flag': flag
                    });
                    res.send(jsontext)
                    
                }
                else{
                    var jsontext = JSON.stringify({
                        'action': z['action'],
                        'flag': flag
                        });
                        console.log("not updated")
                        res.send(jsontext)
                }

                    
            })

            
        }
        addJournal()         
      
    }
    else if(z["action"] == 'AddJournal'){
        
        var jsontext = JSON.stringify({
            'action': z['action'],
            'journals': user.Journal_Entrys,
        });

        console.log(JSON.parse(jsontext)["action"])
        res.send(jsontext)
    }
    
    else if(z["action"] == 'Login'){
        // var usern = z["user"]
        // var pass = z["pass"]

        // var flag = false

        // for (var use in users){
            
        //     if (users[use]["Username"] == usern){
        //         console.log(users[use]["Username"])
        //         if(users[use]["Password"] == pass){
        //             flag = true
        //             user = users[use]
        //         }
        //     }
        // }
        // var jsontext = JSON.stringify({
        //     'action': z['action'],
        //     'flag': flag,
        // });
        
        // res.send(jsontext)

        var usern = z["user"]
        var pass = z["pass"]

        const finduser = client.db("Secrets").collection("Users").find({Username: usern})
            .toArray()
            .then((response) => {
                return response
            })

        const checkUsers = () => {
            finduser.then((usersfound) => {
            
                if(usersfound.length == 0){
                    console.log("empty no user with username")
                    var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': false,
                        });
                        
                        res.send(jsontext)

                }

                else{
                    if(usersfound[0].Password == pass){
                        user = usersfound[0]
                        console.log(user)
                        var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': true,
                    })
                    res.send(jsontext)
                }
                else{
                    var jsontext = JSON.stringify({
                        'action': z['action'],
                        'flag': false,
                })
                res.send(jsontext)

                }
                    
                
                }
            })
        }

        checkUsers()
    }
    
    else if(z["action"] == 'Signup'){
        // var usern = z["user"]
        // var pass = z["pass"]

        // var flag = true

        // for (var use in users){
            
        //     if (users[use]["Username"] == usern){
        //             flag = false
        //         }
        //     }
        

        // if (flag){
        //     var newuser = {
        //         "Username" : usern ,
        //         "Password" : pass,
        //         "Journal_Entrys" : [],
        //         "Reminders": [],
        //         "Settings" : ["lightgray", "#CE7777", "#2B3A55"],
        //         "Profilepic" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
        //     }
        //     users[usern] = {
        //         "Username" : usern ,
        //         "Password" : pass,
        //         "Journal_Entrys" : [],
        //         "Reminders": [],
        //         "Settings" : ["lightgray", "#CE7777", "#2B3A55"],
        //         "Profilepic" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
        //     }

        //     client.db("Secrets").collection("Users").insertOne(newuser)

        //     console.log(users[usern])
        // }
        // var jsontext = JSON.stringify({
        //     'action': z['action'],
        //     'flag': flag,
        // });
        
        // res.send(jsontext)

        var usern = z["user"]
        var pass = z["pass"]

        const finduser = client.db("Secrets").collection("Users").find({Username: usern})
            .toArray()
            .then((response) => {
                return response
            })

        const addUsers = () => {
            finduser.then((usersfound) => {
            
                if(usersfound.length == 0){
                    console.log("empty")
                    var newuser = {
                                "Username" : usern ,
                                "Password" : pass,
                                "Journal_Entrys" : [],
                                "Reminders": [],
                                "Settings" : ["lightgray", "#CE7777", "#2B3A55"],
                                "Profilepic" : "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png"
                            }
                        client.db("Secrets").collection("Users").insertOne(newuser)

                        var jsontext = JSON.stringify({
                            'action': z['action'],
                            'flag': true,
                        });
                        
                        res.send(jsontext)

                }



                else{
                    console.log("already taken")
                    var jsontext = JSON.stringify({
                    'action': z['action'],
                    'flag': false,
                });
                
                res.send(jsontext)
                }
                });
            };

            addUsers()

    }

    else if(z["action"] == 'Sett'){
        var userset = z["user"]
        var passet = z["pass"]
    
        var flag = true

        
        for (var use in users){

            if (users[use]["Username"] == userset){
                    flag = false
                }
            }
        
        if(flag){
            
            user["Password"] = passet
            if(userset != ""){
                user["Username"] = userset 
                console.log(user["Username"])
            }
        }

        var jsontext = JSON.stringify({
            'action': z['action'],
            'flag': flag,
        });
        
        res.send(jsontext)
    
    }

    else if(z["action"] == 'Customize'){
        
        var num = z["theme"]
        
        if(num == 0){
            user["Settings"] = ["lightgray", "#CE7777", "#2B3A55"]
        }
        else if(num == 1){
            user["Settings"] = ["#E8C4C4", "#8EACD0", "#B0C1DB"]
            
        }
        else if(num == 2){
            user["Settings"] = ["#FCDDB0", "#FF9F9F", "#E97777"]
        }
        else if(num == 3){
            user["Settings"] = ["#FBF7F0", "#D9E400", "#CDC9C3"]
        }



        // console.log(user["Settings"])
    }
    
    else if(z["action"] == 'CustomizePage'){
        
        var jsontext = JSON.stringify({
        
            'action': z['action'],
            "back" : user["Settings"][0],
            "top": user["Settings"][1],
            "myBar":user["Settings"][2]
        });
    
        res.send(jsontext)
    }

    else if(z["action"] == 'Profile'){
        user["Profilepic"] = z["theme"]
        // console.log(user["Profilepic"])
    }

    else if(z["action"] == 'Ppic'){
        
        var jsontext = JSON.stringify({
        
            'action': z['action'],
            'url': user["Profilepic"]
        });
        // console.log(user["Profilepic"])
        
        res.send(jsontext)
    }

    else if(z["action"] == 'reminder'){
        var min = z["time"]
        var message = z["title"] + ": " + z["notes"]

        setTimeout(function(){
           
            var jsontext = JSON.stringify({
        
                'action': 'reminder',
                'message': message
            });
            console.log(message)
            
            res.send(jsontext)

        },min * 10000)
        

    }

    else if(z["action"]=='delete'){
        for(var n in user["Journal_Entrys"]){
            // console.log(user["Journal_Entrys"][n][0])
            if(user["Journal_Entrys"][n][0] == z["journal"]){
                var tr =user["Journal_Entrys"][n][0] == z["journal"]
                
                user["Journal_Entrys"].splice(n,1)

                console.log(user["Journal_Entrys"])

                change()

                
                // console.log(deletejrnl)
                
                
            }
        } 
        // console.log(user["Journal_Entrys"])
    }


})




function removejournal(){
    client.db("Secrets").collection("Users").updateOne({Username: user.Username}, {$set: {"Journal_Entrys": user.Journal_Entrys}})
    .then(console.log("Changed"))
    }



    
