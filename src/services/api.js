const API_BASE = '/api';

class ApiService {
  async _fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred');
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  async getLevel(level) {
    return this._fetch(`/level/${level}`);
  }

  async *sendChatStream(level, message) {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level, message }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop(); // Keep incomplete chunk

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.substring(6));
            yield json;
          } catch (e) {
            console.error('Error parsing SSE JSON:', e);
          }
        }
      }
    }
  }

  async sendChat(level, message) {
    return this._fetch('/chat', {
      method: 'POST',
      body: JSON.stringify({ level, message }),
    });
  }

  async verifyPassword(level, password) {
    return this._fetch('/verify-password', {
      method: 'POST',
      body: JSON.stringify({ level, password }),
    });
  }
}

export const api = new ApiService();
