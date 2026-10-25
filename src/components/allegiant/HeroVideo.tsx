import { fridgeStory } from "@/data/allegiant-stories";
import { StoryVideo } from "./StoryVideo";

/** Hero de la página: la historia en video de la heladera. */
export function HeroVideo() {
  return <StoryVideo story={fridgeStory} variant="hero" />;
}
