<script lang="ts">
  import { writable } from 'svelte/store';
  import Rewards from "./Rewards.svelte";
  import ObjectiveTypes from "./ObjectiveTypes.svelte";
  import ObjectiveGroups from "./ObjectiveGroups.svelte";
  import Objectives from "./Objectives.svelte";
  import Requirements from "./Requirements.svelte";
  import Conditions from "./Conditions.svelte";
  import Countries from "./Countries.svelte";
  import Leagues from "./Leagues.svelte";
  import Teams from "./Teams.svelte";
  import PlayerAttributes from "./PlayerAttributes.svelte";
  import PlayerAttributeRatings from "./PlayerAttributeRatings.svelte";
  import Positions from "./Positions.svelte";
  import Players from "./Players.svelte";
  import Feet from "./Feet.svelte";
  import BodyTypes from "./BodyTypes.svelte";
  import AcceleRATETypes from "./AcceleRATETypes.svelte";

  const activeTab = writable('rewards');

  function setActiveTab(tab: string) {
    activeTab.set(tab);
  }
</script>

<style>
  /* ... existing styles ... */
</style>

<div>
  <h2>Admin Page</h2>
  <div class="tabs">
    <button type="button" class="tab" class:active={$activeTab === 'rewards'} on:click={() => setActiveTab('rewards')}>Rewards</button>
    <button type="button" class="tab" class:active={$activeTab === 'objectiveTypes'} on:click={() => setActiveTab('objectiveTypes')}>Objective Types</button>
    <button type="button" class="tab" class:active={$activeTab === 'objectiveGroups'} on:click={() => setActiveTab('objectiveGroups')}>Objective Groups</button>
    <button type="button" class="tab" class:active={$activeTab === 'objectives'} on:click={() => setActiveTab('objectives')}>Objectives</button>
    <button type="button" class="tab" class:active={$activeTab === 'requirements'} on:click={() => setActiveTab('requirements')}>Requirements</button>
    <button type="button" class="tab" class:active={$activeTab === 'conditions'} on:click={() => setActiveTab('conditions')}>Conditions</button>
    <button type="button" class="tab" class:active={$activeTab === 'countries'} on:click={() => setActiveTab('countries')}>Countries</button>
    <button type="button" class="tab" class:active={$activeTab === 'leagues'} on:click={() => setActiveTab('leagues')}>Leagues</button>
    <button type="button" class="tab" class:active={$activeTab === 'teams'} on:click={() => setActiveTab('teams')}>Teams</button>
    <button type="button" class="tab" class:active={$activeTab === 'playerAttributes'} on:click={() => setActiveTab('playerAttributes')}>Player Attributes</button>
    <button type="button" class="tab" class:active={$activeTab === 'playerAttributeRatings'} on:click={() => setActiveTab('playerAttributeRatings')}>Player Attribute Ratings</button>
    <button type="button" class="tab" class:active={$activeTab === 'positions'} on:click={() => setActiveTab('positions')}>Positions</button>
    <button type="button" class="tab" class:active={$activeTab === 'players'} on:click={() => setActiveTab('players')}>Players</button>
    <button type="button" class="tab" class:active={$activeTab === 'feet'} on:click={() => setActiveTab('feet')}>Feet</button>
    <button type="button" class="tab" class:active={$activeTab === 'bodyTypes'} on:click={() => setActiveTab('bodyTypes')}>Body Types</button>
    <button type="button" class="tab" class:active={$activeTab === 'acceleRATETypes'} on:click={() => setActiveTab('acceleRATETypes')}>AcceleRATE Types</button>
  </div>
  <div class="tab-content">
    {#if $activeTab === 'rewards'}
      <Rewards />
    {:else if $activeTab === 'objectiveTypes'}
      <ObjectiveTypes />
    {:else if $activeTab === 'objectiveGroups'}
      <ObjectiveGroups />
    {:else if $activeTab === 'objectives'}
      <Objectives />
    {:else if $activeTab === 'requirements'}
      <Requirements />
    {:else if $activeTab === 'conditions'}
      <Conditions />
    {:else if $activeTab === 'countries'}
      <Countries />
    {:else if $activeTab === 'leagues'}
      <Leagues />
    {:else if $activeTab === 'teams'}
      <Teams />
    {:else if $activeTab === 'playerAttributes'}
      <PlayerAttributes />
    {:else if $activeTab === 'playerAttributeRatings'}
      <PlayerAttributeRatings />
    {:else if $activeTab === 'positions'}
      <Positions />
      {:else if $activeTab === 'players'}
      <Players />
    {:else if $activeTab === 'feet'}
      <Feet />
    {:else if $activeTab === 'bodyTypes'}
      <BodyTypes />
    {:else if $activeTab === 'acceleRATETypes'}
      <AcceleRATETypes />
    {/if}
  </div>
</div>