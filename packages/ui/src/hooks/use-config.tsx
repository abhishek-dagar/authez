// const configAtom = atomWithStorage<Config>("config", {
//   style: "default",
//   theme: "zinc",
//   radius: 0.5,
// })

export function useConfig() {
  const Config = {
    style: "default",
    theme: "zinc",
    radius: 0.5,
  };
  return [Config];
}
