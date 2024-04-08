import React from 'react';

const Strength = () => {
  // You can fetch the list of available strength equipment from your backend or define it here
  const strengthEquipment = [
    { id: 1, name: 'Barbell', description: 'Standard barbell for weightlifting' },
    { id: 2, name: 'Dumbbells', description: 'Various dumbbell weights for strength training' },
    { id: 3, name: 'Bench Press', description: 'Adjustable bench press for chest workouts' },
    // Add more equipment as needed
  ];

  return (
    <div>
      <h1>Strength Equipment</h1>
      <ul>
        {strengthEquipment.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong>: {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Strength;
