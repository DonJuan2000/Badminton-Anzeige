<svelte:options runes="{true}"/>
<script lang="ts">
    import { getContext } from 'svelte';
    import { Select, Label } from 'flowbite-svelte';
    import { Input } from 'flowbite-svelte';

    const BACKEND_URL = "192.168.178.168";

    interface Game {
        saetze: number[][];
        current_set: number[];
        left_team: string[];
        right_team: string[];
        team_mapping: number[];
        set_game_started: (started: boolean) => void;
        set_left_team: (new_team: string[]) => void;
        set_right_team: (new_team: string[]) => void;
        set_team_mapping: (new_mapping: number[]) => void;
        reset: () => void;
    }

    const game = getContext<Game>('game');

    let {new_game_popup = $bindable()} = $props();

    let l_player_0 = $state('');
    let l_player_1 = $state('');
    let r_player_0 = $state('');
    let r_player_1 = $state('');

    let selected_team = $state(0);
    let teams = [
        { value: 0, name: 'Heimmannschaft' },
        { value: 1, name: 'Gastmannschaft' },
    ];

    let selected_aufschlag = $state(0);
    let aufschlag = [
        { value: 0, name: 'links' },
        { value: 2, name: 'rechts' },
    ]

    function new_game_request() {       
        fetch(`http://${BACKEND_URL}:3000/new_game`,
        {
            method: "POST",
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            teams: [[game.left_team],[game.right_team]],
            team_mapping: game.team_mapping
            })
        })
        .then(() => {
            game.set_game_started(true);
        });
    }

    function start_new_game() {
        game.reset();
        game.set_left_team([l_player_0, l_player_1]);
        game.set_right_team([r_player_0, r_player_1]);
        game.set_team_mapping([selected_team, selected_team == 1 ? 0 : 1]);
        new_game_request();
        new_game_popup = !new_game_popup;
    }
</script>

<div class="overlay">
    <div class="popup">
        <div class="name_grid">
            <div class="grid_columns">
                <p>Linkes Team</p>
                <form>
                    <div>
                        <Label class="text-black text-3xl">First Player</Label>
                        <Input bind:value={l_player_0} class="w-full" type="text" required/>
                    </div>

                    <div>
                        <Label class="text-black text-3xl">Second Player</Label>
                        <Input bind:value={l_player_1} class="w-full" type="text" required/>
                    </div>
                </form>
                <Label class="text-black text-3xl">
                    Heim / Gast
                    <Select class="mt-2" items={teams} bind:value={selected_team} />
                </Label>
            </div>
            <div class="grid_columns">
                <p>Rechtes Team</p>
                <form>
                    <div>
                        <Label class="text-black text-3xl">First Player</Label>
                        <Input bind:value={r_player_0} class="w-full" type="text" required/>
                    </div>
                    <div>
                        <Label class="text-black text-3xl">Second Player</Label>
                        <Input bind:value={r_player_1} class="w-full" type="text" required/>
                    </div>
                </form>
                <Label class="text-black text-3xl">
                    Aufschlagseite
                    <Select class="mt-2" items={aufschlag} bind:value={selected_aufschlag} />
                </Label>
            </div>
        </div>
        <button class="text-3xl py-8 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
        onclick={start_new_game}>
            Start New Game
        </button>
    </div>
</div>

<style>
    .overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup {
    background: white;
    width: 90%;
    height: 70%;
    border-radius: 10px;
    overflow: auto;
    display: grid;
    grid-template-rows: 8fr 2fr;
    justify-items: center;
    align-items: center;
  }

  .popup::-webkit-scrollbar {
    display: none;
  }

  .name_grid {
    width: 90%;
    height: 90%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    color: black;
    font-size: 50px;
  }

  .grid_columns {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    align-items: center;
    justify-content: center;
  }
</style>