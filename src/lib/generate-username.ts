export const generateUsername = () => {
  const animals = ["shark", "wolf", "bear", "rhino"];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const id = crypto.randomUUID().slice(0, 6);
  return `${animal}-${id}`;
};
