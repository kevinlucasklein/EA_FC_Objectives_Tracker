<script lang="ts">
    import { onMount } from 'svelte';
    import { apiRequest } from '../utils/api';
  
    type Country = {
      countryid: number;
      name: string;
    };
  
    let countries: Country[] = [];
    let isLoading = true;
    let newCountry: Omit<Country, 'countryid'> = {
      name: ''
    };
  
    onMount(async () => {
      console.log('Countries component mounted');
      await fetchCountries();
      isLoading = false;
    });
  
    async function fetchCountries() {
      try {
        const response = await apiRequest('/api/countries');
        if (response.ok) {
          countries = await response.json();
        } else {
          console.error('Failed to fetch countries');
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }
  
    async function addCountry() {
      try {
        const response = await apiRequest('/api/countries', {
          method: 'POST',
          body: JSON.stringify(newCountry)
        });
        if (response.ok) {
          const addedCountry = await response.json();
          countries = [...countries, addedCountry].sort((a, b) => a.name.localeCompare(b.name));
          newCountry.name = '';
        } else {
          console.error('Failed to add country');
        }
      } catch (error) {
        console.error('Error adding country:', error);
      }
    }
  
    async function updateCountry(country: Country) {
      try {
        const response = await apiRequest('/api/countries', {
          method: 'PUT',
          body: JSON.stringify(country)
        });
        if (response.ok) {
          const updatedCountry = await response.json();
          countries = countries.map(c => c.countryid === updatedCountry.countryid ? updatedCountry : c)
                               .sort((a, b) => a.name.localeCompare(b.name));
        } else {
          console.error('Failed to update country');
        }
      } catch (error) {
        console.error('Error updating country:', error);
      }
    }
  
    async function deleteCountry(countryID: number) {
      try {
        const response = await apiRequest(`/api/countries/${countryID}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          countries = countries.filter(c => c.countryid !== countryID);
        } else {
          console.error('Failed to delete country');
        }
      } catch (error) {
        console.error('Error deleting country:', error);
      }
    }
  </script>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <div>
      <h2>Countries</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each countries as country}
            <tr>
              <td>{country.countryid}</td>
              <td contenteditable on:blur={() => updateCountry(country)}>{country.name}</td>
              <td>
                <button on:click={() => deleteCountry(country.countryid)}>Delete</button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
  
      <h3>Add New Country</h3>
      <form on:submit|preventDefault={addCountry}>
        <label>
          Name:
          <input type="text" bind:value={newCountry.name} required />
        </label>
        <button type="submit">Add Country</button>
      </form>
    </div>
  {/if}