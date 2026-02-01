const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;

// Serve static files from current directory
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());

// API: Get pattern index
app.get('/api/patterns', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'patterns-index.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({ patterns: [] });
  }
});

// API: Save pattern index
app.post('/api/patterns', async (req, res) => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'patterns-index.json'),
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Get a specific pattern
app.get('/api/pattern/:id', async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, `pattern-${req.params.id}.json`),
      'utf8'
    );
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(404).json({ error: 'Pattern not found' });
  }
});

// API: Save a specific pattern
app.post('/api/pattern/:id', async (req, res) => {
  try {
    await fs.writeFile(
      path.join(__dirname, `pattern-${req.params.id}.json`),
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Delete a specific pattern
app.delete('/api/pattern/:id', async (req, res) => {
  try {
    await fs.unlink(path.join(__dirname, `pattern-${req.params.id}.json`));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Get values.json
app.get('/api/values', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'values.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({});
  }
});

// API: Save values.json
app.post('/api/values', async (req, res) => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'values.json'),
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// API: Get global-config.json (comprehensive settings for website dashboard)
app.get('/api/global-config', async (req, res) => {
  try {
    const data = await fs.readFile(path.join(__dirname, 'global-config.json'), 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.json({});
  }
});

// API: Save global-config.json
app.post('/api/global-config', async (req, res) => {
  try {
    await fs.writeFile(
      path.join(__dirname, 'global-config.json'),
      JSON.stringify(req.body, null, 2)
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`UML Editor running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
