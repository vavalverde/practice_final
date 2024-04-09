import { Meteor } from 'meteor/meteor';
import { Equipments } from '../../api/equipment/Equipment';
/* eslint-disable no-console */

// Initialize the database with a default data document.
const addData = (data) => {
  console.log(`  Adding: ${data.clubName} `);
  Equipments.collection.insert(data);
};

// Initialize the StuffsCollection if empty.
if (Equipments.collection.find().count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.forEach(data => addData(data));
  }
}
