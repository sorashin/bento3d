import { atom } from "jotai";
import firebase from "firebase/compat/app";

export type UserState = {
  uid?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
};

export const userStateAtom = atom<UserState>({
  uid: "yiEydQT9voUO0QD9H1875A9UuH12",
  name: "中島慎太郎",
  email: "naka52shin@gmail.com",
  imageUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocL-JcPbXC3_N5s3oUuJqM8HA2ZJFv3hhzmXPARwuRyJLQ=s96-c",
});

export const signInAtom = atom(null, async (get, set) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  // You need to replace `this.$auth` with your firebase auth instance
  await firebase.auth().signInWithPopup(provider);
});

export const signOut = atom(null, async (get, set) => {
  // You need to replace `this.$auth` with your firebase auth instance
  await firebase.auth().signOut();
});
