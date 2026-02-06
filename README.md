# PULSE-DEX // Neo-Noir Pokemon Interface

A high-performance, professional Pokemon discovery tool built with **Angular 19** and **Node.js**.

## 🧬 API Choice: PokéAPI
I chose the PokéAPI because it provides a deep, nested data structure that allowed me to demonstrate advanced data transformation and mapping.

## 🚀 Out-of-the-Box Feature: "Combat Rating"
Instead of simply listing raw numbers, the backend runs a custom algorithm:
- **Logic:** It aggregates all base stats and calculates a percentile score against a "Max Potential" constant ($600$). 
- **Result:** Users get an immediate "Combat Rating" percentage, turning raw data into a tactical insight.

## 🎨 Aesthetic Strategy
- **Visuals:** A "Vanta Black" background with "Neon Pink" glows to provide a premium, realistic high-tech feel.
- **UX:** Implementation of glass-morphism and CSS-driven neon pulses for loading states.

## 🛠️ Trade-offs & Future Scope
- **Current Trade-off:** Used a local Node proxy to handle data transformation, which adds a layer of complexity but ensures the frontend remains "thin" and fast.
- **Future Additions:** I would implement a "Comparison Matrix" to overlay two Pokémon stats using a Radar Chart for deeper analysis.

## 🏁 Setup
1. **Backend:** `cd backend && npm install && node src/server.js`
2. **Frontend:** `cd frontend && npm install && npm start`