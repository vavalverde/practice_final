import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Label, Button, List, Header } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Equipments } from '../../api/equipments/Equipments';
import { WorkoutsInterests } from '../../api/workouts/WorkoutsInterests';
import { Workouts } from '../../api/workouts/Workouts';
import { EquipmentsWorkouts } from '../../api/equipments/EquipmentsWorkouts';
import { joinWorkoutMethod } from '../../startup/both/Methods';
import { EquipmentsParticipation } from '../../api/equipments/EquipmentsParticipation';

/** Gets the Project data as well as Equipments and Interests associated with the passed Project name. */
function getWorkoutData(value) {
  const data = Workouts.collection.findOne({ _id: value });
  const equipments = _.pluck(EquipmentsWorkouts.collection.find({ workoutID: value }).fetch(), 'equipment');
  const workoutsParticipants = _.pluck(EquipmentsParticipation.collection.find({ workoutID: value }).fetch(), 'equipment');
  const equipmentName = equipments.map(equipment => (`${Equipments.collection.findOne({ email: equipment }).firstName
  } ${Equipments.collection.findOne({ email: equipment }).lastName}`));
  const participants = workoutsParticipants.map(equipment => (`${Equipments.collection.findOne({ email: equipment }).firstName
  } ${Equipments.collection.findOne({ email: equipment }).lastName}`));
  const interests = _.pluck(WorkoutsInterests.collection.find({ workoutID: value }).fetch(), 'interest');
  return _.extend({ }, data, { interests, creator: equipmentName, participants, value });
}

const handleClick = value => () => (

  Meteor.call(joinWorkoutMethod, { email: Meteor.user().username, workoutID: value }, (error) => {
    if (error) {
      swal('Error', error.message, 'error');
    } else {
      swal({ title: 'Success', text: 'Joined workout successfully', icon: 'success' }).then(function () {
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
      <Header as='h5'>Creator</Header>
      {_.map(props.workout.creator, (p, index) => <List key={index} size='tiny' style={{ color: 'black' }} >{p}</List>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Participants</Header>
      {_.map(props.workout.participants, (p, index) => <List key={index} size='tiny' style={{ color: 'black' }} >{p}</List>)}
    </Card.Content>
    {Meteor.user() ? (
      <Button onClick={handleClick(props.workout.value)}>
      Join Workout
      </Button>
    ) : <Button as={NavLink} exact to='/signup' content={'Sign up or log in to join workout'}/>
    }
  </Card>

);

MakeCard.propTypes = {
  workout: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class WorkoutsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const workouts = _.pluck(Workouts.collection.find().fetch(), '_id');
    const workoutData = workouts.map(workoutID => getWorkoutData(workoutID));
    return (
      <Container id="workouts-page">
        <Card.Group>
          {_.map(workoutData, (workout, index) => <MakeCard key={index} workout={workout}/>)}
        </Card.Group>
      </Container>
    );
  }
}

WorkoutsPage.propTypes = {
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
})(WorkoutsPage);
