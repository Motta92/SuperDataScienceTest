import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Starts a new mongoDB
export const Notes = new Mongo.Collection('notes');

// Server side code only
if (Meteor.isServer) {
  Meteor.publish('notes', function publishNotes() {
    return Notes.find();
  });
}

// Methods that control mongoDB operations such as insert and remove
Meteor.methods({
  'notes.insert'(text) {
    check(text, String);

    // Need to be logged in before adding a note
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Notes.insert({
      text,
      createdAt: new Date(),
      userId: Meteor.userId(),
      user: Meteor.user().username,
      priority: 1,
    });
  },
  'notes.remove'(noteId) {
    check(noteId, String);

    Notes.remove(noteId);
  },
  'notes.update'(noteId, newText) {
    check(noteId, String);
    check(newText, String);

    Notes.update(noteId, {$set: {text: newText}});
  },
  'notes.update_priority'(noteId, priority) {
    check(noteId, String);
    check(priority, Number);

    Notes.update(noteId, {$set: {priority: priority}});
  },

  'notes.setChecked'(noteId, setChecked) {
    check(noteId, String);
    check(setChecked, Boolean);

    Notes.update(noteId, { $set: { checked: setChecked } });
  },
});
