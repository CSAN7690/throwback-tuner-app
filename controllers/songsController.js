const express = require('express');
const songs = express.Router();
const { getAllSongs, getSongById, createSong } = require('../queries/songs');

songs.get("/", async (req, res) => {
    try {
        const allSongs = await getAllSongs();
        if (allSongs.length > 0) {
            res.status(200).json(allSongs);
        } else {
            res.status(404).json({ error: "No songs found" });
        }
    } catch (error) {
        console.error("Error getting all songs:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Show route
songs.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const song = await getSongById(id);
        if (song) {
            res.status(200).json(song);
        } else {
            res.status(404).json({ error: "Song not found" });
        }
    } catch (error) {
        console.error(`Error getting song with ID ${id}:`, error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Create route
songs.post("/", async (req, res) => {
    const { name, artist, album, minutes, seconds, is_favorite } = req.body;
    if (!name || !artist) {
        return res.status(400).json({ error: "Name and artist are required" });
    }
    if (typeof is_favorite !== 'boolean') {
        return res.status(400).json({ error: "is_favorite must be a boolean" });
    }
    try {
        const newSong = await createSong({ name, artist, album, minutes, seconds, is_favorite });
        res.status(201).json(newSong);
    } catch (error) {
        console.error("Error creating new song:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = songs;
