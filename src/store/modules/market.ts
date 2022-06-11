import GasPriceService from '@/services/gas-price/gas-price.service';
import { rpcProviderService } from '@/services/rpc-provider/rpc-provider.service';

interface MarketState {
  gasPrice: number;
  loading: boolean;
}

const gasPriceService = new GasPriceService();

const state: MarketState = {
  gasPrice: 0,
  loading: false
};

const actions = {
  async getGasPrice({ commit }) {
    // const gasPrice = await gasPriceService.getLatest();
    // console.log('gasPriceService', gasPriceService);
    // commit('setGasPrice', gasPrice?.price);

    const gasPrice = (
      await rpcProviderService.jsonProvider.getGasPrice()
    ).toNumber();

    commit('setGasPrice', gasPrice);
  }
};

const mutations = {
  setGasPrice(_state: MarketState, price: number) {
    _state.gasPrice = price;
  },

  setLoading(_state: MarketState, val: boolean) {
    _state.loading = val;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
