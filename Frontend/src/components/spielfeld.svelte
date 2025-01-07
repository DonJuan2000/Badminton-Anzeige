<svelte:options runes="{true}" />
<script lang="ts">
    let { left_team, right_team, current_satz, old_satz = $bindable() } = $props();
    let aufschlag = $state(0);

    $effect(() => {
        console.log("Current Satz: ", current_satz);
        console.log("Old Satz: ", old_satz);
        if (current_satz[0] > old_satz[0]) {
            aufschlag = current_satz[0] % 2 === 0 ? 0 : 1;
            old_satz = current_satz;
        }
        if (current_satz[1] > old_satz[1]) {
            aufschlag = current_satz[1] % 2 === 0 ? 2 : 3;
            old_satz = current_satz;
        }
        console.log("aufschlag: ", aufschlag);
    });
</script>

<div class="spielfeld_container">
    <div class="image_container">
        <img src="Feld.png" alt="Badminton Spielfeld">
        <div class="overlay">
            <div class="corner top-left">
                <div class="text_wrap" style="color: {aufschlag == 1 ? 'green' : 'white'}">
                    {left_team[0]}
                </div>
            </div>
            <div class="corner top-right">
                <div class="text_wrap" style="color: {aufschlag == 2 ? 'green' : 'white'}">
                    {right_team[0]}
                </div>
            </div>
            <div class="corner bottom-left">
                <div class="text_wrap" style="color: {aufschlag == 0 ? 'green' : 'white'}">
                    {left_team[1]}
                </div>
            </div>
            <div class="corner bottom-right">
                <div class="text_wrap" style="color: {aufschlag == 3 ? 'green' : 'white'}">
                    {right_team[1]}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .spielfeld_container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 600px;
        height: auto;
        overflow: hidden;
        box-sizing: border-box;
    }

    .image_container {
        position: relative;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: white;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        pointer-events: none;
    }

    .corner {
        position: absolute;
        width: 28.7%;
        height: 40.5%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(105, 105, 105, 0.25);
    }

    .top-left {
        top: 9%;
        left: 7.7%;
    }

    .top-right {
        top: 9%;
        right: 7.7%;
    }

    .bottom-left {
        bottom: 9%;
        left: 7.7%;
    }

    .bottom-right {
        bottom: 9%;
        right: 7.7%;
    }

    .text_wrap {
        font-size: 2rem;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
