<script lang="ts">
    import { apiRequest } from '../utils/api';
    
    async function fetchObjectives() {
      try {
        const response = await apiRequest('/api/objectives');
        if (response.ok) {
          const objectives = await response.json();
          // Handle the objectives data
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Error fetching objectives:', error);
      }
    }
    </script>