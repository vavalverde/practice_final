import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Label, Button, List, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Equipments } from '../../api/equipments/Equipments';
import { WorkoutsInterests } from '../../api/workouts/WorkoutsInterests';
import { Workouts } from '../../api/workouts/Workouts';
import { EquipmentsWorkouts } from '../../api/equipments/EquipmentsWorkouts';
import { deleteWorkoutMethod, unJoinWorkoutMethod } from '../../startup/both/Methods';
import { EquipmentsParticipation } from '../../api/equipments/EquipmentsParticipation';

/** Gets the Project data as well as Equipments and Interests associated with the passed Project name. */
function getWorkoutData(value) {
  const data = Workouts.collection.findOne({ _id: value });
  const equipments = (EquipmentsWorkouts.collection.findOne({ workoutID: value }).equipment);
  const workoutsParticipants = _.pluck(EquipmentsParticipation.collection.find({ workoutID: value }).fetch(), 'equipment');
  const equipmentName = Equipments.collection.findOne({ email: equipments });
  const participants = workoutsParticipants.map(equipment => (`${Equipments.collection.findOne({ email: equipment }).firstName
  } ${Equipments.collection.findOne({ email: equipment }).lastName}`));
  const interests = _.pluck(WorkoutsInterests.collection.find({ workoutID: value }).fetch(), 'workout');
  return _.extend({ }, data, { interests, creator: equipmentName, participants, value, equipments });
}

const handleClick = value => () => (

  Meteor.call(deleteWorkoutMethod, { workoutID: value }, (error) => {
    if (error) {
      swal('Error', error.message, 'error');
    } else {
      swal({ title: 'Success', text: 'Deleted workout successfully', icon: 'success' }).then(function () {
        this.window.location.reload();
      });

    }
  })
);

const handleClick2 = value => () => (

  Meteor.call(unJoinWorkoutnMethod, { workoutID: value, email: Meteor.user().username }, (error) => {
    if (error) {
      swal('Error', error.message, 'error');
    } else {
      swal({ title: 'Success', text: 'Un-joined workout successfully', icon: 'success' }).then(function () {
        this.window.location.reload();
      });

    }
  })
);

/** Component for layout out a Project Card. */
const MakeCard = (props) => (

  <Card>
    <Card.Content>
      <Card.Header style={{ marginTop: '0px' }}>{props.workout.title}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.workout.date}</span>
      </Card.Meta>
      <Card.Description>
        {props.workout.description}
      </Card.Description>
      <Card.Content extra style={{ color: 'black' }}>
        {props.workout.skillLevel}
      </Card.Content>
    </Card.Content>
    <Card.Content extra>
      {_.map(props.workout.interests,
        (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>{`Creator: ${props.workout.creator.firstName} ${props.workout.creator.lastName}`}</Header>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Participants</Header>
      {_.map(props.workout.participants, (p, index) => <List key={index} size='small' style={{ color: 'black' }} >{p}</List>)}
    </Card.Content>
    {(Meteor.user().username === props.workout.equipments) ? (
      <Button id='delete' onClick={handleClick(props.workout.value)}>
        Delete Workout
      </Button>
    ) : <Button id='unJoin' onClick={handleClick2(props.workout.value)}>
      Un-join Workout
    </Button>
    }
  </Card>

);

MakeCard.propTypes = {
  workout: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class YourWorkoutsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const workouts = _.pluck(EquipmentsWorkouts.collection.find({ equipment: Meteor.user().username }).fetch(), 'workoutID');
    const workouts1 = _.pluck(EquipmentsParticipation.collection.find({ equipment: Meteor.user().username }).fetch(), 'workoutID');
    const workoutData = workouts.map(workoutID => getWorkoutData(workoutID));
    const workoutData1 = workouts1.map(workoutID => getWorkoutData(workoutID));
    return (
      <Container id="your-woorkouts-page">
        <Header as='h2'>Created Workouts</Header>
        <Card.Group>
          {_.map(workoutData, (workout, index) => <MakeCard key={index} workout={workout}/>)}
        </Card.Group>
        <Header as='h2'>Joined Workouts</Header>
        <Card.Group>
          {_.map(workoutData1, (workout, index) => <MakeCard key={index} workout={workout}/>)}
        </Card.Group>
      </Container>
    );
  }
}

YourWorkoutsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(EquipmentsWorkouts.userPublicationName);
  const sub2 = Meteor.subscribe(Workouts.userPublicationName);
  const sub3 = Meteor.subscribe(WorkoutsInterests.userPublicationName);
  const sub4 = Meteor.subscribe(Equipments.userPublicationName);
  const sub5 = Meteor.subscribe(EquipmentsParticipation.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(YourWorkoutsPage);
