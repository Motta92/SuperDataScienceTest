import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './note.html';

Template.note.onCreated(function noteOnCreated(){
  this.state = new ReactiveDict();
});

Template.note.helpers({

  // Adds a CSS class to handle visibility of html elements
  addIsEditableClass() {
    const instance = Template.instance();
    if(instance.state.get('isEditable')){
      return 'editable';
    }
    else{
      return 'not-editable';
    }
  },

  // Adds a CSS class to handle visibility of html elements
  removeIsEditableClass() {
    const instance = Template.instance();
    if(instance.state.get('isEditable')){
      return 'not-editable';
    }
    else{
      return 'editable';
    }
  },
}),

Template.note.events({

  // Called when the X button to delete a note is pressed
  'click .delete'() {
    Meteor.call('notes.remove', this._id);
  },

  // Called when the pencil button to edit a note is pressed
  'click .edit'(event, instance) {
     instance.state.set('isEditable', true);
  },

  // Called when a new priority selection is made
  'click .priority-item'(event) {
    // Get value from form element
    const target = event.target;
    const priority = target.text;

    Meteor.call('notes.update_priority', this._id, parseInt(priority));
  },

  // Handles ESC or Enter to apply changes after entering in edit mode
  'keyup .edit-note input[type=text]': _.throttle(function updateNote(event, instance){

    if (event.which === 27 || event.which === 13) {
      instance.state.set('isEditable', false);
      // Get value from form element
      const target = event.target;
      const newText = target.value;

      Meteor.call('notes.update', this._id, newText);
    }
  }),

});
