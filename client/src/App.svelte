<script>
  import Frontpage from "./pages/Frontpage/Frontpage.svelte";
  import Background from "./components/Background/Background.svelte";
  import Navbar from "./components/Navbar/Navbar.svelte";
  import Petpage from "./pages/Petpage/Petpage.svelte";
  import Profilepage from "./pages/Profilepage/Profilepage.svelte";
  import Loginpage from "./pages/Loginpage/Loginpage.svelte";
  import Signuppage from "./pages/Signuppage/Signuppage.svelte";


  import { Router, Route } from "svelte-routing";
</script>

  <Background/>

  <Router>
    <Navbar/>

    <Route path="/">
      <Frontpage/>
    </Route> 

    <Route path="/petpage">
      <Petpage/>
    </Route>

    <Route path="/profilepage">
      <Profilepage/>
    </Route>
    
    <Route path="/login">
      <Loginpage/>
    </Route>

    <Route path="/signup">
      <Signuppage/>
    </Route>
  </Router>
 


