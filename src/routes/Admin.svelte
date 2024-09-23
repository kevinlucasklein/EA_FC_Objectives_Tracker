<script lang="ts">
    import { writable } from 'svelte/store';
    import Rewards from "./Rewards.svelte";
    import ObjectiveTypes from "./ObjectiveTypes.svelte";
    import ObjectiveGroups from "./ObjectiveGroups.svelte";
    import Objectives from "./Objectives.svelte";
  
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
      {/if}
    </div>
  </div>