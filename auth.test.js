const test = require('node:test');
const assert = require('node:assert/strict');

class MemoryStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.localStorage = new MemoryStorage();

// Mock Supabase client for Node tests
const mockUsers = new Map();

globalThis.initSupabase = async () => {
  return {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: async () => ({ data: { session: null } }),
      signUp: async ({ email, password, options }) => {
        if (mockUsers.has(email)) {
          return { data: null, error: { message: 'User already registered' } };
        }
        const user = {
          id: 'test-id-' + Date.now(),
          email,
          user_metadata: { name: options?.data?.name || email },
          created_at: new Date().toISOString(),
        };
        mockUsers.set(email, { user, password });
        return { data: { user }, error: null };
      },
      signInWithPassword: async ({ email, password }) => {
        const stored = mockUsers.get(email);
        if (!stored || stored.password !== password) {
          return { data: null, error: { message: 'Invalid credentials' } };
        }
        return { data: { user: stored.user }, error: null };
      },
      signOut: async () => ({ error: null }),
    },
  };
};

const { signupUser, loginUser, logoutUser, clearAuthData } = require('./auth.js');

test('signup creates a user account', async () => {
  clearAuthData();
  const res = await signupUser({ name: 'Ada', email: 'ada@example.com', password: 'secret123', passwordConfirm: 'secret123' });

  assert.ok(res.success);
  assert.ok(res.user);
  assert.equal(res.user.email, 'ada@example.com');
  assert.equal(res.user.name, 'Ada');
});

test('login authenticates a registered user', async () => {
  clearAuthData();
  await signupUser({ name: 'Grace', email: 'grace@example.com', password: 'pass123', passwordConfirm: 'pass123' });

  const res = await loginUser('grace@example.com', 'pass123');
  assert.ok(res.success);
  assert.ok(res.user);
  assert.equal(res.user.email, 'grace@example.com');
});

test('login rejects invalid credentials', async () => {
  clearAuthData();
  await signupUser({ name: 'Linus', email: 'linus@example.com', password: 'root123', passwordConfirm: 'root123' });

  const res = await loginUser('linus@example.com', 'wrong');
  assert.equal(res.success, false);
  assert.equal(res.user, undefined);
  assert.ok(res.error);
});

test('logout clears the active session', async () => {
  clearAuthData();
  await signupUser({ name: 'Nina', email: 'nina@example.com', password: 'abc123', passwordConfirm: 'abc123' });
  await loginUser('nina@example.com', 'abc123');

  await logoutUser();
  assert.equal(globalThis.localStorage.getItem('lumen_current_user'), null);
});
