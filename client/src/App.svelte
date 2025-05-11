<script>
  import Frontpage from "./pages/Frontpage/Frontpage.svelte";
  import Background from "./components/Background/Background.svelte";
  import Navbar from "./components/Navbar/Navbar.svelte";

  import { Router, Route, Link } from "svelte-routing";
</script>

  <Background/>

  <Router>
    <Navbar/>
    <Route path="/">
      <Frontpage/>
    </Route> 
    <Route path="/frontpage">
      <Frontpage/>
    </Route>
  </Router>
 


