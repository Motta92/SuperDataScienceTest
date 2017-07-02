import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './note.html';

Template.note.onCreated(function noteOnCreated(){
  this.state = new ReactiveDict();
});

Template.note.helpers({
  editingClass() {
    const instance = Template.instance();
    if(instance.state.get('isEditable')){
      return 'editable';
    }
    else{
      return 'not-editable';
    }
  },
}),

Template.note.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('notes.setChecked', this._id, !this.checked);
  },

  'click .delete'() {
    Meteor.call('notes.remove', this._id);
  },

  'click .edit'(event, instance) {
     instance.state.set('isEditable', true);
  },

  'click .priority-item'(event) {
    // Get value from form element
    const target = event.target;
    const priority = target.text;

    Meteor.call('notes.update_priority', this._id, parseInt(priority));
  },

  'keyup input[type=text]': _.throttle(function updateNote(event, instance){
    // Handles ESC or Enter to apply changes
    if (event.which === 27 || event.which === 13) {
      instance.state.set('isEditable', false);
      // Get value from form element
      const target = event.target;
      const newText = target.value;

      Meteor.call('notes.update', this._id, newText);
    }
  }),

  'focus input[type=text]'() {
    //this.onEditingChange(true);
  },

});
