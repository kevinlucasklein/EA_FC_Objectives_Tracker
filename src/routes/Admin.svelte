<script lang="ts">
    import { writable } from 'svelte/store';
    import Rewards from "./Rewards.svelte";
  
    // Remove the unused export property 'url'
    // export let url = "";
  
    // Create a writable store to keep track of the active tab
    const activeTab = writable('rewards');
  
    // Function to set the active tab
    function setActiveTab(tab: string) {
      activeTab.set(tab);
    }
  </script>
  
  <style>
    .tabs {
      display: flex;
      cursor: pointer;
    }
    .tab {
      padding: 10px;
      border: 1px solid #ccc;
      border-bottom: none;
      background-color: #f1f1f1;
    }
    .tab.active {
      background-color: #fff;
      border-bottom: 1px solid #fff;
    }
    .tab-content {
      border: 1px solid #ccc;
      padding: 10px;
    }
  </style>
  
  <div>
    <h2>Admin Page</h2>
    <div class="tabs">
      <button type="button" class="tab" class:active={$activeTab === 'rewards'} on:click={() => setActiveTab('rewards')}>Rewards</button>
      <!-- Add more tabs here if needed -->
    </div>
    <div class="tab-content">
      {#if $activeTab === 'rewards'}
        <Rewards /> <!-- Show Rewards component when the Rewards tab is active -->
      {/if}
      <!-- Add more tab contents here if needed -->
    </div>
  </div>