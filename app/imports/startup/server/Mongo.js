import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { Interests } from '../../api/interests/Interests';

/* eslint-disable no-console */

/** Define a user in the Meteor accounts package. This enables login. Username is the email address. */
function createUser(email, role) {
  const userID = Accounts.createUser({ username: email, email, password: 'foo' });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
}

/** Define an interest.  Has no effect if interest already exists. */
function addInterest(interest) {
  Interests.collection.update({ name: interest }, { $set: { name: interest } }, { upsert: true });
}

/** Defines a new user and associated equipment. Error if user already exists. */
function addEquipment({ firstName, lastName, bio, year, interests, picture, email, role }) {
  console.log(`Defining equipment ${email}`);
  // Define the user in the Meteor accounts package.
  createUser(email, role);
  // Create the equipment.
  Equipments.collection.insert({ firstName, lastName, bio, year, picture, email });
  // Add interests and projects.
  interests.map(interest => EquipmentsInterests.collection.insert({ equipment: email, interest }));
  // Make sure interests are defined in the Interests collection if they weren't already.
  interests.map(interest => addInterest(interest));
}
