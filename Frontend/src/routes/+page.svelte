<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    /**
     * @param {string | URL} page
     */
    function navigate_to_Anzeige(page) {
        goto(page)
    }

    onMount(() => {
        document.documentElement.style.backgroundColor = 'black';
    });
</script>

<div class="background"></div>
<div class="content">
    <h1>Startseite Spielstandanzeige</h1>
    <div class="button_container">
        <button on:click={() => navigate_to_Anzeige("/Anzeige")}>Anzeige</button>
        <button on:click={() => navigate_to_Anzeige("/Controller")}>Controller</button>
    </div>
</div>


<style>
    /* Background Image with Blur Effect */
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('background.jpeg');
        background-size: cover;
        background-position: center;
        filter: blur(2px); /* Adjust blur intensity */
        z-index: -1; /* Place behind content */
    }

    /* Content on top of the blurred background */
    .content {
        z-index: 1;
        color: white;
        text-align: center;
    }

    .button_container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        justify-content: center;
        align-items: center;
    }

    .button_container button {
        text-decoration: none;
        text-align: center;
        display: block;
        width: 150px;
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        font-weight: bold;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .button_container button:hover {
        background-color: #004084;
    }
</style>