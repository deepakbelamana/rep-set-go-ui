import './home.css';

export default function Home() {
  const workoutLists = []; // Later fetch from backend

  return (
    <div className="home-container">
      <h2>Welcome to Rep Set Go!</h2>
      {workoutLists.length === 0 ? (
        <div className="empty-state">
          <p>No workout list found.</p>
          <button className="floating-btn">+ Add Workout List</button>
        </div>
      ) : (
        <ul>
          {workoutLists.map((list) => (
            <li key={list.id}>{list.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
