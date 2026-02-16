// Task 1: Multi-Tier Artist Categorization
const task1ArtistTotal = listeningData.reduce((acc, song) => {
    acc[song.artist] = (acc[song.artist] || 0) + song.streams;
    return acc;
}, {});

const task1Answer = Object.entries(task1ArtistTotal).map(([artist, totalStreams]) => {
    const tier = totalStreams >= 10000000
    ? "Platinum"
    : totalStreams >= 5000000
    ? "Gold"
    : "Silver";
    return { artist, totalStreams, tier };
}).sort((a, b) => b.totalStreams - a.totalStreams);

// Task 2: Genre Performance Metrics
const task2GroupedByGenre = listeningData.reduce((acc, song) => {
    if (!acc[song.genre]) {
        acc[song.genre] = [];
    }
    acc[song.genre].push(song);
    return acc;
}, {});

const task2Answer = Object.entries(task2GroupedByGenre).reduce((acc, [genre, songs]) => {
    const songCount = songs.length;
    const totalStreams = songs.reduce((sum, song) => sum + song.streams, 0);
    const totalRating = songs.reduce((sum, song) => sum + song.rating, 0);
    const avgStreams = totalStreams / songCount;
    const avgRating = totalRating / songCount;
    const engagementScore = Number((((avgStreams / 1000000) * avgRating).toFixed(2)));

    acc[genre] = {
        avgStreams,
        avgRating: Number(avgRating.toFixed(2)),
        songCount,
        engagementScore
    };

    return acc;
}, {});

// Task 3: Peak Performance Window Analysis (4-song sliding window)
const task3Windows = listeningData
    .slice(0, listeningData.length - 3)
    .map((_, startIndex) => {
        const windowSongs = listeningData.slice(startIndex, startIndex + 4);
        const totalScore = windowSongs.reduce(
            (sum, song) => sum + (song.streams / 1000) + (song.rating * 500),
            0
        );

        return {
            startIndex,
            endIndex: startIndex + 3,
            songs: windowSongs.map((song) => song.title),
            totalScore: Number(totalScore)
        };
    });

const task3Answer = task3Windows.reduce((best, current) => {
    return current.totalScore > best.totalScore ? current : best;
}, task3Windows[0]);

// Task 4: Cross-Genre Artist Diversity Analysis
const task4ArtistGenreMap = listeningData.reduce((acc, song) => {
    if (!acc[song.artist]) {
        acc[song.artist] = {};
    }
    if (!acc[song.artist][song.genre]) {
        acc[song.artist][song.genre] = [];
    }
    acc[song.artist][song.genre].push(song.streams);
    return acc;
}, {});

const task4Answer = Object.entries(task4ArtistGenreMap)
    .map(([artist, genresObj]) => {
        const genres = Object.keys(genresObj);
        const genreAverages = genres.reduce((acc, genre) => {
            const streams = genresObj[genre];
            const avgStreams = streams.reduce((sum, value) => sum + value, 0) / streams.length;
            acc[genre] = avgStreams;
            return acc;
        }, {});

        const bestGenreEntry = Object.entries(genreAverages).reduce((best, current) => {
            return current[1] > best[1] ? current : best;
        });

        return {
            artist,
            genres,
            genreCount: genres.length,
            bestGenre: bestGenreEntry[0],
            bestGenreAvgStreams: Number(bestGenreEntry[1].toFixed(2))
        };
    })
    .filter((artistData) => artistData.genreCount >= 3)
    .sort((a, b) => b.genreCount - a.genreCount || b.bestGenreAvgStreams - a.bestGenreAvgStreams);

// Task 5: Premium Playlist Curation Algorithm
const task5Answer = listeningData
    .filter((song) => song.rating >= 4.3)
    .filter((song) => song.streams >= 2000000)
    .filter((song) => song.duration >= 180 && song.duration <= 240)
    .map((song) => ({
        title: song.title,
        artist: song.artist,
        qualityScore: Number(((song.rating * 2) + (song.streams / 500000)).toFixed(2))
    }))
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, 10);

// Render answers to the page
const renderAnswer = (id, value) => {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = JSON.stringify(value, null, 2);
    }
};

renderAnswer("task1Answer", task1Answer);
renderAnswer("task2Answer", task2Answer);
renderAnswer("task3Answer", task3Answer);
renderAnswer("task4Answer", task4Answer);
renderAnswer("task5Answer", task5Answer);
