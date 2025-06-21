import { fetchClaudeResources, parseClaudeResponse } from './claudeFetcher';

/**
 * Filters Google Places results through Claude to rank accessibility.
 */
export async function filterWithClaude(zip, category, places, context = '') {
    const placeList = places
    .slice(0, 5)
    .map(p => `${p.name} – ${p.address}`)
    .join('\n');

    const prompt = `You are helping a homeless user. They need free ${category} services.\nHere are candidate places:\n${placeList}\n\nStep 1: From this list pick the best 3 accessible options.\nStep 2: Return them in format:\nName: ...\nAddress: ...\nReason: ...`;

    const raw = await fetchClaudeResources(zip, category, context + '\n' + prompt);
    return parseClaudeResponse(raw).map((r, idx) => ({ ...r, ...places[idx] }));
}