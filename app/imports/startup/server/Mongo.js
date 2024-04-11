import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { Interests } from '../../api/interests/Interests';
import { Workouts } from '../../api/workouts/Workouts';
import { EquipmentsParticipation } from '../../api/equipments/EquipmentsParticipation';

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

function joinWorkout(email, workoutID) {
  const workout = ((Workouts.collection.findOne({ _id: workoutID }).title));
  EquipmentsParticipation.collection.remove({ equipment: email, workoutID });
  EquipmentsParticipation.collection.insert({ equipment: email, workoutID, workout });
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


/**
 * If the loadAssetsFile field in settings.development.json is true, then load the data in private/data.json.
 * This approach allows you to initialize your system with large amounts of data.
 * Note that settings.development.json is limited to 64,000 characters.
 * We use the "Assets" capability in Meteor.
 * For more info on assets, see https://docs.meteor.com/api/assets.html
 * User count check is to make sure we don't load the file twice, which would generate errors due to duplicate info.
 */

