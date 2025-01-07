<svelte:options runes="{true}" />
<script>
    const BACKEND_URL = "192.168.178.168";

    import { onMount } from 'svelte';

    import Spielfeld from '../../components/spielfeld.svelte';

    let left_team = $state(["", ""]);
    let right_team = $state(["", ""]);
    let saetze = $state([[0,0]]);
    let current_satz = $state([0,0]);
    let old_satz = $state([0,0]);

    $effect(() => {
        const temp = saetze;
        console.log("effect saetze: ", temp);
        current_satz = temp[temp.length - 1];
        console.log("effect current satz: ", current_satz);
    })

    onMount(() => {
        document.documentElement.style.backgroundColor = 'black';

        const spielstand_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_spielstand`);
        const teams_SSE = new EventSource(`http://${BACKEND_URL}:3000/SSE_teams`);

        spielstand_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            saetze = data;
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
    <Spielfeld {left_team} {right_team} {current_satz} {old_satz}></Spielfeld>
    <div class="spielstand_container">
        <div class="satz_anzeige_reihe" style="color: orange;">
            <p>Heim:</p>
            {#each saetze as satz}
                {#if satz[0] >= 21 && (satz[0]-satz[1] >=2) || satz[0] == 30}
                    <div class="finished_satz" style="background-color: orange;">
                        {satz[0]}
                    </div>
                {:else}
                    <div class="satz">
                        {satz[0]}
                    </div>
                {/if}
            {/each}
        </div>
        <div class="satz_anzeige_reihe" style="color: green;">
            <p>Gast:</p>
            {#each saetze as satz}
                {#if satz[1] >= 21 && (satz[1]-satz[0] >=2) || satz[1] == 30}
                    <div class="finished_satz" style="background-color: green;">
                        {satz[1]}
                    </div>
                {:else}
                    <div class="satz">
                        {satz[1]}
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>


<style>
    .Container {
        height: 98vh;
        width: 98vw;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
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
        font-size: 125px;
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