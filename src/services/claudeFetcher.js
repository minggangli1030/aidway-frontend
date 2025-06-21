export async function fetchClaudeResources(zip, category, prompt) {
    // Simulate Claude response
    return `Name: Example Shelter\nAddress: 123 Aid Street\nReason: Closest and open 24/7`;
}

export function parseClaudeResponse(raw) {
    // Simulate parsing
    return [
    { name: 'Example Shelter', address: '123 Aid Street', reason: 'Closest and open 24/7' }
  ];
}
