import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import { Notes } from '../api/notes.js';
import './body.html';
import './note.js';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
});

Template.body.helpers({
  notes(){
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')){
      // If hide completed is checked, filter notes
      return Notes.find({checked:{$ne: true}},{sort:{createdAt: -1} });
    }
    // Return all notes otherwise
    return Notes.find({},{sort: {createdAt: -1} });
  },
  incompleteCount(){
    return Notes.find({checked:{$ne: true}}).count();
  },
});

Template.body.events({
  'submit .new-note'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a note into the collection
    Notes.insert({
      text,
      createdAt: new Date(), // current time
      userId: Meteor.userId(),
      user: Meteor.user().username,
    });

    // Clear form
    target.text.value = '';
  },

  'change .hide-completed input'(event, instance) {
   instance.state.set('hideCompleted', event.target.checked);
 },
});
