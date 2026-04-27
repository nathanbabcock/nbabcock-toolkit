import { useSyncExternalStore } from 'react'

const subscribe = () => () => { }

/**
 * Idiomatically check if the component is rendering during SSR vs. clientside
 * by leveraging the two different getSnapshot functions of `useSyncExternalStore`
 *
 * @source Claude, https://github.com/sergiodxa/remix-utils/blob/main/src/react/use-hydrated.ts
 */
export function useHydrated() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}
