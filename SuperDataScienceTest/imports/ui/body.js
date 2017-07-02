import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {ReactiveDict} from 'meteor/reactive-dict';
import { Notes } from '../api/notes.js';
import './body.html';

import './note.js';

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
  Meteor.subscribe('notes');
});

Template.body.helpers({

  userNotes(){
    const instance = Template.instance();
    if(instance.state.get('hideCompleted')=='priority'){
      // If hide completed is checked, filter notes
      return Notes.find({userId: Meteor.userId(),checked:{$ne: true}},{sort:{createdAt: -1} });
    }
    if (instance.state.get('sortBy') == 'date') {
      return Notes.find({userId: Meteor.userId()},{sort:{createdAt: -1}});
    }
    if (instance.state.get('sortBy') == 'priority') {
      return Notes.find({userId: Meteor.userId()},{sort:{priority: -1}});
    }
    // Return all notes otherwise
    return Notes.find({userId: Meteor.userId()});
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
    Meteor.call('notes.insert', text);

    // Clear form
    target.text.value = '';
  },

  'click .sort-by-date'(event, instance) {
    instance.state.set('sortBy','date');
  },

  'click .sort-by-priority'(event, instance) {
    instance.state.set('sortBy', 'priority');
  },

  'change .hide-completed input'(event, instance) {
   instance.state.set('hideCompleted', event.target.checked);
 },
});
