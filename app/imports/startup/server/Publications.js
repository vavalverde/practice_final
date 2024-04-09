import { Meteor } from 'meteor/meteor';
import { Interests } from '../../api/interests/Interests';
import { Equipments } from '../../api/equipments/Equipments';
import { EquipmentsInterests } from '../../api/equipments/EquipmentsInterests';
import { Workouts } from '../../api/workouts/Workouts';
import { WorkoutsInterests } from '../../api/workouts/WorkoutsInterests';
import { EquipmentsWorkouts } from '../../api/equipments/EquipmentsWorkouts';
import { EquipmentsParticipation } from '../../api/equipments/EquipmentsParticipation';

/** Define a publication to publish all interests. */
Meteor.publish(Interests.userPublicationName, () => Interests.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Equipments.userPublicationName, () => Equipments.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(EquipmentsInterests.userPublicationName, () => EquipmentsInterests.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Workouts.userPublicationName, () => Workouts.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(EquipmentsWorkouts.userPublicationName, () => EquipmentsWorkouts.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(WorkoutsInterests.userPublicationName, () => WorkoutsInterests.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(EquipmentsParticipation.userPublicationName, () => EquipmentsParticipation.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
