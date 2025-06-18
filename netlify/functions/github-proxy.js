
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { method, path, body } = event;
  // Only allow our site origin
  if (event.headers.origin !== 'https://alger116.github.io') {
    return { statusCode: 403, body: 'Forbidden' };
  }

  const GITHUB_TOKEN = process.env.GH_TOKEN; // set this in Netlify UI
  const OWNER = 'alger116';
  const REPO  = 'def-links';
  const FILE  = 'db.json';
  const apiBase = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;

  try {
    if (method === 'GET') {
      // We need the SHA and content
      const res = await fetch(apiBase, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      });
      const json = await res.json();
      return {
        statusCode: res.status,
        body: JSON.stringify({ content: json.content, sha: json.sha })
      };
    }
    else if (method === 'PUT') {
      const { message, content, sha } = JSON.parse(body);
      const res = await fetch(apiBase, {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, content, sha })
      });
      const json = await res.json();
      return { statusCode: res.status, body: JSON.stringify(json) };
    }
    else {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
