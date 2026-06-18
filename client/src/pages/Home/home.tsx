import { useRef } from "react";
import { Link } from "react-router-dom";
import type { ComponentType } from "react";
import { usePointerTiltHandlers } from "../../hooks/usePointerTilt";
import {
  ArrowRightIcon,
  DecoSoftCloud,
  DecoSoftCrescentMoon,
  DecoSoftSparkle,
  FeatureIconCardsStar,
  FeatureIconQuestionBubble,
  NavIconSun,
  SparkleIcon,
} from "../../components/Nav/NavIcons";
import "./home.css";

type FeatureIconProps = { className?: string };

const FEATURES: {
  to: string;
  title: string;
  text: string;
  theme: "purple" | "pink" | "green";
  Icon: ComponentType<FeatureIconProps>;
}[] = [
  {
    to: "/carte-du-jour",
    title: "Carte du jour",
    text: "Recevez un message inspirant chaque jour pour guider vos décisions.",
    theme: "purple",
    Icon: NavIconSun,
  },
  {
    to: "/tirage",
    title: "Tirage",
    text: "Effectuez des tirages adaptés à vos besoins et découvrez des éclairages précieux.",
    theme: "pink",
    Icon: FeatureIconCardsStar,
  },
  {
    to: "/question",
    title: "Posez une question",
    text: "Obtenez des réponses claires et bienveillantes à vos interrogations.",
    theme: "green",
    Icon: FeatureIconQuestionBubble,
  },
];

export default function Home() {
  const heroStageRef = useRef<HTMLDivElement>(null);
  const { onPointerMove, onPointerLeave } = usePointerTiltHandlers(heroStageRef);

  return (
    <div className="home">
      <main className="home__main">
        <section className="home__hero">
          <div className="home__hero-content">
            <h1 className="home__title">
              Éclairez votre esprit,
              <br />
              <span className="home__title-line">
                chaque jour.
                <SparkleIcon className="home__title-sparkle" />
              </span>
            </h1>
            <p className="home__lead">
              Découvrez la sagesse du tarot pour mieux comprendre votre chemin
              et vos énergies.
            </p>
            <div className="home__cta">
              <Link to="/profil" className="home__cta-btn">
                <span className="home__cta-sparkles" aria-hidden="true">
                  <SparkleIcon />
                  <SparkleIcon />
                  <SparkleIcon />
                </span>
                <span className="home__cta-label">Commencer</span>
              </Link>
            </div>
          </div>

          <div className="home__hero-art">
            <div className="home__hero-semicircle" aria-hidden="true" />
            <div className="home__hero-deco" aria-hidden="true">
              <DecoSoftSparkle className="home__hero-deco-star home__hero-deco-star--a" />
              <DecoSoftSparkle className="home__hero-deco-star home__hero-deco-star--b" />
              <DecoSoftSparkle className="home__hero-deco-star home__hero-deco-star--c" />
              <DecoSoftSparkle className="home__hero-deco-star home__hero-deco-star--d" />
              <DecoSoftSparkle className="home__hero-deco-star home__hero-deco-star--e" />
              <span className="home__hero-deco-ring home__hero-deco-ring--a" />
              <span className="home__hero-deco-ring home__hero-deco-ring--b" />
              <span className="home__hero-deco-dot home__hero-deco-dot--a" />
              <span className="home__hero-deco-dot home__hero-deco-dot--b" />
              <span className="home__hero-deco-dot home__hero-deco-dot--c" />
              <span className="home__hero-deco-dot home__hero-deco-dot--d" />
              <span className="home__hero-deco-dot home__hero-deco-dot--e" />
              <span className="home__hero-deco-dot home__hero-deco-dot--f" />
              <span className="home__hero-deco-dot home__hero-deco-dot--g" />
              <span className="home__hero-deco-dot home__hero-deco-dot--h" />
            </div>
            <div
              ref={heroStageRef}
              className="home__hero-img-stage"
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            >
              <div className="home__hero-contact-shadow" aria-hidden="true" />
              <img
                className="home__hero-img"
                src="/img/hero-cartes-transparent.png"
                alt="Trois cartes de tarot — La Lune, Le Soleil et L'Étoile — entourées de cristaux, lavande et d'une bougie"
                width={663}
                height={376}
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="home__features" aria-label="Par où commencer">
          <ul className="home__feature-list">
            {FEATURES.map(({ to, title, text, theme, Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`home__feature-card home__feature-card--${theme}`}
                >
                  <span className="home__feature-deco" aria-hidden="true">
                    {(theme === "purple" || theme === "green") && (
                      <DecoSoftCloud className="home__feature-deco-soft-cloud" />
                    )}
                    {theme === "green" && (
                      <>
                        <DecoSoftCloud className="home__feature-deco-soft-cloud home__feature-deco-soft-cloud--right" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-left-cloud-sm" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--green-cloud" />
                      </>
                    )}
                    {theme === "pink" && (
                      <>
                        <span className="home__feature-cloud home__feature-cloud--a" />
                        <span className="home__feature-cloud home__feature-cloud--b" />
                      </>
                    )}
                    {theme === "purple" && (
                      <>
                        <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--a" />
                        <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--b" />
                        <DecoSoftSparkle className="home__feature-deco-soft-spark home__feature-deco-soft-spark--c" />
                      </>
                    )}
                    {theme === "pink" && (
                      <>
                        <DecoSoftCrescentMoon className="home__feature-deco-moon" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-moon" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-a" />
                        <DecoSoftSparkle className="home__feature-deco-spark home__feature-deco-spark--pink-b" />
                      </>
                    )}
                  </span>
                  <span className="home__feature-icon-wrap">
                    <Icon className="home__feature-icon" />
                  </span>
                  <span className="home__feature-body">
                    <span className="home__feature-name">{title}</span>
                    <span className="home__feature-text">{text}</span>
                  </span>
                  <span className="home__feature-arrow" aria-hidden="true">
                    <ArrowRightIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
