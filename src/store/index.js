import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pharmacyList: []
  },
  mutations: {
    setPharmacyList (state, payload) {
      state.pharmacyList = payload
    }
  },
  actions: {
    getPharmacyList ({ commit }, payload) {
      commit('setPharmacyList', payload)
    }
  },
  modules: {
  }
})
