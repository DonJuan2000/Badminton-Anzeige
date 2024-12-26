<script>
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';

    import Spielfeld from '../../components/spielfeld.svelte';

    const teams = writable(["", ""]);
    const saetze = writable([])

    onMount(() => {
        document.documentElement.style.backgroundColor = 'black';

        const spielstand_SSE = new EventSource('http://localhost:3000/SSE_spielstand');
        const teams_SSE = new EventSource('http://localhost:3000/teams');

        spielstand_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            console.log("OnMount spielstand: ", data)
            saetze.set(data)
        }

        teams_SSE.onmessage = function(event) {
            var data = JSON.parse(event.data);
            console.log("OnMount teams: ", data)
            teams.set(data)
        }

        return () => {
            spielstand_SSE.close();
            teams_SSE.close();
        };         
    });
</script>

<div class="Container">   
    <!--<Spielfeld></Spielfeld>-->
    <div class="spielstand_container">
        <div class="satz_anzeige_reihe" style="color: orange;">
            <p>Heim:</p>
            {#each $saetze as satz}
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
            {#each $saetze as satz}
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
        height: 98vh; /* Ensures it fills the viewport height */
        width: 98vw;
        display: grid;
        grid-template-rows: 50% 50%;
        margin: 0;
        padding: 0;
        box-sizing: border-box; /* Ensures padding doesn't affect dimensions */
        background-color: black;
        color: white;
        text-align: center;
    }

    .spielstand_container{
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 50fr 50fr;
    }

    .satz_anzeige_reihe {
        width: 90%;
        height: 100%;
        display: grid;
        grid-template-columns: 40fr 20fr 20fr 20fr;
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