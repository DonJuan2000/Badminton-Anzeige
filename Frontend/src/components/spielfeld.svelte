<script lang="ts">
    import { onMount } from "svelte";

    let { heim_team, gast_team} = $props();

    let loc_heim_team = $state([]);
    let loc_gast_team = $state([]);

    onMount(() => {
        loc_heim_team = heim_team;
        loc_gast_team = gast_team;
    })
</script>


<div class="spielfeld_container">
    <div class="image_container">
        <img src="Feld.png" alt="Badminton Spielfeld" class="responsive-image">
        <div class="overlay">
            <div class="corner top-left">{loc_heim_team[0]}</div>
            <div class="corner top-right">{loc_gast_team[0]}</div>
            <div class="corner bottom-left">{loc_heim_team[1]}</div>
            <div class="corner bottom-right">{loc_gast_team[1]}</div>
        </div>
    </div>
</div>


<style>
    .spielfeld_container {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image_container {
        position: relative; /* Establishes a positioning context for the overlay */
        display: flex; /* Enables flexbox for centering child elements */
        justify-content: center; /* Centers horizontally */
        align-items: center; /* Centers vertically */
    }

    .responsive-image {
        width: 100%; /* Ensures the image is responsive */
        height: auto; /* Maintains aspect ratio */
        display: block; /* Removes inline-block spacing issues */
    }

    .overlay {
        position: absolute;
        width: 84.5%;
        height: 82.5%;
        color: white;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 80px;
        font-weight: bold;
        
    }

    .corner {
        position: absolute; /* Allows placement in specific corners */
        padding: 10px; /* Optional: Adjust padding as needed */
        background: rgba(255, 255, 255, 0.2); /* Optional: Background for visibility */
        color: white; /* Text color */
        width: 32.5%;
        height: 46.4%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .top-left {
        top: 0;
        left: 0;
    }

    .top-right {
        top: 0;
        right: 0;
    }

    .bottom-left {
        bottom: 0;
        left: 0;
    }

    .bottom-right {
        bottom: 0;
        right: 0;
    }
</style>