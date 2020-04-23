import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stroeList: [],
    pharmacyList: [],
    selectData: []
  },
  mutations: {
    setstroeList (state, payload) {
      state.stroeList = payload
    },
    setPharmacyList (state, payload) {
      let data = payload
      let tw = /(台|臺)../
      let res = []
      if (!data) {
        state.pharmacyList = res
      } else {
        if (data.match(tw)) {
          data = data.split('台').join('')
        }
        let regExp = new RegExp(data, 'g')
        res = state.stroeList.filter((features) => {
          return features.properties.address.match(regExp)
        })
        state.pharmacyList = res
      }
    },
    setselectData (state, payload) {
      state.selectData = payload
    }
  },
  actions: {
    getstroeList ({ commit }, payload) {
      commit('setstroeList', payload)
    },
    getPharmacyList ({ commit }, payload) {
      commit('setPharmacyList', payload)
    },
    getselectData ({ commit }, payload) {
      commit('setselectData', payload)
    }
  },
  getters: {
    statePharmacyList: state => state.pharmacyList,
    setselectData: state => state.selectData
  },
  modules: {
  }
})
