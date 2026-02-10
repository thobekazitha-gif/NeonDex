const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/api/pokemon', async (req, res) => {
  try {
    const { offset = 0, limit = 12 } = req.query;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the void.' });
  }
});

app.get('/api/pokemon/:name', async (req, res) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.name}`);
    const d = response.data;
    
    // Insight: Calculate Combat Rating (Out-of-the-box feature)
    const totalStats = d.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const rating = Math.min(Math.round((totalStats / 600) * 100), 100);

    res.json({
      id: d.id,
      name: d.name,
      sprite: d.sprites.other['official-artwork'].front_default,
      types: d.types.map(t => t.type.name),
      stats: d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
      combatRating: rating,
      weight: d.weight / 10 + 'kg'
    });
  } catch (error) {
    res.status(404).json({ error: 'Pokemon lost in space.' });
  }
});

app.listen(3000, () => console.log('📡 Pulse detected on Port 3000'));