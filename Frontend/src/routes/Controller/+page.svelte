<svelte:options runes="{true}" />
<script lang="ts">
    const BACKEND_URL = "192.168.178.168";    
    
    import { onMount } from 'svelte';
    import { setContext } from 'svelte';

    import Spielfeld from '../../components/spielfeld.svelte';
    import PopUp from '../../components/new_game_popup.svelte';

    class Game {
        saetze = $state([[0,0]]);
        current_set = $state([0,0]);
        left_team = $state(["", ""]);
        right_team = $state(["", ""]);
        last_point = $state(-1);
        old_satz = $state([0,0]);
        aufschlag = $state(0);
        heim_left = $state(0);
        game_started = $state(false);
        spielart = $state(0);

        set_current_set(new_set: number[]) {
            this.current_set = new_set;
        }
        set_saetze(new_saetze: number[][]) {
            this.saetze = new_saetze;
        }
        set_left_team(new_team: string[]) {
            this.left_team = new_team;
        }
        set_right_team(new_team: string[]) {
            this.right_team = new_team;
        }
        set_last_point(new_point: number) {
            this.last_point = new_point;
        }
        set_old_satz(new_satz: number[]) {
            this.old_satz = new_satz;
        }
        set_aufschlag(new_aufschlag: number) {
            this.aufschlag = new_aufschlag;
        }
        set_heim_left(new_mapping: number) {
            this.heim_left = new_mapping;
        }
        set_game_started(new_state: boolean) {
            this.game_started = new_state;
        }
        set_spielart(new_spielart: number) {
            this.spielart = new_spielart;
        }
        reset() {
            this.saetze = [[0,0]];
            this.current_set = [0,0];
            this.left_team = ["", ""];
            this.right_team = ["", ""];
            this.last_point = -1;
            this.old_satz = [0,0];
            this.heim_left = 0;
            this.aufschlag = 0;
            this.spielart = 0;
        }
    }

    let game = new Game();
    setContext('game', game);
    
    let spielart = $state(0);
    $effect(() => {
        game.set_spielart(spielart);
        console.log("Spielart: ", game.spielart);
    })

    let new_game_popup = $state(false);
    let pos_switch_active = $state(false);

    onMount(() => {
        const spielstand_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_spielstand`);
        const teams_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_teams`);

        fetch(`http://${BACKEND_URL}:3000/Controler_mount`)
        .then((response) => response.json())
        .then((data) => {
            game.set_saetze(data.saetze);
            game.set_current_set(data.current_set);
            game.set_left_team(data.left_team);
            game.set_right_team(data.right_team);
            game.set_last_point(data.last_point);
            game.set_old_satz(data.old_satz);
            game.set_aufschlag(data.aufschlag);
            game.set_heim_left(data.heim_left);
            game.set_game_started(data.game_started);
            game.set_spielart(data.spielart);
        });
    
        spielstand_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            game.set_current_set(data["saetze"].pop());
            game.set_aufschlag(data["aufschlag"]);
        }

        teams_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            game.left_team = data.left_team;
            game.right_team = data.right_team;
        }

        return () => {
            spielstand_SSE.close();
            teams_SSE.close();
        };   
    });

    function update_teams(switch_action:string) {       
        fetch(`http://${BACKEND_URL}:3000/update_teams`,
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            update: switch_action
            })
        });
    }

    function start_new_game() {
        new_game_popup = !new_game_popup;
    }

    function req_update_spielstand(team: string, update: number) {
        fetch(`http://${BACKEND_URL}:3000/test_update`,
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                team: team,
                update: update
            })
        })
    }
</script>

<div class="background">
    
</div>
<div class="Container">
    {#if new_game_popup}
    <PopUp
        bind:new_game_popup={new_game_popup} bind:selected_spielart={spielart}>
    </PopUp>
    {/if}

    {#if game.game_started == false}
        <div class="menu_container">
            <button onclick={start_new_game}>Start Game</button>
        </div>
    {:else}

        <div class="menu_container">
            <button onclick={start_new_game}>New Game</button>
            {#if game.spielart != 0}
                <button onclick={() => pos_switch_active = !pos_switch_active}>Switch Player</button>
            {/if}
        </div>

        <div class="Spielfeld_outer_container">
            {#if pos_switch_active == true}
                <div class="switch_view_row_container">
                    <div class="switch_view_column_container">
                        <div class="switch_button_container">
                            <button class="round-button" onclick={() => update_teams("left")}>
                                <img src="Switch_Button.png" alt="Button" />
                            </button>
                        </div>
                        <Spielfeld left_team={game.left_team} right_team={game.right_team} aufschlag={game.aufschlag}></Spielfeld>
                        <div class="switch_button_container">
                            <button class="round-button" onclick={() => update_teams("right")}>
                                <img src="Switch_Button.png" alt="Button" />
                            </button>
                        </div>
                    </div>
                    <!--<div class="team_switch_button_container">
                        <img src="Switch_Button.png" alt="Button" onclick={() => update_teams("teams")}/>
                    </div>-->
                </div>
            {:else}
            <Spielfeld left_team={game.left_team} right_team={game.right_team} aufschlag={game.aufschlag}></Spielfeld>
            {/if}
        </div>

        <div class="Spielstand_container">
            <p>{game.current_set[0]}</p>
            <p></p>
            <p>{game.current_set[1]}</p>
        </div>
    
        <div class="punkte_button_container">
            <div class="up_down_container">
                <button onclick={() => req_update_spielstand("left",1)}>&#8593</button>
                <button onclick={() => req_update_spielstand("left",-1)}>&#8595</button>
            </div>
            <p></p>
            <div class="up_down_container">
                <button onclick={() => req_update_spielstand("right",1)}>&#8593</button>
                <button onclick={() => req_update_spielstand("right",-1)}>&#8595</button>
            </div>
        </div>
    {/if}
</div>


<style>
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('background.jpeg');
        background-size: cover;
        background-position: center;
        filter: blur(2px);
        z-index: -1;
    }

    .Container {
        height: 98vh;
        width: 98vw;
        display: grid;
        grid-template-rows: 1fr 3fr 1fr 3fr;
        box-sizing: border-box;
        color: white;
        text-align: center;
        justify-items: center;
        align-items: center;
    }
        .menu_container {
            justify-content: space-evenly;
            display: inline;
            background-color: rgb(49, 0, 73);
            border-radius: 4px;
            margin: 4px;
        }
            .menu_container button {
                padding: 10px 20px;
                border-radius: 10px;
                font-size: 20px;
                cursor: pointer;
            }
            .menu_container button:hover {
                transform: scale(1.2);
            }
            .menu_container button:active {
                transform: scale(0.9);
            }

        .Spielfeld_outer_container {
            width: 100%;
            height: 100%;
            justify-items: center;
        }
            .switch_view_row_container {
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-rows: 9fr 1fr;
            }
                .switch_view_column_container {
                    width: 100%;
                    height: 100%;
                    display: grid;
                    grid-template-columns: 0.5fr 9fr 0.5fr;
                }
                    .team_switch_button_container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 0;
                        height: 100%;
                        width: 100%;
                        position: relative;
                    }
                    .team_switch_button_container img {
                        width: auto; /* Force the image to take up the full width of the container */
                        height: 100%; /* Maintain aspect ratio */
                        max-height: 100%; /* Prevent the image from exceeding container height */
                        object-fit: contain; /* Maintain the aspect ratio of the image */
                        position: absolute; /* Ensure it stays within the container */
                        cursor: pointer;
                        transform: rotate(90deg);
                    }
                    .team_switch_button_container img:active {
                        transform: rotate(90deg) scale(0.8); /* Click effect */
                    }
                        .round-button {
                            display: inline-block;
                            padding: 0;
                            cursor: pointer;
                            width: 100%; /* Adjust size */
                            height: auto; /* Same as width */
                            border-radius: 50%; /* Makes the button circular */
                            overflow: hidden; /* Ensures the clickable area is restricted */
                        }
                        .round-button img {
                            display: block;
                            width: 100%; /* Fills the button area */
                            height: 100%; /* Fills the button area */
                            object-fit: cover; /* Ensures proper scaling */
                        }
                        .round-button:active {
                            transform: scale(0.8); /* Click effect */
                        }

        .Spielstand_container {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 0.34fr 1fr;
            justify-items: center;
        }

            .Spielstand_container p {
                font-size: 50px;
                font-weight: bold;
            }

        .punkte_button_container {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 0.34fr 1fr;
            justify-items: center;
        }
            .punkte_button_container button {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: 5px;
                padding: 20px 35px;
                border-radius: 6px;
                font-weight: bold;
                font-size: 40px;
                border: none;
                color: #fff;
                background: linear-gradient(180deg, #4B91F7 0%, #367AF6 100%);
                background-origin: border-box;
                box-shadow: 0px 0.5px 1.5px rgba(54, 122, 246, 0.25), inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2);
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .punkte_button_container button:active {
                transform: scale(1.1);
            }
</style>