// Mock component data
const arduinoComponents = [
  { title: 'Arduino UNO R3', image: 'img/Components/Arduino.png', desc: 'The main microcontroller board.' },
  { title: '7-Segment Display', image: 'img/Components/7segment.png', desc: 'Shows numerical data.' }
];

const brickduinoComponents = [
  { title: 'Brickduino Uno R3', image: 'img/brickponents/unor3_brickduino.png', desc: 'A modular microcontroller.' },
  { title: 'Brickduino Breadboard', image: 'img/brickponents/breadboard_brickduino.png', desc: 'A modular prototyping board.' }
];

// Mock functions
const showComponents = (type) => {
  const container = document.getElementById('carousel');
  if (!container) return;
  
  container.innerHTML = '';
  const components = type === 'arduino' ? arduinoComponents : brickduinoComponents;
  
  components.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${c.image}" alt="${c.title}">
      <div class="title">${c.title}</div>
    `;
    container.appendChild(card);
  });
};

module.exports = {
  arduinoComponents,
  brickduinoComponents,
  showComponents
}; 