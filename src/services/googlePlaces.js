export async function fetchPlaces(zip, category) {
  const response = await fetch(`/api/places?zip=${zip}&category=${category}`);
  const data = await response.json();
  return data;
}
