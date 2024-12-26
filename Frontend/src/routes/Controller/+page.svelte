<svelte:options runes="{true}" />
<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    import Spielfeld from '../../components/spielfeld.svelte';
    import PopUp from '../../components/new_game_popup.svelte';

    let new_game_popup = $state(false);

    let heim_team = $state(["P1", "P2"]);
    let gast_team = $state(["P3", "P4"]);
    $effect(() => {
        console.log("effect heim team: ", heim_team);
        update_teams();
	});

    const saetze = writable([[0,0]]);
    const current_satz = writable([0,0]);

    onMount(() => {
        document.documentElement.style.backgroundColor = 'black';
        fetch("http://localhost:3000/get_spielstand")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            saetze.set(data);
            current_satz.set(data.pop());
        })

        fetch("http://localhost:3000/get_team_names")
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            heim_team = data[0];
            gast_team = data[1];
            update_teams();
        })
    });

    function update_teams() {       
        fetch("http://localhost:3000/update_teams",
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            teams: [[heim_team],[gast_team]]
            })
        });
    }

    function update_spielstand(team: number,update: number) {
        let score_left_team = $current_satz[0];
        let score_right_team = $current_satz[1];
        let new_game = false;
        if (team == 0) {
            score_left_team += update;
            if (score_left_team >= 21 && (score_left_team-score_right_team >=2) || score_left_team == 30) {
                new_game = true;   
            }
        } else {
            score_right_team += update;
            if (score_right_team >= 21 && (score_right_team-score_left_team >=2) || score_right_team == 30) {
                new_game = true;
            }
        }

        if (new_game == true) {
            let new_satz = [score_left_team,score_right_team];
            let new_saetze = $saetze;
            new_saetze.pop();
            new_saetze.push(new_satz);
            new_saetze.push([0,0]);
            current_satz.set([0,0]);
            saetze.set(new_saetze);
        } else {
            const new_satz = [score_left_team,score_right_team];
            current_satz.set(new_satz); 
            let new_saetze = $saetze;
            new_saetze.pop();
            new_saetze.push(new_satz);
            saetze.set(new_saetze);
        }

        fetch("http://localhost:3000/update_spielstand",
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            spielstand: $saetze
            })
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }

    function handleClick(team: any) {
        if (team == "left") {
            console.log({heim_team});
            let new_team = [heim_team[0], heim_team[0]];
            console.log(new_team);
        }
    }

    function start_new_game() {
        new_game_popup = !new_game_popup;
    }
</script>



<div class="Container">
    {#if new_game_popup}
        <PopUp bind:new_game_popup={new_game_popup}
               bind:heim_team={heim_team}
               bind:gast_team={gast_team} ></PopUp>
    {/if}

    <div class="new_game_button">
        <button onclick={start_new_game}>New Game</button>
    </div>

    <div class="player_switch_container">
        <div class="switch_button_container">
            <button class="round-button" onclick={() => handleClick("left")}>
                <img src="Switch_Button.png" alt="Button" />
            </button>
        </div>
        <Spielfeld {heim_team} {gast_team}></Spielfeld>
        <div class="switch_button_container">
            <button class="round-button" onclick={() => handleClick("right")}>
                <img src="Switch_Button.png" alt="Button" />
            </button>
        </div>
    </div>

    
    <div class="punkte_button_container">
        <button onclick={() => update_spielstand(0,1)}>+</button>
        <button onclick={() => update_spielstand(0,-1)}>-</button>
        <p></p>
        <button onclick={() => update_spielstand(1,1)}>+</button>
        <button onclick={() => update_spielstand(1,-1)}>-</button>
    </div>
    
</div>


<style>
    

    .new_game_button {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .new_game_button button {
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 20px;
        cursor: pointer;
    }

    .new_game_button button:hover {
        transform: scale(1.2);
    }

    .new_game_button button:active {
        transform: scale(0.9);
    }

    .switch_button_container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .round-button {
        display: inline-block;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        outline: none;
        width: 100px; /* Adjust size */
        height: 100px; /* Same as width */
        border-radius: 50%; /* Makes the button circular */
        overflow: hidden; /* Ensures the clickable area is restricted */
    }

    .round-button img {
        display: block;
        width: 100%; /* Fills the button area */
        height: 100%; /* Fills the button area */
        object-fit: cover; /* Ensures proper scaling */
    }

    .round-button:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2); /* Optional hover effect */
        transform: scale(1.2); /* Click effect */
    }

    .round-button:active {
        transform: scale(0.95); /* Click effect */
    }




    .Container {
        height: 98vh; /* Ensures it fills the viewport height */
        display: grid;
        grid-template-rows: 0.2fr 2fr 2fr 1fr 1fr;
        margin: 0;
        padding: 0;
        box-sizing: border-box; /* Ensures padding doesn't affect dimensions */
        background-color: black;
        color: white;
        text-align: center;
        justify-items: center;
        align-items: center;
    }

    .punkte_button_container {
        width: 80%;
        display: grid;
        grid-template-columns: 1fr 1fr 3fr 1fr 1fr;
    }

    .player_switch_container {
        display: grid;
        grid-template-columns: 1fr 8fr 1fr;
    }
</style>