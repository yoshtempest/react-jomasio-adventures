import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Locations } from "./sections/Locations";
import { Combat } from "./sections/Combat";
import { Characters } from "./sections/Characters";
import { FunnyMoments } from "./sections/FunnyMoments";
import { HowToPlay } from "./sections/HowToPlay";
import { CTA } from "./sections/CTA";
import { Footer } from "./sections/Footer";
import styles from "./styles.module.css";

export default function Landing() {
  return (
    <div className={styles.page}>
      <Hero />
      <About />
      <Locations />
      <Combat />
      <Characters />
      <FunnyMoments />
      <HowToPlay />
      <CTA />
      <Footer />
    </div>
  );
}
