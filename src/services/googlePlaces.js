export async function fetchPlaces(zip, category) {
  try {
    // Construct and log the request URL
    const url = `http://localhost:58080/api/places?zip=${zip}&category=${category}`;
    console.log('➡️ Google proxy URL:', url);

    // Fetch from backend proxy
    const response = await fetch(url);
    console.log('⬅️ HTTP status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📥 Payload from backend:', JSON.stringify(data, null, 2));

    // Handle explicit errors returned by backend
    if (data.error) {
      throw new Error(`Backend error: ${data.error}`);
    }

    // If the backend forwards Google error_message or status, handle those too
    if (data.error_message) {
      throw new Error(`Google API error_message: ${data.error_message}`);
    }
    if (data.status && data.status !== 'OK') {
      throw new Error(`Google status: ${data.status}`);
    }

    return data.results || data;
  } catch (error) {
    console.error('Error fetching places:', error);
    throw error;
  }
}