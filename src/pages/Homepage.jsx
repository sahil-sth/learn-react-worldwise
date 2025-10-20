import PageNav from "../components/PageNav";
import { Link } from "react-router-dom";
function Homepage() {
  return (
    <div>
      <PageNav />
      <h1>Welcome to world wise</h1>
      <Link to="/app">Go to the app</Link>
    </div>
  );
}

export default Homepage;
