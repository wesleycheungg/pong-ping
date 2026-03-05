import { useState, useEffect } from "react";
import {
  collection, doc, onSnapshot,
  addDoc, setDoc, deleteDoc,
  query, orderBy, limit,
} from "firebase/firestore";

import { db } from "./firebase";
import { calcElo, DEFAULT_ELO } from "./utils/elo";
import globalStyles from "./styles/global";

import Header        from "./components/Header";
import Tabs          from "./components/Tabs";
import Rankings      from "./components/Rankings";
import LogMatch      from "./components/LogMatch";
import History       from "./components/History";
import AddPlayers    from "./components/AddPlayers";
import PlayerProfile from "./components/PlayerProfile";

export default function App() {
  const [players, setPlayers]             = useState([]);
  const [matches, setMatches]             = useState([]);
  const [tab, setTab]                     = useState("board");
  const [flashMsg, setFlashMsg]           = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    const unsubPlayers = onSnapshot(collection(db, "players"), snap => {
      setPlayers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    const unsubMatches = onSnapshot(
      query(collection(db, "matches"), orderBy("date", "desc"), limit(200)),
      snap => setMatches(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
    return () => { unsubPlayers(); unsubMatches(); };
  }, []);

  function flash(msg) {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(null), 2500);
  }

  async function handleAddPlayer(name) {
    if (players.find(p => p.name.toLowerCase() === name.toLowerCase())) {
      flash("Player already exists!");
      return;
    }
    await addDoc(collection(db, "players"), { name, elo: DEFAULT_ELO, wins: 0, losses: 0 });
    flash(`${name} added!`);
  }

  async function handleLogMatch(winnerName, loserName) {
    const w = players.find(p => p.name === winnerName);
    const l = players.find(p => p.name === loserName);
    if (!w || !l) return;
    const { newWinner, newLoser, winnerGain } = calcElo(w.elo, l.elo);
    await setDoc(doc(db, "players", w.id), { ...w, elo: newWinner, wins: w.wins + 1 });
    await setDoc(doc(db, "players", l.id), { ...l, elo: newLoser, losses: l.losses + 1 });
    await addDoc(collection(db, "matches"), {
      winner: winnerName, loser: loserName,
      winnerElo: newWinner, loserElo: newLoser,
      gain: winnerGain, date: Date.now(),
    });
    flash(`${winnerName} +${winnerGain} ELO 🏆`);
  }

  async function handleDeletePlayer(player) {
    if (!window.confirm(`Remove ${player.name}?`)) return;
    await deleteDoc(doc(db, "players", player.id));
    flash(`${player.name} removed`);
  }

  // Keep profile in sync if player data updates
  const liveSelectedPlayer = selectedPlayer
    ? players.find(p => p.id === selectedPlayer.id) ?? selectedPlayer
    : null;

  if (loading) return (
    <>
      <style>{globalStyles}</style>
      <div className="loading-screen">
        <div className="loading-text">LOADING...</div>
      </div>
    </>
  );

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app">
        <div className="bg-gradient" />
        <div className="container">
          <Header />
          {flashMsg && <div className="flash">{flashMsg}</div>}
          <Tabs active={tab} onChange={setTab} />

          {tab === "board"   && (
            <Rankings
              players={players}
              matches={matches}
              onSelectPlayer={setSelectedPlayer}
            />
          )}
          {tab === "match"   && <LogMatch   players={players} onSubmit={handleLogMatch} />}
          {tab === "history" && <History    matches={matches} />}
          {tab === "add"     && (
            <AddPlayers
              players={players}
              onAdd={handleAddPlayer}
              onDelete={handleDeletePlayer}
            />
          )}
        </div>

        {/* Player profile modal */}
        {liveSelectedPlayer && (
          <PlayerProfile
            player={liveSelectedPlayer}
            matches={matches}
            allPlayers={players}
            onClose={() => setSelectedPlayer(null)}
          />
        )}
      </div>
    </>
  );
}
