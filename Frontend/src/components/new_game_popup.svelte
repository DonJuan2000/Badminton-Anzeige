<svelte:options runes="{true}" />
<script lang="ts">
    import { Select, Label } from 'flowbite-svelte';
    import { Input } from 'flowbite-svelte';

    let {new_game_popup = $bindable(), 
        heim_team = $bindable(), 
        gast_team = $bindable()} = $props();

    let selected_team = $state('');

    let l_player_0 = $state('');
    let l_player_1 = $state('');
    let r_player_0 = $state('');
    let r_player_1 = $state('');

    let teams = [
        { value: 'left', name: 'Heimmannschaft' },
        { value: 'right', name: 'Gastmannschaft' },
    ];

    function start_new_game() {
        heim_team = [l_player_0, l_player_1];
        gast_team = [r_player_0, r_player_1];
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
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .popup {
    background: white;
    width: 50%;
    height: 40%;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    display: grid;
    grid-template-rows: 8fr 2fr;
    justify-content: center;
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