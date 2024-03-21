// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import * as user from './user';
import { atom } from 'jotai'




// export const getters = getterTree(state, {});
// export const mutations = mutationTree(state, {});
// export const actions = actionTree({ state, getters, mutations }, {});

export const openAIAPIKeyAtom = atom<string>('')
export const selectedColorAtom = atom<string>('')