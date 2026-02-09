const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS for Angular dev server
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.get('/pokemon', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    res.json(response.data);
  } catch (error) {
    console.error('List error:', error.message);
    res.status(500).json({ error: 'Error fetching Pokémon list' });
  }
});

app.get('/pokemon/:name', async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = response.data;
    const stats = data.stats;
    const strongest = stats.reduce((max, stat) => stat.base_stat > max.base_stat ? stat : max, stats[0]);
    data.strongest_stat = `${strongest.stat.name}: ${strongest.base_stat}`;
    res.json(data);
  } catch (error) {
    console.error('Detail error:', error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'Pokémon not found' });
    } else {
      res.status(500).json({ error: 'Error fetching Pokémon details' });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});