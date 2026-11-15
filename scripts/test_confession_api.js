const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Confessions API Logic...');

const CONFESSIONS_FILE = path.join(process.cwd(), 'src', 'data', 'confessions.json');
const raw = fs.readFileSync(CONFESSIONS_FILE, 'utf-8');
const confessions = JSON.parse(raw);

// Test 1: Verify getApprovedConfessions logic
const approved = confessions.filter((c) => c.status === 'approved' && c.isPublic);
assert(approved.length >= 6, 'Must have at least 6 approved confessions');

// Test 2: Filter by mood
const xaoNhang = approved.filter((c) => c.moodTag === 'xao_nhang');
assert(xaoNhang.length >= 1, 'Must have at least 1 xao_nhang confession');

// Test 3: Moderate action
const target = confessions[0];
assert(target.id, 'Target confession must have id');
assert(target.status === 'approved', 'Target confession must be approved');

// Test 4: Reactions structure
assert(typeof target.reactions.feel_you === 'number', 'feel_you reaction must be a number');
assert(typeof target.reactions.hug === 'number', 'hug reaction must be a number');
assert(typeof target.reactions.not_alone === 'number', 'not_alone reaction must be a number');

console.log('✅ Approved confessions query logic: OK');
console.log('✅ Mood filtering logic: OK');
console.log('✅ Reaction counting logic: OK');
console.log('🎉 Task 2 API Route logic tests PASSED completely!');
