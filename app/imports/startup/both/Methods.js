import { Meteor } from 'meteor/meteor';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { EquipmentsWorkouts } from '../../api/equipments/EquipmentsWorkouts';
import { Workouts } from '../../api/workouts/Workouts';
import { WorkoutsInterests } from '../../api/workouts/WorkoutsInterests';

/**
 * In Bowfolios, insecure mode is enabled, so it is possible to update the server's Mongo database by making
 * changes to the client MiniMongo DB.
 *
 * However, updating the database via client-side calls can be inconvenient for two reasons:
 *   1. If we want to update multiple collections, we need to use nested callbacks in order to trap errors, leading to
 *      the dreaded "callback hell".
 *   2. For update and removal, we can only provide a docID as the selector on the client-side, making bulk deletes
 *      hard to do via nested callbacks.
 *
 * A simple solution to this is to use Meteor Methods (https://guide.meteor.com/methods.html). By defining and
 * calling a Meteor Method, we can specify code to be run on the server-side but invoked by clients. We don't need
 * to use callbacks, because any errors are thrown and sent back to the client. Also, the restrictions on the selectors
 * are removed for server-side code.
 *
 * Meteor Methods are commonly introduced as the necessary approach to updating the DB once the insecure package is
 * removed, and that is definitely true, but Bowfolios illustrates that they can simplify your code significantly
 * even when prototyping. It turns out that we can remove insecure mode if we want, as we use Meteor methods to update
 * the database.
 *
 * Note that it would be even better if each method was wrapped in a transaction so that the database would be rolled
 * back if any of the intermediate updates failed. Left as an exercise to the reader.
 */

const updateProfileMethod = 'Profiles.update';

/**
 * The server-side Equipments.update Meteor Method is called by the client-side Home page after pushing the update button.
 * Its purpose is to update the Equipments, EquipmentsInterests, and ProfilesProjects collections to reflect the
 * updated situation specified by the user.
 */
Meteor.methods({
  'Profiles.update'({ email, firstName, lastName, bio, picture, interests, year }) {
    Equipments.collection.update({ email }, { $set: { email, firstName, lastName, bio, picture, year } });
    EquipmentsInterests.collection.remove({ profile: email });
    interests.map((interest) => EquipmentsInterests.collection.insert({ profile: email, interest }));
  },
});

const deleteWorkoutMethod = 'Workouts.delete';

Meteor.methods({
  'Workouts.delete'({ workoutID }) {
    EquipmentsWorkouts.collection.remove({ workoutID });
    Workouts.collection.remove({ _id: workoutID });
    WorkoutsInterests.collection.remove({ workoutID });
  },
});

export { updateProfileMethod, deleteWorkoutMethod };
