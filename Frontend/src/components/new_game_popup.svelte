<svelte:options runes={true} />

<script lang="ts">
    import { getContext } from "svelte";
    import { Select, Label } from "flowbite-svelte";
    import { Input } from "flowbite-svelte";

    const BACKEND_URL = import.meta.env.VITE_PUBLIC_IP;

    let { new_game_popup = $bindable(), selected_spielart = $bindable() } =
        $props();

    interface Game {
        saetze: number[][];
        current_set: number[];
        left_team: string[];
        right_team: string[];
        heim_left: boolean;
        set_game_started: (started: boolean) => void;
        set_left_team: (new_team: string[]) => void;
        set_right_team: (new_team: string[]) => void;
        set_heim_left: (new_mapping: boolean) => void;
        reset: () => void;
    }

    const game = getContext<Game>("game");

    let l_player_0 = $state("");
    let l_player_1 = $state("");
    let r_player_0 = $state("");
    let r_player_1 = $state("");

    let selected_team = $state(true);
    let teams = [
        { value: false, name: "Heim" },
        { value: true, name: "Gast" },
    ];

    let selected_aufschlag = $state(0);
    let aufschlag = [
        { value: 2, name: "Links" },
        { value: 0, name: "Rechts" },
    ];

    //let selected_spielart = $state(0);
    let spielart = [
        { value: 0, name: "Einzel" },
        { value: 1, name: "Doppel" },
    ];

    function new_game_request() {
        console.log("spielart: ", selected_spielart);
        fetch(`http://${BACKEND_URL}:3000/new_game`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                teams: [[game.left_team], [game.right_team]],
                heim_left: game.heim_left,
                aufschlag: selected_aufschlag,
                spielart: selected_spielart,
            }),
        }).then(() => {
            game.set_game_started(true);
        });
    }

    function start_new_game() {
        game.reset();
        game.set_left_team([r_player_1, r_player_0]);
        game.set_right_team([l_player_1, l_player_0]);
        game.set_heim_left(selected_team);
        new_game_request();
        new_game_popup = !new_game_popup;
    }

    function closePopup() {
        new_game_popup = !new_game_popup;
    }
</script>

<div class="overlay">
    <div class="popup">
        <button
            class="exit-button absolute top-1 right-3 text-black hover:text-gray-500"
            onclick={closePopup}
        >
            <span class="text-4xl">
                <!-- Add the Tailwind CSS font size utility class here -->
                &times;
            </span>
        </button>

        <Label class="text-black text-3xl">
            Spielart
            <Select
                class="mt-2"
                items={spielart}
                bind:value={selected_spielart}
            />
        </Label>
        <div class="name_grid">
            <div class="grid_columns">
                <p class="underline">Linkes Team</p>
                {#if selected_spielart == 0}
                    <form>
                        <div>
                            <Label class="text-black text-3xl"
                                >Player Name</Label
                            >
                            <Input
                                bind:value={l_player_1}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>
                    </form>
                {:else}
                    <form>
                        <div>
                            <Label class="text-black text-3xl">Player 1</Label>
                            <Input
                                bind:value={l_player_0}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>

                        <div>
                            <Label class="text-black text-3xl">Player 2</Label>
                            <Input
                                bind:value={l_player_1}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>
                    </form>
                {/if}
                <Label class="text-black text-2xl">
                    Heim/Gast
                    <Select
                        class="mt-2"
                        items={teams}
                        bind:value={selected_team}
                    />
                </Label>
            </div>
            <div class="grid_columns">
                <p class="underline">Rechtes Team</p>
                {#if selected_spielart == 0}
                    <form>
                        <div>
                            <Label class="text-black text-3xl"
                                >Player Name</Label
                            >
                            <Input
                                bind:value={r_player_0}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>
                    </form>
                {:else}
                    <form>
                        <div>
                            <Label class="text-black text-3xl">Player 1</Label>
                            <Input
                                bind:value={r_player_0}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>
                        <div>
                            <Label class="text-black text-3xl">Player 2</Label>
                            <Input
                                bind:value={r_player_1}
                                class="w-full"
                                type="text"
                                required
                            />
                        </div>
                    </form>
                {/if}
                <Label class="text-black text-2xl">
                    Aufschlagseite
                    <Select
                        class="mt-2"
                        items={aufschlag}
                        bind:value={selected_aufschlag}
                    />
                </Label>
            </div>
        </div>
        <button
            class="text-3xl py-8 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            onclick={start_new_game}
        >
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
        height: 80%;
        border-radius: 10px;
        overflow: auto;
        display: grid;
        justify-items: center;
        align-items: center;
        position: relative;
    }

    .exit-button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.5rem;
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
        font-size: 40px;
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
