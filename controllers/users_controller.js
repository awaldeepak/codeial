const User = require('../models/user');         //Import User Model to use in the actions


//Create an action for the users profile page
module.exports.profile = function(req, res){

    if(req.isAuthenticated()){
        User.findById(req.params.id, function(err, user){
            if(err){ console.log('Error in fetching user'); return; }

                return res.render('user_profile', {
                    title: 'Profile Page',
                    profile_user: user
                });
        });

    } else {
        return res.render('user_sign_in', {
            title: 'Codeial | Sign In'
        });
    }
   
}

//Action to update the user profile
module.exports.update = function(req, res){
    if(req.user.id == req.params.id){

        User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
            if(err){ console.log('Error in updating user'); return; }

            return res.redirect('back');
        });
    } else {

        return res.status(401, 'UnAuthorized');
    }
}

//Action for the signUp page
module.exports.signUp = function(req, res){

    //Redirect the user to his profile page if user is already signed in 
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up', {
        title: 'Codeial | Sign Up'
    });
}

//Action for the signIn page
module.exports.signIn = function(req, res){

    //Redirect the user to his profile page if user is already signed in 
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in', {
        title: 'Codeial | Sign In'
    });
}


//Get the Sign Up data and proceed with it.
module.exports.create = function(req, res){

    //If password is not matching with confirm password
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    //If password matches with confirm password, then find email to preceed with actions
    User.findOne({email: req.body.email}, function(err, user){
        
        if(err){ console.log('Error in finding user in signing up'); return; }

        //If Entered email user is not available in User Model then create that user and redirect to sign-in page
        if(!user){
            User.create(req.body, function(err, user){

                if(err){ console.log('Error in creating user while signing up'); return; }

                return res.redirect('/users/sign-in');
            });
            
        }

        //If entered email user is already exists then redirect to previous page
        else{
            return res.redirect('back');
        }
    });
}



//sign in and create a session for the user
module.exports.createSession = function(req, res){

    return res.redirect('/');
}


//Destroy the created user's session from browser and sign out
module.exports.destroySession = function(req, res){

    req.logout();

    return res.redirect('/');
}