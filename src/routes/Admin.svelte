<script lang="ts">
    import { writable } from 'svelte/store';
    import Rewards from "./Rewards.svelte";
    import ObjectiveTypes from "./ObjectiveTypes.svelte";
    import ObjectiveGroups from "./ObjectiveGroups.svelte";
    import Objectives from "./Objectives.svelte";
    import Requirements from "./Requirements.svelte";
    import Conditions from "./Conditions.svelte";
    import Countries from "./Countries.svelte";
  
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
      {/if}
    </div>
  </div>