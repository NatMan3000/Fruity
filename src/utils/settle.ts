// A back move shows the screen it returns to in its final state (src/hooks/useRoute.ts, renderBack), so
// the CSS entrance animations and transitions that screen's fresh mount starts are jumped to their end.
// Left alone: the View Transition's own pseudo-element animations (a page move of ours) and the app's
// Web Animations (the bag swell, the fallback slide), which have no animationName or transitionProperty.
type AnimationLike = Pick<Animation, 'effect'> & { animationName?: string; transitionProperty?: string }

export function settlesOnBack(a: AnimationLike): boolean {
  const css = 'animationName' in a || 'transitionProperty' in a
  const effect = a.effect as (AnimationEffect & { pseudoElement?: string | null }) | null
  return css && !!effect && !effect.pseudoElement
}
