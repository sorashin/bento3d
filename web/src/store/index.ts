// import { getAccessorType, getterTree, mutationTree, actionTree } from 'typed-vuex';

import { atom } from 'jotai'
export type BoxConfig = {
    totalWidth:number,
	totalHeight:number,
	totalDimension:number,
	padding:number,
	colorMode:number,
	partitionThickness:number,
    mm2pixel:number
}

export const boxConfigAtom = atom<BoxConfig>({
    totalWidth: 100,
    totalHeight: 100,
    totalDimension: 100,
    padding: 3,
    colorMode: 0,
    partitionThickness: 2,
    mm2pixel:0.01
})

export type Grid = {
    index:number,
	label:string,
	width:number,
    height:number,
	division:number,
}

export const gridAtoms = atom<Grid[]>([
    {
        index: 0,
        label: '',
        width: 100,
        height:100,
        division: 1
    }
])

export const openAIAPIKeyAtom = atom<string>('')
export const selectedColorAtom = atom<string>('')
export const screenModeAtom = atom<number>(0)

//update totalwidth along with length of gridAtoms
export const calculateSizeAction = atom(
    // 同じコンポーネント内でデータも扱うなら一緒にした方がimportを減らせます
    (get) => get(boxConfigAtom),
    // 非同期もOK
    
    async (get, set, pixelSize:number) => {
    const w = get(gridAtoms).reduce((acc, grid) => acc + grid.width + get(boxConfigAtom).padding*2, 0)
      set(boxConfigAtom, {
        ...get(boxConfigAtom),
        totalWidth:w,
        mm2pixel:pixelSize/w
      });
    },
  );