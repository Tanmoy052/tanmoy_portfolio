const assert = require('assert');

async function testAll() {
  console.log('====================================================');
  console.log('       STARTING COMPREHENSIVE END-TO-END QA SUITE   ');
  console.log('====================================================\n');
  const backend = 'http://localhost:5000';
  const frontend = 'http://localhost:3000';

  let passed = 0;
  let total = 0;

  async function check(name, fn) {
    total++;
    process.stdout.write(`TEST [${total}] ${name}... `);
    try {
      await fn();
      console.log('✓ PASSED');
      passed++;
    } catch (err) {
      console.log('✗ FAILED:', err.message);
    }
  }

  // 1. Backend Health
  await check('Backend Health & DB Connection (/api/health)', async () => {
    const res = await fetch(backend + '/api/health');
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.status, 'ok');
    assert.strictEqual(json.dbStatus, 'connected');
  });

  // 2. Portfolio API
  await check('Portfolio Dynamic Fetch (/api/portfolio)', async () => {
    const res = await fetch(backend + '/api/portfolio');
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.data.about, 'Missing about');
    assert(json.data.resume, 'Missing resume');
    assert(Array.isArray(json.data.skills), 'Skills must be array');
    assert(Array.isArray(json.data.projects), 'Projects must be array');
    assert(Array.isArray(json.data.experiences), 'Experiences must be array');
    assert(json.data.projects.length > 0, 'Must have projects');
  });

  // 3. Admin Login (Bad Credentials)
  await check('Admin Login Auth Negative Check (Bad Password)', async () => {
    const res = await fetch(backend + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'tanmoypal30102004', password: 'incorrectPassword123' })
    });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert(json.error, 'Must return error message');
  });

  // 4. Admin Login (Valid Credentials)
  await check('Admin Login Auth Positive Check (tanmoypal30102004)', async () => {
    const adminPassword = process.env.ADMIN_PASSWORD || 'tanmoy@2002';
    let res = await fetch(backend + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'tanmoypal30102004', password: adminPassword })
    });
    if (res.status !== 200) {
      // Fallback check with default seed password
      res = await fetch(backend + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'tanmoypal30102004', password: 'tanmoy12345' })
      });
    }
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.token, 'Must return session token');
    assert.strictEqual(json.username, 'tanmoypal30102004');
  });

  // 5. Admin Profile
  await check('Admin Profile Retrieval (/api/admin/user)', async () => {
    const res = await fetch(backend + '/api/admin/user');
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.username, 'tanmoypal30102004');
  });

  // 6. Admin Account Update Authorization Rejection
  await check('Admin Profile Update Security Rejection (Incorrect current password)', async () => {
    const res = await fetch(backend + '/api/admin/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: 'wrongPassword',
        newUsername: 'hacker'
      })
    });
    assert.strictEqual(res.status, 401);
    const json = await res.json();
    assert(json.error.includes('password does not match'), 'Must reject wrong password');
  });

  // 7. Contact Inquiries CRUD Flow
  let createdContactId = null;
  await check('Submit New Contact Inquiry (/api/contacts)', async () => {
    const testMsg = {
      name: 'Automated QA Bot',
      email: 'qa-tester@antigravity.dev',
      subject: 'End-to-End Verification Inquiry',
      message: 'This is a synthetic verification message created during senior QA testing.'
    };
    const res = await fetch(backend + '/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testMsg)
    });
    assert.strictEqual(res.status, 201);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    assert(json.data._id, 'Must return created contact _id');
    createdContactId = json.data._id;
  });

  // 8. Verify Contact Stored in MongoDB
  await check('Retrieve Contact Inquiries and Verify Stored Message', async () => {
    const res = await fetch(backend + '/api/contacts');
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    const found = json.data.find(c => c._id === createdContactId);
    assert(found, 'Created test contact must exist in DB list');
    assert.strictEqual(found.email, 'qa-tester@antigravity.dev');
  });

  // 9. Clean up test contact
  await check('Delete Test Contact Message (/api/contacts/:id)', async () => {
    assert(createdContactId, 'Must have ID to delete');
    const res = await fetch(backend + '/api/contacts/' + createdContactId, {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert.strictEqual(json.success, true);

    // Verify it is gone
    const verifyRes = await fetch(backend + '/api/contacts');
    const verifyJson = await verifyRes.json();
    const stillThere = verifyJson.data.find(c => c._id === createdContactId);
    assert(!stillThere, 'Contact must be deleted from MongoDB Atlas');
  });

  // 10. Update Portfolio Data Sync
  await check('Portfolio Update & Sync to Atlas (/api/admin/portfolio)', async () => {
    const curRes = await fetch(backend + '/api/portfolio');
    const curJson = await curRes.json();
    const curAbout = curJson.data.about;

    const updateRes = await fetch(backend + '/api/admin/portfolio', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        about: curAbout,
        resume: curJson.data.resume,
        skills: curJson.data.skills,
        projects: curJson.data.projects,
        experiences: curJson.data.experiences
      })
    });
    assert.strictEqual(updateRes.status, 200);
    const updateJson = await updateRes.json();
    assert.strictEqual(updateJson.success, true);
  });

  // 11. Frontend Main Route
  await check('Frontend Main Portfolio Route (http://localhost:3000/)', async () => {
    const res = await fetch(frontend + '/');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('<div id="root"></div>'), 'Must contain root container');
  });

  // 12. Frontend Admin Login Route
  await check('Frontend Admin Login Route (http://localhost:3000/admin/login)', async () => {
    const res = await fetch(frontend + '/admin/login');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('<div id="root"></div>'), 'Must serve SPA');
  });

  // 13. Frontend Admin Panel Route
  await check('Frontend Admin Panel Route (http://localhost:3000/admin)', async () => {
    const res = await fetch(frontend + '/admin');
    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert(html.includes('<div id="root"></div>'), 'Must serve SPA');
  });

  // 14. Static Resume PDF Asset Delivery
  await check('Public Resume PDF Asset Delivery (/Tanmoy_Pal_Resume.pdf)', async () => {
    const res = await fetch(backend + '/Tanmoy_Pal_Resume.pdf');
    assert.strictEqual(res.status, 200);
    const buf = await res.arrayBuffer();
    assert(buf.byteLength > 1000, `PDF size must be > 1000 bytes, got ${buf.byteLength}`);
  });

  // 15. AI Chatbot Assistant (/api/chat)
  await check('AI Assistant Chat Endpoint (/api/chat)', async () => {
    const res = await fetch(backend + '/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello! Who is Tanmoy Pal?' })
    });
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    assert(json.reply, 'Must return AI reply');
  });

  console.log('\n====================================================');
  console.log(`QA SUITE COMPLETED: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================');

  if (passed !== total) {
    process.exit(1);
  }
}

testAll().catch(err => {
  console.error('Fatal QA error:', err);
  process.exit(1);
});
