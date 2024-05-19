import { atom } from 'jotai'
import firebase from 'firebase/compat/app';
import { IElementable, NodeBase, UINodeBase } from '@nodi/core';

export type UserState = {
  uid?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
};
export const projectPathAtom = atom<string>('RwilFBZCXqe6LmaTFovO');
// Box Configrator：`hjLz9tMi2I3vDCpSKDk5`
//New Box Configrator : `Delz6yGjgzEzEbRyBT4h`
// Box Configurator_A : `RwilFBZCXqe6LmaTFovO`

// MountainSample： `TtmQukE3aczIe31dTMbE`

// FlowerBase：`6tqKjzrnVU56NqlSpW6U`
export const groupAtom = atom<THREE.Group|undefined>(undefined);
export const UIsAtom = atom<UINodeBase[]>([]);
export const nodesAtom = atom<NodeBase[]>([]);
export const elementsAtom = atom<IElementable[]>([]);



