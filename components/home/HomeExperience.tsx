import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";
import styles from "./HomeExperience.module.css";

export function HomeExperience({ locale }: { locale: Locale }) {
  const copy = getDictionary(locale).home.experience;
  const link = (path: string) => localeHref(locale, path);

  return (
    <article className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-title">
        <Image
          className={styles.heroImage}
          src="/assets/home/paris-hero.webp"
          alt={copy.hero.imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className={styles.heroShade} />
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{copy.hero.eyebrow}</p>
          <h1 id="home-title">{copy.hero.title}</h1>
          <p className={styles.heroBody}>{copy.hero.body}</p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="#hikayeler">
              {copy.hero.primary}
            </Link>
            <Link className={styles.textAction} href={`${link("/")}?replay=1`}>
              {copy.hero.secondary}
            </Link>
          </div>
          <p className={styles.heroNote}>{copy.hero.note}</p>
        </div>
        <a className={styles.scrollCue} href="#hikayeler" aria-label={copy.hero.scrollAria}>
          <span />
        </a>
      </section>

      <section id="hikayeler" className={styles.promise} aria-labelledby="promise-title">
        <p className={styles.eyebrow}>{copy.promise.eyebrow}</p>
        <h2 id="promise-title">{copy.promise.title}</h2>
        <p>{copy.promise.body}</p>
        <div className={styles.promiseSteps}>
          {copy.promise.steps.map((step, index) => (
            <div key={step.title} className={styles.promiseStep}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CityChapter
        id="ana-nokta"
        image="/assets/home/istanbul-memory-point-v2.webp"
        alt={copy.istanbul.imageAlt}
        city={copy.istanbul.city}
        eyebrow={copy.istanbul.eyebrow}
        title={copy.istanbul.title}
        body={copy.istanbul.body}
        detail={copy.istanbul.detail}
        tone="coral"
      />

      <section className={styles.journey} aria-labelledby="journey-title">
        <div className={styles.routeLine} aria-hidden="true" />
        <Image
          className={styles.travelingLetter}
          src="/assets/home/traveling-letter.webp"
          alt=""
          width={760}
          height={507}
          sizes="(max-width: 700px) 220px, 360px"
        />
        <div className={styles.journeyCopy}>
          <p className={styles.eyebrow}>{copy.journey.eyebrow}</p>
          <h2 id="journey-title">{copy.journey.title}</h2>
          <p>{copy.journey.body}</p>
        </div>
      </section>

      <CityChapter
        id="zaman-kapsulu"
        image="/assets/home/kyoto-time-capsule-v2.webp"
        alt={copy.kyoto.imageAlt}
        city={copy.kyoto.city}
        eyebrow={copy.kyoto.eyebrow}
        title={copy.kyoto.title}
        body={copy.kyoto.body}
        detail={copy.kyoto.detail}
        tone="amber"
        reverse
      />

      <section id="muhurler" className={styles.seals} aria-labelledby="seals-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{copy.seals.eyebrow}</p>
          <h2 id="seals-title">{copy.seals.title}</h2>
          <p>{copy.seals.body}</p>
        </div>
        <div className={styles.sealRail}>
          {copy.seals.items.map((item, index) => (
            <article className={styles.sealCard} key={item.title}>
              <span className={`${styles.sealMark} ${styles[`seal${index + 1}`]}`} aria-hidden="true">
                {item.symbol}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.trail} aria-labelledby="trail-title">
        <div className={styles.trailCopy}>
          <p className={styles.eyebrow}>{copy.trail.eyebrow}</p>
          <h2 id="trail-title">{copy.trail.title}</h2>
          <p>{copy.trail.body}</p>
          <ul>
            {copy.trail.points.map((point) => <li key={point}>{point}</li>)}
          </ul>
        </div>
        <div className={styles.phoneShell}>
          <Image
            src="/assets/home/miami-trail-map.webp"
            alt={copy.trail.imageAlt}
            width={960}
            height={2075}
            loading="eager"
            sizes="(max-width: 700px) 72vw, 390px"
          />
        </div>
      </section>

      <section id="guven" className={styles.trust} aria-labelledby="trust-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>{copy.trust.eyebrow}</p>
          <h2 id="trust-title">{copy.trust.title}</h2>
          <p>{copy.trust.body}</p>
        </div>
        <div className={styles.trustGrid}>
          {copy.trust.items.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.faq} aria-labelledby="faq-title">
        <div>
          <p className={styles.eyebrow}>{copy.faq.eyebrow}</p>
          <h2 id="faq-title">{copy.faq.title}</h2>
          <p>{copy.faq.body}</p>
          <Link className={styles.textAction} href={link("/support/faq")}>{copy.faq.more}</Link>
        </div>
        <div className={styles.faqList}>
          {copy.faq.items.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="indir" className={styles.finalCta} aria-labelledby="final-title">
        <div>
          <p className={styles.eyebrow}>{copy.final.eyebrow}</p>
          <h2 id="final-title">{copy.final.title}</h2>
          <p>{copy.final.body}</p>
        </div>
        <div className={styles.finalActions}>
          <Link className={styles.primaryAction} href={link("/download")}>{copy.final.primary}</Link>
          <Link className={styles.textAction} href={link("/support")}>{copy.final.secondary}</Link>
        </div>
      </section>
    </article>
  );
}

function CityChapter({
  id,
  image,
  alt,
  city,
  eyebrow,
  title,
  body,
  detail,
  tone,
  reverse = false,
}: {
  id: string;
  image: string;
  alt: string;
  city: string;
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
  tone: "coral" | "amber";
  reverse?: boolean;
}) {
  return (
    <section id={id} className={`${styles.cityChapter} ${reverse ? styles.reverse : ""}`}>
      <div className={styles.cityMedia}>
        <Image src={image} alt={alt} fill sizes="100vw" loading="eager" />
      </div>
      <div className={styles.cityCopy}>
        <div className={styles.cityLead}>
          <p className={styles.cityName}>{city}</p>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className={styles.cityBody}>
          <p>{body}</p>
          <p className={`${styles.detail} ${styles[tone]}`}>{detail}</p>
        </div>
      </div>
    </section>
  );
}
