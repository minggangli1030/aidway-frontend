export async function fetchPlaces(zip, category) {
  try {
    // Use the full URL with port 58080
    const response = await fetch(`http://localhost:58080/api/places?zip=${zip}&category=${category}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}