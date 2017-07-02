import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import { Notes } from '../api/notes.js';
import './body.html';

import './notes/note.js';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Meteor.subscribe('notes');
});

Template.body.helpers({
  // Gets the user notes from mongoDB
  userNotes(){
    const instance = Template.instance();
    if (instance.state.get('sortBy') == 'date') {
      return Notes.find({userId: Meteor.userId()},{sort:{createdAt: -1}});
    }
    if (instance.state.get('sortBy') == 'priority') {
      return Notes.find({userId: Meteor.userId()},{sort:{priority: -1}});
    }
    // Return all notes otherwise
    return Notes.find({userId: Meteor.userId()});
  },

  // Returns the number of notes a logged in user has created
  numberOfNotes(){
    return Notes.find({userId: Meteor.userId()}).count();
  },

  // Returns the user's username
  username(){
    return Meteor.user().username;
  },
});

Template.body.events({
  // Inserts a note into the collection once the form has been submitted
  'submit .new-note'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a note into the collection
    Meteor.call('notes.insert', text);

    // Clear form
    target.text.value = '';
  },

  // Handles collection sort by setting a reactive-dict variable
  'click .sort-by-date'(event, instance) {
    instance.state.set('sortBy','date');
  },

  // Handles collection sort by setting a reactive-dict variable
  'click .sort-by-priority'(event, instance) {
    instance.state.set('sortBy', 'priority');
  },
});
