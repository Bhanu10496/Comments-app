import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import {comments} from '../lib/models.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './main.html';

// Defining routes
Router.route('/login')
Router.route('/homePage')
Router.route('/',function(){
    this.render('login')
})

Template.comment.onCreated(function bodyOnCreated() {

  this.state = new ReactiveDict();

});

Template.login.helpers({
    checkLogin: function(){
        if(Meteor.user())
            Router.go("/homePage")
    }
})

Template.homePage.helpers({
  //returns comments in chronological order
  comments:function(){
    console.log("finding comments")
    return comments.find({}, {sort: {createdAt: -1}})
  },
  //checks if the user is logged in
  checkLogin: function(){
        if(!Meteor.user())
            Router.go("/login")
    }
});

Template.homePage.events({
    //Inserts a new comment
    "submit .new-comment":function(event){
        if(event.target.newComment.value==""){
            alert("Comment can't be empty!")
            return false;
        }
        comments.insert({
            title: event.target.newComment.value,
            createdAt: new Date(),
            email: Meteor.user().emails[0].address
        });
       event.target.newComment.value="";
       return false;
    }
})

Template.comment.helpers({
    "showModals":function() {
    return Template.instance().state.get('showModal')
    },
    "checkUser":function() {
    //return this.email==Meteor.user().emails[0].address
      if(this.email==Meteor.user().emails[0].address)
        return "active"
      else
        return "disabled"
    }
});

Template.comment.events({
    //deletes the selected comment
    "click .delete":function(){
        if(this.email==Meteor.user().emails[0].address)
         comments.remove(this._id)
        else
         alert("Cannot remove others' comments")
    },
    "click .edit":function(event,instance){
         if(this.email==Meteor.user().emails[0].address)
            instance.state.set("showModal",true)
         else
            alert("Cannot edit others' comments")
    },
    "submit .save":function (event,instance) {
        comments.update(this._id,
            {$set: {"title":event.target.editedText.value}}
            );
        instance.state.set("showModal",false)
        return false;
    },
    "click .cancel":function (event,instance) {
        instance.state.set("showModal",false)
    }
})
