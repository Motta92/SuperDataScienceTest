import { Template } from 'meteor/templating';

import { Notes } from '../api/notes.js';

import './note.html';

Template.note.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Notes.update(this._id, {
      $set: { checked: ! this.checked },
    });
  },
  'click .delete'() {
    Notes.remove(this._id);
  },
});
