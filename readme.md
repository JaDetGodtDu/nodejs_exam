# ** TODO **
- Set up auth/protected routing on frontend routes (DONE)

- Set up toaster messages ! ! ! (DONE)

- Make death logic for pets ! ! ! (DONE)

- Set up update user info in frontend (DONE)
- Set up change password in frontend (DONE)

- Set up /signup emailing service in backend (DONE)
- Set up /signup creation of pet logic - In the frontend? Automatically when a user is created? (DONE)

- Add more stat logic (Can't play when energy=0, hunger=0 decays health etc.) (DONE)

- FIX THE ALERT WHEN DELETING ACCOUNT (DONE)

- Set up admin system in frontend (DONE)

- Set up rate limiting. (DONE)

- Expand User database object, to accomodate a leaderboard for all users and to have a list of past pets and how long they lived. (half done)

- Helmet()? (DONE)

- Make a battle system using sockets.broadcast !
    - Fix online users list and battle request functionality
        - Make usernames in chat clickable to request battle
    - Make an actual battle system and window/page/component
    - Make battles end if either user leaves the battle
    - Make it so a battle request can be cancelled
    - Make it so accepting a battle cancels other requests
    - Fix Chat with scrollbar (DONE)

- Set a limit on pet actions pr hour

set pet health to 0 string: db.pets.updateOne({name:'Dingus'}, {$set:{health:0}})