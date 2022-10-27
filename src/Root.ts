import { defineComponent, h } from 'vue';

import App from './App.vue';
import * as providerMap from './providers';

// return an array composing of the objects and functions from the information providers
const providers = Object.values(providerMap);

// create a component that will be used as the root component
export default defineComponent({
  components: {
    App,
    ...providerMap
  },

  render() {
    // recursively renders all providers and the app
    function renderProviders(providers) {
      if (!providers.length) return h(App);

      const [provider, ...remainingProviders] = providers;
      return h(
        provider,
        {},
        {
          default() {
            return [renderProviders(remainingProviders)];
          }
        }
      );
    }

    return renderProviders(providers);
  }
});
