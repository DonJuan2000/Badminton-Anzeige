<svelte:options runes="{true}" />
<script>
    const BACKEND_URL = import.meta.env.VITE_PUBLIC_IP;

    import { onMount } from 'svelte';

    import Spielfeld from '../../components/spielfeld.svelte';

    let left_team = $state(["", ""]);
    let right_team = $state(["", ""]);
    let saetze = $state([[0,0]]);
    let current_satz = $state([0,0]);
    let old_satz = $state([0,0]);
    let heim_left = $state(true);
    /**
     * @type {number[]}
     */
    let heim_seite = $state([]);
    let aufschlag = $state(0);

    let saetze_to_display = $state(3);

    onMount(() => {
        document.documentElement.style.backgroundColor = 'black';

        const spielstand_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_spielstand`);
        const teams_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_teams`);

        spielstand_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            heim_left = data["heim_left"];
            saetze = data["saetze"];
            current_satz = saetze[saetze.length -1];
            heim_seite = data["heim_seite"];
            aufschlag = data["aufschlag"];

            saetze_to_display = 3;
            console.log("Saetze length", saetze.length)
            if (saetze.length >= 2) {
                let counter = 0;
                let t1_siege = 0;
                let t2_siege = 0;
                saetze.forEach((element) => {
                    console.log(element);
                    if (counter % 2 == 0) {
                    if (element[0] == 21) {
                        t1_siege++;
                    }
                    if (element[1] == 21) {
                        t2_siege++;
                    }
                    }else{
                    if (element[1] == 21) {
                        t1_siege++;
                    }
                    if (element[0] == 21) {
                        t2_siege++;
                    }
                    }
                    counter++;
                })
                if (t1_siege == 2 || t2_siege == 2) {
                    if (saetze.length == 3) {
                        saetze_to_display = 2;
                    }
                    if (saetze.length == 4) {
                        saetze_to_display = 3;
                    }
                }
            }

        }

        teams_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            left_team = data.left_team;
            right_team = data.right_team;
        }

        return () => {
            spielstand_SSE.close();
            teams_SSE.close();
        };         
    });
</script>


<div class="Container">
    <div class="test_spielstand_container">
        <div class="team_punkte_current_set">
            {current_satz[0]}
        </div>
        <Spielfeld {left_team} {right_team} {aufschlag}></Spielfeld>
        <div class="team_punkte_current_set">
            {current_satz[1]}
        </div>
    </div>
    
    <div class="spielstand_container">
        <div class="satz_anzeige_reihe" style="color: orange;">
            <p>Heim:</p>
                {#each saetze.slice(0, saetze_to_display) as satz, i}
                    {#if heim_seite[i] == 0}
                        {#if satz[0] >= 21 && (satz[0]-satz[1] >=2) || satz[0] == 30}
                            <div class="finished_satz" style="background-color: orange;">
                                {satz[0]}
                            </div>
                        {:else}
                            <div class="satz">
                                {satz[0]}
                            </div>
                        {/if}
                    {:else}
                        {#if satz[1] >= 21 && (satz[1]-satz[0] >=2) || satz[1] == 30}
                            <div class="finished_satz" style="background-color: orange;">
                                {satz[1]}
                            </div>
                        {:else}
                            <div class="satz">
                                {satz[1]}
                            </div>
                        {/if}
                    {/if}
                {/each}
        </div>
        <div class="satz_anzeige_reihe" style="color: green;">
            <p>Gast:</p>
            {#each saetze.slice(0, saetze_to_display) as satz, i}
                {#if heim_seite[i] == 1}
                    {#if satz[0] >= 21 && (satz[0]-satz[1] >=2) || satz[0] == 30}
                        <div class="finished_satz" style="background-color: green;">
                            {satz[0]}
                        </div>
                    {:else}
                        <div class="satz">
                            {satz[0]}
                        </div>
                    {/if}
                {:else}
                    {#if satz[1] >= 21 && (satz[1]-satz[0] >=2) || satz[1] == 30}
                        <div class="finished_satz" style="background-color: green;">
                            {satz[1]}
                        </div>
                    {:else}
                        <div class="satz">
                            {satz[1]}
                        </div>
                    {/if}
                {/if}
            {/each}
        </div>
    </div>
</div>


<style>
    .test_spielstand_container {
        display: grid;
        grid-template-columns: 1fr 5fr 1fr;
    }

    .team_punkte_current_set {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 150px;
    }


    .Container {
        height: 100vh;
        width: 98vw;
        display: grid;
        grid-template-rows: 2fr 3fr;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        background-color: black;
        color: white;
        text-align: center;
        justify-items: center;
        align-items: center;
    }

    .spielstand_container{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 5fr 5fr;
        text-align: center;
        justify-items: center;
        align-items: center;
    }

    .satz_anzeige_reihe {
        width: 90%;
        height: 100%;
        display: grid;
        grid-template-columns: 4fr 2fr 2fr 2fr;
        font-size: 150px;
        font-weight: bold;
        justify-content: center;
        align-items: center;
    }

    .satz {
        width: 100%;
        height: 50%;
        display: flex;
        font-weight: bold;
        justify-content: center;
        align-items: center;
    }

    .finished_satz {
        color: black;
    }

</style>